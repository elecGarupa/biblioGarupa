'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { trpc } from '@/utils/trpc';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  BookOpen,
  ArrowLeft,
  Save,
  Edit3,
  X,
  Sparkles,
  Barcode,
  Globe,
  Hash,
  User,
  Building2,
  BookMarked,
  BookCopy,
  MapPin,
  Printer,
  Calendar,
  BookA,
  FolderOpen,
  Tag,
  Users,
  StickyNote,
  Layers,
} from 'lucide-react';
export default function LibroDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const utils = trpc.useUtils();
  const [isEditing, setIsEditing] = useState(false);
  const { data: libro, isLoading } = trpc.libros.getById.useQuery({ id });

  const [form, setForm] = useState({
    isbn: '',
    idioma: '',
    clasificacion: '',
    autor: '',
    autorInstitucional: '',
    titulo: '',
    edicion: '',
    lugarPublicacion: '',
    editorial: '',
    anioPublicacion: '',
    descripcionFisica: '',
    notaGeneral: '',
    temas: '',
    descriptores: '',
    colaboradores: '',
    cantidadEjemplares: 1,
  });

  const updateLibro = trpc.libros.update.useMutation({
    onSuccess: () => {
      toast.success('Libro actualizado correctamente', { duration: 3000 });
      setIsEditing(false);
      utils.libros.getById.invalidate({ id });
      utils.libros.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { duration: 4000 });
    },
  });

  const startEditing = () => {
    if (!libro) return;
    setForm({
      isbn: libro.isbn || '',
      idioma: libro.idioma || '',
      clasificacion: libro.clasificacion || '',
      autor: libro.autor || '',
      autorInstitucional: libro.autorInstitucional || '',
      titulo: libro.titulo || '',
      edicion: libro.edicion || '',
      lugarPublicacion: libro.lugarPublicacion || '',
      editorial: libro.editorial || '',
      anioPublicacion: libro.anioPublicacion || '',
      descripcionFisica: libro.descripcionFisica || '',
      notaGeneral: libro.notaGeneral || '',
      temas: libro.temas || '',
      descriptores: libro.descriptores || '',
      colaboradores: libro.colaboradores || '',
      cantidadEjemplares: libro.cantidadEjemplares,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateLibro.mutate({ id, ...form });
  };

  if (isLoading) {
    return (
      <MainLayout title="Detalle del Libro">
        <div className="space-y-8">
          <div className="h-8 w-48 skeleton rounded-xl" />
          <div className="h-64 skeleton rounded-[2rem]" />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-12 skeleton rounded-xl" />
            <div className="h-12 skeleton rounded-xl" />
            <div className="h-12 skeleton rounded-xl" />
            <div className="h-12 skeleton rounded-xl" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!libro) {
    return (
      <MainLayout title="Detalle del Libro">
        <div className="text-center py-20">
          <p className="text-slate-400 font-semibold">Libro no encontrado</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Detalle del Libro">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/catalogo')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold text-sm transition-all"
          >
            <ArrowLeft size={18} />
            Volver al inventario
          </button>
          {!isEditing ? (
            <button
              onClick={startEditing}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
            >
              <Edit3 size={16} />
              Editar Libro
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <X size={16} />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={updateLibro.isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200 dark:shadow-emerald-900/30 disabled:opacity-50"
              >
                <Save size={16} />
                {updateLibro.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-10 text-white relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-8">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black backdrop-blur-sm">
                <BookOpen size={36} />
              </div>
              <div>
                <h2 className="text-3xl font-black font-display">{libro.titulo || 'Sin título'}</h2>
                <p className="text-indigo-200 font-bold mt-1">{libro.autor || 'Autor desconocido'}{libro.anioPublicacion ? ` (${libro.anioPublicacion})` : ''}</p>
              </div>
            </div>
            <Sparkles className="absolute -right-6 -bottom-6 text-white/10" size={160} />
          </div>

          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 pb-3">
                  Identificación
                </h3>
                {isEditing ? (
                  <>
                    <EditField icon={<Barcode size={18} />} label="ISBN" value={form.isbn} onChange={(v) => setForm(f => ({ ...f, isbn: v }))} />
                    <EditField icon={<Globe size={18} />} label="Idioma" value={form.idioma} onChange={(v) => setForm(f => ({ ...f, idioma: v }))} />
                    <EditField icon={<Hash size={18} />} label="CDU (Clasificación)" value={form.clasificacion} onChange={(v) => setForm(f => ({ ...f, clasificacion: v }))} />
                    <EditField icon={<BookMarked size={18} />} label="Título" value={form.titulo} onChange={(v) => setForm(f => ({ ...f, titulo: v }))} />
                    <EditField icon={<User size={18} />} label="Autor" value={form.autor} onChange={(v) => setForm(f => ({ ...f, autor: v }))} />
                    <EditField icon={<Building2 size={18} />} label="Autor Institucional" value={form.autorInstitucional} onChange={(v) => setForm(f => ({ ...f, autorInstitucional: v }))} />
                    <EditField icon={<BookCopy size={18} />} label="Edición" value={form.edicion} onChange={(v) => setForm(f => ({ ...f, edicion: v }))} />
                    <EditNumericField icon={<Layers size={18} />} label="Ejemplares" value={form.cantidadEjemplares} onChange={(v) => setForm(f => ({ ...f, cantidadEjemplares: v }))} />
                  </>
                ) : (
                  <>
                    <InfoRow icon={<Barcode size={18} />} label="ISBN" value={libro.isbn || '—'} />
                    <InfoRow icon={<Globe size={18} />} label="Idioma" value={libro.idioma || '—'} />
                    <InfoRow icon={<Hash size={18} />} label="CDU (Clasificación)" value={libro.clasificacion || '—'} />
                    <InfoRow icon={<BookMarked size={18} />} label="Título" value={libro.titulo || '—'} />
                    <InfoRow icon={<User size={18} />} label="Autor" value={libro.autor || '—'} />
                    <InfoRow icon={<Building2 size={18} />} label="Autor Institucional" value={libro.autorInstitucional || '—'} />
                    <InfoRow icon={<BookCopy size={18} />} label="Edición" value={libro.edicion || '—'} />
                    <InfoRow icon={<Layers size={18} />} label="Ejemplares" value={String(libro.cantidadEjemplares)} />
                  </>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 pb-3">
                  Publicación y Descripción
                </h3>
                {isEditing ? (
                  <>
                    <EditField icon={<MapPin size={18} />} label="Lugar de Publicación" value={form.lugarPublicacion} onChange={(v) => setForm(f => ({ ...f, lugarPublicacion: v }))} />
                    <EditField icon={<Printer size={18} />} label="Editorial" value={form.editorial} onChange={(v) => setForm(f => ({ ...f, editorial: v }))} />
                    <EditField icon={<Calendar size={18} />} label="Año de Publicación" value={form.anioPublicacion} onChange={(v) => setForm(f => ({ ...f, anioPublicacion: v }))} />
                    <EditField icon={<BookA size={18} />} label="Descripción Física" value={form.descripcionFisica} onChange={(v) => setForm(f => ({ ...f, descripcionFisica: v }))} />
                    <EditField icon={<StickyNote size={18} />} label="Nota General" value={form.notaGeneral} onChange={(v) => setForm(f => ({ ...f, notaGeneral: v }))} />
                    <EditField icon={<FolderOpen size={18} />} label="Temas" value={form.temas} onChange={(v) => setForm(f => ({ ...f, temas: v }))} />
                    <EditField icon={<Tag size={18} />} label="Descriptores" value={form.descriptores} onChange={(v) => setForm(f => ({ ...f, descriptores: v }))} />
                    <EditField icon={<Users size={18} />} label="Colaboradores" value={form.colaboradores} onChange={(v) => setForm(f => ({ ...f, colaboradores: v }))} />
                  </>
                ) : (
                  <>
                    <InfoRow icon={<MapPin size={18} />} label="Lugar de Publicación" value={libro.lugarPublicacion || '—'} />
                    <InfoRow icon={<Printer size={18} />} label="Editorial" value={libro.editorial || '—'} />
                    <InfoRow icon={<Calendar size={18} />} label="Año de Publicación" value={libro.anioPublicacion || '—'} />
                    <InfoRow icon={<BookA size={18} />} label="Descripción Física" value={libro.descripcionFisica || '—'} />
                    <InfoRow icon={<StickyNote size={18} />} label="Nota General" value={libro.notaGeneral || '—'} />
                    <InfoRow icon={<FolderOpen size={18} />} label="Temas" value={libro.temas || '—'} />
                    <InfoRow icon={<Tag size={18} />} label="Descriptores" value={libro.descriptores || '—'} />
                    <InfoRow icon={<Users size={18} />} label="Colaboradores" value={libro.colaboradores || '—'} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function EditField({ icon, label, value, onChange }: { icon: React.ReactNode, label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
    </div>
  );
}

function EditNumericField({ icon, label, value, onChange }: { icon: React.ReactNode, label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <input
          type="number"
          min={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
    </div>
  );
}
