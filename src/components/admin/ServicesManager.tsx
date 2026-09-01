import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase, type ServiceRow } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function ServicesManager() {
  const { profile } = useAuth();
  const [items, setItems] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = profile?.role === 'admin';

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setItems(data as ServiceRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este servicio permanentemente?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      setItems((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const togglePublished = async (item: ServiceRow) => {
    const { error } = await supabase
      .from('services')
      .update({ is_published: !item.is_published })
      .eq('id', item.id);
    if (error) {
      setError(error.message);
    } else {
      setItems((prev) => prev.map((s) => (s.id === item.id ? { ...s, is_published: !s.is_published } : s)));
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
          <h1 className="text-2xl font-display font-medium text-ink-900">Servicios y especialidades</h1>
          <p className="mt-1 text-ink-500">Administra las especialidades que se muestran en el portal.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary">
          <Plus className="h-5 w-5" />
          Nuevo servicio
        </button>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="card p-5 flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-ink-900 truncate">{item.title}</h3>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    item.is_published ? 'bg-primary-100 text-primary-700' : 'bg-ink-100 text-ink-500'
                  }`}
                >
                  {item.is_published ? 'Publicado' : 'Borrador'}
                </span>
              </div>
              <p className="text-sm text-ink-400 mt-1 line-clamp-2">{item.description}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => togglePublished(item)}
                className="grid place-items-center h-9 w-9 rounded-lg text-ink-600 hover:bg-ink-100 transition-colors"
                title={item.is_published ? 'Ocultar' : 'Publicar'}
              >
                {item.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
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
        <ServiceEditor
          service={editing}
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

function ServiceEditor({
  service,
  onClose,
  onSaved,
}: {
  service: ServiceRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(service?.title ?? '');
  const [description, setDescription] = useState(service?.description ?? '');
  const [body, setBody] = useState(service?.body ?? '');
  const [iconName, setIconName] = useState(service?.icon_name ?? 'stethoscope');
  const [sortOrder, setSortOrder] = useState(service?.sort_order ?? 0);
  const [isPublished, setIsPublished] = useState(service?.is_published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const payload: Partial<ServiceRow> = {
      title,
      description,
      body,
      icon_name: iconName,
      sort_order: sortOrder,
      is_published: isPublished,
    };

    let result;
    if (service) {
      result = await supabase.from('services').update(payload).eq('id', service.id);
    } else {
      result = await supabase.from('services').insert(payload);
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
      <div className="bg-white rounded-3xl shadow-lift w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-ink-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-lg font-semibold text-ink-900">{service ? 'Editar servicio' : 'Nuevo servicio'}</h2>
          <button onClick={onClose} className="grid place-items-center h-9 w-9 rounded-lg text-ink-400 hover:bg-ink-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Nombre del servicio</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Icono</label>
              <input
                type="text"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                placeholder="stethoscope, heart, baby…"
                className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Orden</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Descripción breve</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Contenido detallado (opcional)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors resize-none"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-5 w-5 rounded border-ink-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-ink-700">Publicado (visible en el portal)</span>
          </label>

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
