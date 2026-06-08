Resumen de la sesión
Sonner unificado
- Toast gradient: fondo linear-gradient(to right, #3730a3, #6366f1) (indigo oscuro → claro), texto claro, sin richColors
- X del close button: fondo sólido rojo claro (#fef2f2), X roja (#dc2626), sin transparencia
- Título del toast: más grande (1.05rem), blanco
- Descripción: color indigo claro (#c7d2fe)
- Botón de acción (Eliminar/Devolver): rojo sólido (#ef4444)
- Toaster: se adapta a tema claro/oscuro vía useTheme
Préstamos (/prestamos)
- Confirmación sonner al devolver un préstamo (título, socio, vencimiento)
- Filtro de búsqueda en el historial (por nombre/apellido/título)
- Estado "Vencido" visual (rojo) si PRESTADO y fecha pasó
- Sacadas las cards "Libros en Catálogo" y "Ejemplares" (no aportaban)
Catálogo (/catalogo)
- Sonner: delete con confirmación toast, feedback al crear libro (reemplazo de alert())
- Métricas reales: "Préstamos Activos" usa prestamosActivos del backend
- Columna Autor separada, CDU eliminada
- Columna Disponibles: cantidadEjemplares - préstamos activos con badge verde/rojo
- Debounce de 300ms en la búsqueda
- Paginación server-side (10 x página) con navegación completa
- Eliminado select de géneros (CDU)
- Creada página /catalogo/[id] con detalle y edición inline (todos los campos MARC 21)
Backend
- libros.getAll ahora devuelve { libros, total } con skip/take
- getMetrics incluye prestamosActivos
- libros.getAll incluye _count de préstamos activos para calcular ejemplaresDisponibles
- prisma db push para sincronizar columna autorInstitucional faltante en BD
