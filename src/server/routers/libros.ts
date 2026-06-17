import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

// Schema Zod compartido para los campos MARC 21 + campos extra
const libroFieldsSchema = z.object({
  isbn: z.string().optional(),                  // MARC 020
  idioma: z.string().optional(),                // MARC 041
  clasificacion: z.string().optional(),         // MARC 080 - CDU
  autor: z.string().optional(),                 // MARC 100
  autorInstitucional: z.string().optional(),    // MARC 110
  titulo: z.string().optional(),                // MARC 245
  edicion: z.string().optional(),               // MARC 250
  lugarPublicacion: z.string().optional(),      // MARC 260 - Lugar
  editorial: z.string().optional(),             // MARC 260 - Editorial
  anioPublicacion: z.string().optional(),       // MARC 260 - Año
  descripcionFisica: z.string().optional(),     // MARC 300
  notaGeneral: z.string().optional(),           // MARC 500
  temas: z.string().optional(),                 // MARC 650
  descriptores: z.string().optional(),          // MARC 653
  colaboradores: z.string().optional(),         // MARC 700
  bibliotecario: z.string().optional(),         // MARC 900
  inventario: z.string().optional(),            // Extra - Nº inventario
  tipoMaterial: z.string().optional(),          // Extra - Tipo de material
  ubicacion: z.string().optional(),             // Extra - Ubicación actual
  portadaUrl: z.string().optional(),            // Portada
  cantidadEjemplares: z.number().default(1),
  datosMarc: z.any().optional(),
});

