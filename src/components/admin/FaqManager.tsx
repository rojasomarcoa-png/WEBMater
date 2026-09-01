import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase, type FaqRow } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function FaqManager() {
  const { profile } = useAuth();
  const [items, setItems] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FaqRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = profile?.role === 'admin';

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('faq_items')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setItems(data as FaqRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta pregunta permanentemente?')) return;
    const { error } = await supabase.from('faq_items').delete().eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      setItems((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const togglePublished = async (item: FaqRow) => {
    const { error } = await supabase
      .from('faq_items')
      .update({ is_published: !item.is_published })
      .eq('id', item.id);
    if (error) {
      setError(error.message);
    } else {
      setItems((prev) => prev.map((f) => (f.id === item.id ? { ...f, is_published: !f.is_published } : f)));
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
          <h1 className="text-2xl font-display font-medium text-ink-900">Preguntas frecuentes</h1>
          <p className="mt-1 text-ink-500">Gestiona el contenido de la sección de información para pacientes.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary">
          <Plus className="h-5 w-5" />
          Nueva pregunta
        </button>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="card p-5 flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-ink-900">{item.question}</h3>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                    item.is_published ? 'bg-primary-100 text-primary-700' : 'bg-ink-100 text-ink-500'
                  }`}
                >
                  {item.is_published ? 'Publicado' : 'Oculto'}
                </span>
              </div>
              <p className="text-sm text-ink-400 mt-1 line-clamp-2">{item.answer}</p>
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
        <FaqEditor
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

function FaqEditor({
  item,
  onClose,
  onSaved,
}: {
  item: FaqRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [question, setQuestion] = useState(item?.question ?? '');
  const [answer, setAnswer] = useState(item?.answer ?? '');
  const [sortOrder, setSortOrder] = useState(item?.sort_order ?? 0);
  const [isPublished, setIsPublished] = useState(item?.is_published ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const payload: Partial<FaqRow> = { question, answer, sort_order: sortOrder, is_published: isPublished };

    let result;
    if (item) {
      result = await supabase.from('faq_items').update(payload).eq('id', item.id);
    } else {
      result = await supabase.from('faq_items').insert(payload);
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
          <h2 className="text-lg font-semibold text-ink-900">{item ? 'Editar pregunta' : 'Nueva pregunta'}</h2>
          <button onClick={onClose} className="grid place-items-center h-9 w-9 rounded-lg text-ink-400 hover:bg-ink-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Pregunta</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Respuesta</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-2.5 text-ink-900 focus:border-primary-400 focus:bg-white transition-colors resize-none"
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
