import React, { useState, useEffect, useRef } from 'react';
import { X, AlertCircle, Upload, Trash2, Loader2, Link as LinkIcon } from 'lucide-react';
import { NewsItem, NewsCategory, NEWS_CATEGORY_LABELS } from '../../types/news';
import { processAndUploadNewsImage } from '../../services/storageService';

interface NewsFormModalProps {
  isOpen: boolean;
  news: NewsItem | null;
  onClose: () => void;
  onSave: (newsData: Partial<NewsItem> & Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const NewsFormModal: React.FC<NewsFormModalProps> = ({
  isOpen,
  news,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NewsCategory>('filosofia');
  const [publishedAt, setPublishedAt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setSummary(news.summary);
      setContent(news.content);
      setCategory(news.category);
      setPublishedAt(news.publishedAt);
      setImageUrl(news.imageUrl || '');
      setAuthor(news.author || '');
      setIsPublished(news.isPublished);
    } else {
      setTitle('');
      setSummary('');
      setContent('');
      setCategory('filosofia');
      setPublishedAt(new Date().toISOString().split('T')[0]!);
      setImageUrl('');
      setAuthor('Comunicação Pampulha');
      setIsPublished(true);
    }
    setError(null);
    setImageUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [news, isOpen]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }

    setIsUploadingImage(true);
    setImageUploadError(null);

    try {
      const uploadedUrl = await processAndUploadNewsImage(file, news?.id);
      setImageUrl(uploadedUrl);
    } catch (err: any) {
      console.error('Erro no upload da imagem:', err);
      setImageUploadError(err.message || 'Erro ao processar imagem.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setImageUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !summary.trim() || !content.trim()) {
      setError('Título, resumo e conteúdo completo são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        id: news?.id,
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        category,
        publishedAt,
        imageUrl: imageUrl.trim() || undefined,
        author: author.trim() || undefined,
        isPublished,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao salvar notícia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-form-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 id="news-form-title" className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {news ? 'Editar Notícia' : 'Nova Notícia / Comunicado'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar formulário de notícia"
            className="p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="news-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Título da Notícia *
            </label>
            <input
              id="news-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Nova Acrópole Pampulha abre inscrições"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#086357]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="news-category-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Categoria *
              </label>
              <select
                id="news-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#086357]"
              >
                {(Object.keys(NEWS_CATEGORY_LABELS) as NewsCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {NEWS_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="news-date-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Data de Publicação *
              </label>
              <input
                id="news-date-input"
                type="date"
                required
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#086357]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="news-author-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Autor / Departamento
            </label>
            <input
              id="news-author-input"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ex.: Comunicação Pampulha"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#086357]"
            />
          </div>

          {/* Seção de Imagem de Destaque */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Imagem de Destaque
              </span>
              {imageUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remover foto
                </button>
              )}
            </div>

            {/* Pré-visualização da imagem */}
            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900/5 dark:bg-black/20 max-h-48 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Pré-visualização da notícia"
                  className="w-full h-44 object-cover rounded-xl"
                />
              </div>
            ) : null}

            {/* Botão de Envio de Arquivo do Dispositivo */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="news-file-upload"
                disabled={isUploadingImage || loading}
              />

              <label
                htmlFor="news-file-upload"
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#086357]/50 dark:border-[#009485]/50 bg-[#086357]/5 dark:bg-[#009485]/10 hover:bg-[#086357]/10 dark:hover:bg-[#009485]/20 text-[#086357] dark:text-[#009485] text-xs font-semibold cursor-pointer transition-colors ${
                  isUploadingImage ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#086357] dark:text-[#009485]" />
                    <span>Comprimindo e enviando foto...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>{imageUrl ? 'Trocar foto do dispositivo' : 'Selecionar foto do computador / celular'}</span>
                  </>
                )}
              </label>

              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Compressão automática para carregamento rápido
              </span>
            </div>

            {imageUploadError && (
              <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {imageUploadError}
              </p>
            )}

            {/* Alternativa: Inserir URL direta */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <label htmlFor="news-image-input" className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                Ou informe a URL externa da imagem:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <LinkIcon className="w-3.5 h-3.5" />
                </div>
                <input
                  id="news-image-input"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#086357]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="news-summary-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Resumo Breve (Exibido no Card) *
            </label>
            <textarea
              id="news-summary-input"
              rows={2}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Uma frase sucinta resumindo a notícia..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#086357]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="news-content-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Conteúdo Completo *
            </label>
            <textarea
              id="news-content-input"
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva aqui o artigo completo..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#086357] font-sans"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || isUploadingImage}
              className="px-6 py-2.5 rounded-xl bg-[#086357] hover:bg-[#009485] disabled:opacity-50 text-sm font-bold text-white shadow-lg shadow-[#086357]/20 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : isUploadingImage ? 'Processando imagem...' : 'Salvar Notícia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
