import React, { useState } from 'react';
import { X, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { loginWithEmail } from '../../services/authService';
import { isFirebaseConfigured } from '../../services/firebase';
import { AuthUser } from '../../types/auth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await loginWithEmail(email, password);
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const isDemo = !isFirebaseConfigured();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar janela de login"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Lock className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 id="login-title" className="text-2xl font-extrabold text-white tracking-tight">
            Acesso Administrativo
          </h2>
          <p className="text-xs text-slate-400">
            {isDemo
              ? 'Modo Demonstração ativo: você pode testar o login com qualquer e-mail e senha.'
              : 'Entre com suas credenciais do Firebase para gerenciar eventos e notícias.'}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-300">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pampulha.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-sm font-bold shadow-lg shadow-indigo-950/50 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Entrando...</span>
              </>
            ) : (
              <span>Entrar no Painel</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