export const librosRouter = router({
  getAll: publicProcedure
    .input(z.object({ 
      search: z.string().optional(),
      genero: z.string().optional(),
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(10),
    }))
    .query(async ({ ctx, input }) => {
      const search = input?.search;
      const genero = input?.genero;
      const page = input?.page ?? 1;
      const pageSize = input?.pageSize ?? 10;
      const skip = (page - 1) * pageSize;

      const where: any = {};

      if (search) {
        where.OR = [
          { titulo: { contains: search, mode: 'insensitive' } },
          { autor: { contains: search, mode: 'insensitive' } },
          { autorInstitucional: { contains: search, mode: 'insensitive' } },
          { isbn: { contains: search, mode: 'insensitive' } },
          { temas: { contains: search, mode: 'insensitive' } },
          { editorial: { contains: search, mode: 'insensitive' } },
          { colaboradores: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (genero && genero !== '') {
        where.clasificacion = {
          startsWith: genero,
        };
      }

      const [libros, total] = await Promise.all([
        ctx.prisma.libro.findMany({
          where,
          include: {
            _count: {
              select: { prestamos: { where: { estado: 'PRESTADO' } } },
            },
          },
          skip,
          take: pageSize,
          orderBy: { titulo: 'asc' },
        }),
        ctx.prisma.libro.count({ where }),
      ]);

      return {
        libros: libros.map(l => ({
          ...l,
          ejemplaresDisponibles: l.cantidadEjemplares - l._count.prestamos,
        })),
        total,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.libro.findUnique({
        where: { id: input.id },
      });
    }),

  create: publicProcedure
    .input(libroFieldsSchema)
    .mutation(async ({ ctx, input }) => {
      // Filtrar campos vacíos para no guardar strings vacíos como datos
      const data: any = {};
      for (const [key, value] of Object.entries(input)) {
        if (value !== undefined && value !== null && value !== '') {
          data[key] = value;
        }
      }
      return await ctx.prisma.libro.create({
        data,
      });
    }),

  update: publicProcedure
    .input(libroFieldsSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.libro.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.libro.delete({
        where: { id: input.id },
      });
    }),

  buscar: publicProcedure
    .input(z.object({ q: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const q = input.q.trim();
      return await ctx.prisma.libro.findMany({
        where: {
          OR: [
            { isbn: { startsWith: q } },
            { titulo: { contains: q, mode: 'insensitive' } },
            { autor: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 10,
        orderBy: { titulo: 'asc' },
      });
    }),

  searchExternalByTitle: publicProcedure
    .input(z.object({ 
      titulo: z.string().min(1),
      autor: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const buildQuery = () => {
        let q = `intitle:${input.titulo}`;
        if (input.autor) q += `+inauthor:${input.autor}`;
        return q;
      };

      let found = false;
      // 1. Google Books API
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${buildQuery()}&maxResults=10`);
        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            found = true;
            return data.items.map((item: any) => {
              const info = item.volumeInfo;
              const isbn = info.industryIdentifiers?.find((i: any) => i.type === 'ISBN_13' || i.type === 'ISBN_10')?.identifier || '';
              return {
                id: item.id,
                titulo: info.title + (info.subtitle ? `: ${info.subtitle}` : ''),
                autor: info.authors?.[0] || '',
                anioPublicacion: info.publishedDate?.split('-')[0] || '',
                editorial: info.publisher || '',
                isbn,
                portadaUrl: info.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
                idioma: info.language || '',
              };
            });
          }
        } else {
          console.warn(`Google Books API devolvió status ${response.status}`);
        }
      } catch (error: any) {
        console.error('Error al consultar Google Books API:', error?.message || error);
      }

      // 2. Fallback a Open Library Search
      if (!found) {
        const query = input.autor ? `${input.titulo} ${input.autor}` : input.titulo;
        try {
          console.log(`Fallback a Open Library Search para: ${query}`);
          const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`);
          if (response.ok) {
            const data = await response.json();
            return (data.docs || []).map((doc: any) => ({
              id: doc.key,
              titulo: doc.title,
              autor: doc.author_name?.[0] || '',
              anioPublicacion: doc.first_publish_year?.toString() || '',
              editorial: doc.publisher?.[0] || '',
              isbn: doc.isbn?.[0] || '',
              portadaUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : '',
              idioma: doc.language?.[0] || '',
            }));
          }
        } catch (error: any) {
          console.error('Error al consultar Open Library Search:', error?.message || error);
        }
      }

      return [];
    }),

  getByExternalId: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${input.id}`);
        if (response.ok) {
          const data = await response.json();
          const info = data.volumeInfo;
          const isbn = info.industryIdentifiers?.find((i: any) => i.type === 'ISBN_13' || i.type === 'ISBN_10')?.identifier || '';
          return {
            isbn,
            titulo: info.title + (info.subtitle ? `: ${info.subtitle}` : ''),
            autor: info.authors?.[0] || '',
            colaboradores: info.authors?.slice(1).join(', ') || '',
            anioPublicacion: info.publishedDate?.split('-')[0] || '',
            editorial: info.publisher || '',
            lugarPublicacion: '',
            edicion: '',
            portadaUrl: info.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
            descripcionFisica: info.pageCount ? `${info.pageCount} p.` : '',
            idioma: info.language || '',
            temas: info.categories?.join(', ') || '',
          };
        }
      } catch (error: any) {
        console.error('Error al consultar Google Books API por ID:', error?.message || error);
      }
      return null;
    }),

  getByIsbnExternal: publicProcedure
    .input(z.object({ isbn: z.string() }))
    .mutation(async ({ input }) => {
      const cleanIsbn = input.isbn.replace(/[-\s]/g, '');
      let titulo = '';
      let autor = '';
      let anioPublicacion = '';
      let editorial = '';
      let lugarPublicacion = '';
      let edicion = '';
      let portadaUrl = '';
      let descripcionFisica = '';
      let idioma = '';
      let temas = '';
      let colaboradores = '';
      let found = false;

      // 1. Intentar con Google Books API
      try {
        console.log(`Intentando buscar ISBN ${cleanIsbn} en Google Books...`);
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`);
        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const info = data.items[0].volumeInfo;
            titulo = info.title || '';
            autor = info.authors?.[0] || '';
            colaboradores = info.authors?.slice(1).join(', ') || '';
            anioPublicacion = info.publishedDate?.split('-')[0] || '';
            editorial = info.publisher || '';
            idioma = info.language || '';
            temas = info.categories?.join(', ') || '';
            portadaUrl = info.imageLinks?.thumbnail?.replace('http:', 'https:') || '';
            descripcionFisica = info.pageCount ? `${info.pageCount} p.` : '';
            found = true;
          }
        } else {
          console.warn(`Google Books API devolvió status ${response.status}`);
        }
      } catch (error: any) {
        console.error('Error al consultar Google Books API:', error?.message || error);
      }

      // 2. Intentar con Open Library API como fallback
      if (!found) {
        try {
          console.log(`Intentando buscar ISBN ${cleanIsbn} en Open Library...`);
          const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`);
          if (response.ok) {
            const data = await response.json();
            const bookKey = `ISBN:${cleanIsbn}`;
            if (data[bookKey]) {
              const info = data[bookKey];
              titulo = info.title + (info.subtitle ? `: ${info.subtitle}` : '');
              const authors = info.authors?.map((a: any) => a.name) || [];
              autor = authors[0] || '';
              colaboradores = authors.slice(1).join(', ') || '';
              anioPublicacion = info.publish_date?.match(/\d{4}/)?.[0] || '';
              editorial = info.publishers?.map((p: any) => p.name).join(', ') || '';
              lugarPublicacion = info.publish_places?.map((p: any) => p.name).join(', ') || '';
              temas = info.subjects?.map((s: any) => s.name).join(', ') || '';
              portadaUrl = info.cover?.large || info.cover?.medium || info.cover?.small || '';
              descripcionFisica = info.number_of_pages ? `${info.number_of_pages} p.` : '';
              found = true;
            }
          } else {
            console.warn(`Open Library API devolvió status ${response.status}`);
          }
        } catch (error: any) {
          console.error('Error al consultar Open Library API:', error?.message || error);
        }
      }

      // 3. Intentar con WorldCat Classify API como tercer fallback (sin API key)
      if (!found) {
        try {
          console.log(`Intentando buscar ISBN ${cleanIsbn} en WorldCat Classify...`);
          const response = await fetch(`http://classify.oclc.org/classify2/classify?isbn=${cleanIsbn}&format=json`);
          if (response.ok) {
            const data = await response.json();
            const work = data.works?.[0]?.work;
            const edition = data.editions?.edition;
            if (work || edition) {
              titulo = work?.title || edition?.title || '';
              autor = work?.author || '';
              editorial = edition?.publisher || '';
              anioPublicacion = edition?.publishDate?.match(/\d{4}/)?.[0] || '';
              idioma = edition?.language || '';
              found = true;
            }
          } else {
            console.warn(`WorldCat Classify devolvió status ${response.status}`);
          }
        } catch (error: any) {
          console.error('Error al consultar WorldCat Classify:', error?.message || error);
        }
      }

      // 4. Fallback inteligente para la portada: si encontramos el libro pero no tiene portadaUrl,
      // verificamos directamente si existe en Open Library Covers usando un request HEAD rápido.
      if (found && !portadaUrl) {
        try {
          console.log(`Buscando portada directamente por ISBN ${cleanIsbn} en Open Library Covers...`);
          const coverCheckUrl = `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg?default=false`;
          const checkRes = await fetch(coverCheckUrl, { method: 'HEAD' });
          if (checkRes.ok) {
            portadaUrl = `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`;
            console.log(`Portada encontrada directamente: ${portadaUrl}`);
          } else {
            console.log('No se encontró portada directa en Open Library Covers.');
          }
        } catch (error: any) {
          console.error('Error al verificar portada directa en Open Library:', error?.message || error);
        }
      }

      if (found) {
        return {
          titulo,
          autor,
          colaboradores,
          anioPublicacion,
          editorial,
          lugarPublicacion,
          edicion,
          portadaUrl,
          descripcionFisica,
          idioma,
          temas,
        };
      }

      return null;
    }),
});
