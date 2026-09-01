import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Save, AlertCircle, Send, Archive } from 'lucide-react';
import { supabase, type NewsRow } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

type Status = NewsRow['status'];

const statusLabels: Record<Status, string> = {
  borrador: 'Borrador',
  publicado: 'Publicado',
  archivado: 'Archivado',
};

const statusColors: Record<Status, string> = {
  borrador: 'bg-ink-100 text-ink-600',
  publicado: 'bg-primary-100 text-primary-700',
  archivado: 'bg-ink-100 text-ink-400',
};

export function NewsManager() {
  const { profile } = useAuth();
  const [items, setItems] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<NewsRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = profile?.role === 'admin';
  const canPublish = ['admin', 'editor', 'publicador'].includes(profile?.role ?? '');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setItems(data as NewsRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta noticia permanentemente?')) return;
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      setItems((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const handleStatusChange = async (item: NewsRow, newStatus: Status) => {
    const updates: Partial<NewsRow> = { status: newStatus };
    if (newStatus === 'publicado' && !item.published_at) {
      updates.published_at = new Date().toISOString();
    }
    const { error } = await supabase.from('news').update(updates).eq('id', item.id);
    if (error) {
      setError(error.message);
    } else {
      setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, ...updates } : n)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-medium text-ink-900">Noticias</h1>
          <p className="mt-1 text-ink-500">Gestiona las noticias institucionales del portal.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary">
          <Plus className="h-5 w-5" />
          Nueva noticia
        </button>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="mt-8 space-y-3">
        {items.length === 0 && (
          <div className="card p-8 text-center text-ink-400">
            No hay noticias todavía. Crea la primera con el botón de arriba.
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="card p-5 flex items-center gap-4 hover:shadow-lift transition-shadow">
            {item.image_url && (
              <img src={item.image_url} alt={item.title} className="h-16 w-16 rounded-xl object-cover shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-ink-900 truncate">{item.title}</h3>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColors[item.status]}`}>
                  {statusLabels[item.status]}
                </span>
              </div>
              <p className="text-sm text-ink-400 truncate mt-0.5">{item.category} · {item.author}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {canPublish && item.status !== 'publicado' && (
                <button
                  onClick={() => handleStatusChange(item, 'publicado')}
                  className="grid place-items-center h-9 w-9 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                  title="Publicar"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
              {item.status === 'publicado' && (
                <button
                  onClick={() => handleStatusChange(item, 'archivado')}
                  className="grid place-items-center h-9 w-9 rounded-lg text-ink-500 hover:bg-ink-100 transition-colors"
                  title="Archivar"
                >
                  <Archive className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setEditing(item)}
                className="grid place-items-center h-9 w-9 rounded-lg text-ink-600 hover:bg-ink-100 transition-colors"
                title="Editar"
              >
                <Pencil className="h-4 w-4" />
              </button>
              {canDelete && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="grid place-items-center h-9 w-9 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {(editing || creating) && (
        <NewsEditor
          item={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={() => {
            setEditing(null);
            setCreating(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function NewsEditor({
  item,
  onClose,
  onSaved,
}: {
  item: NewsRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(item?.title ?? '');
  const [excerpt, setExcerpt] = useState(item?.excerpt ?? '');
  const [body, setBody] = useState(item?.body ?? '');
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? '');
  const [category, setCategory] = useState(item?.category ?? '');
  const [author, setAuthor] = useState(item?.author ?? '');
  const [status, setStatus] = useState<Status>(item?.status ?? 'borrador');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const payload: Partial<NewsRow> = { title, excerpt, body, image_url: imageUrl, category, author, status };

    if (status === 'publicado' && !item?.published_at) {
      payload.published_at = new Date().toISOString();
    }

    let result;
    if (item) {
      result = await supabase.from('news').update(payload).eq('id', item.id);
    } else {
      result = await supabase.from('news').insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
    } else {
      setSaving(false);
      onSaved();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lift w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-ink-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-lg font-semibold text-ink-900">{item ? 'Editar noticia' : 'Nueva noticia'}</h2>
          <button onClick={onClose} className="grid place-items-center h-9 w-9 rounded-lg text-ink-400 hover:bg-ink-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Categoría</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Autor / Área</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Imagen (URL)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
              className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors"
            />
            {imageUrl && <img src={imageUrl} alt="" className="mt-2 h-32 w-full rounded-xl object-cover" />}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Resumen breve</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Contenido completo</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-ink-100 px-6 py-4 flex justify-end gap-3 rounded-b-3xl">
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
