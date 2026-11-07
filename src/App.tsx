import React, { useState } from 'react';
import { Sparkles, Layers, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'welcome' | 'architecture' | 'next-steps'>('welcome');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
              P
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Pampulha</h1>
              <p className="text-xs text-slate-400">ECC Greenfield Architecture</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-800/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Fase 0 Concluída
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
            Ambiente Inicializado com Sucesso
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            O projeto Pampulha está pronto para o ciclo de engenharia orientado a agentes com React 19, Vite, TypeScript e Tailwind CSS.
          </p>
        </div>

        <nav aria-label="Navegação de tabs" className="flex justify-center border-b border-slate-800 pb-px">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('welcome')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'welcome'
                  ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Visão Geral
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'architecture'
                  ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Stack & Ferramentas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('next-steps')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'next-steps'
                  ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Próximos Passos
            </button>
          </div>
        </nav>

        {activeTab === 'welcome' && (
          <section aria-labelledby="welcome-heading" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <h3 id="welcome-heading" className="sr-only">Pilares da Inicialização</h3>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 space-y-3 hover:border-slate-600 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-semibold text-white">Vite + React 19</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Setup ultrarrápido com Hot Module Replacement (HMR) e suporte nativo ao TypeScript.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 space-y-3 hover:border-slate-600 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-semibold text-white">Tailwind CSS v4</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Estilização utilitária de alto desempenho integrada diretamente ao compilador Vite.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 space-y-3 hover:border-slate-600 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-semibold text-white">TDD com Vitest & RTL</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Infraestrutura de testes unitários e de componentes pronta com cobertura mínima configurada em 80%.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'architecture' && (
          <section aria-labelledby="arch-heading" className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 space-y-4">
            <h3 id="arch-heading" className="text-lg font-semibold text-white">Configuração Técnica</h3>
            <ul className="divide-y divide-slate-700/60 text-sm">
              <li className="py-3 flex justify-between items-center">
                <span className="text-slate-400">Framework Core</span>
                <span className="font-mono text-indigo-300">React 19 + TypeScript 5.7+</span>
              </li>
              <li className="py-3 flex justify-between items-center">
                <span className="text-slate-400">Bundler & Dev Server</span>
                <span className="font-mono text-indigo-300">Vite 6</span>
              </li>
              <li className="py-3 flex justify-between items-center">
                <span className="text-slate-400">Design System / Estilos</span>
                <span className="font-mono text-indigo-300">Tailwind CSS 4.x</span>
              </li>
              <li className="py-3 flex justify-between items-center">
                <span className="text-slate-400">Runner de Testes</span>
                <span className="font-mono text-indigo-300">Vitest + React Testing Library (JSDOM)</span>
              </li>
            </ul>
          </section>
        )}

        {activeTab === 'next-steps' && (
          <section aria-labelledby="steps-heading" className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 space-y-4">
            <h3 id="steps-heading" className="text-lg font-semibold text-white">Roteiro de Desenvolvimento (ECC Pipeline)</h3>
            <ol className="space-y-4">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">1</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">Fase 1: Discovery & PRD Lean</h4>
                  <p className="text-xs text-slate-400">Definição dos requisitos de negócio, usuários-alvo e escopo da primeira fatia.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">2</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">Fase 2: Arquitetura & Contratos (SDD)</h4>
                  <p className="text-xs text-slate-400">Especificação comportamental, contratos de tipos e rotas de navegação.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">3</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">Fase 3 & 4: Planejamento Técnico e TDD</h4>
                  <p className="text-xs text-slate-400">Implementação guiada por testes (Red &rarr; Green &rarr; Refactor).</p>
                </div>
              </li>
            </ol>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-800 bg-slate-950/40 px-6 py-4 text-center text-xs text-slate-500">
        Pampulha &bull; Desenvolvido com Antigravity &amp; Everything Claude Code (ECC)
      </footer>
    </div>
  );
};
export default App;
