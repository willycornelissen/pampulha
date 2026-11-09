# 📊 Métricas de Desenvolvimento com IA (Pair Programming)

Registro histórico de esforço, tempo e consumo de tokens durante a criação e evolução da aplicação **Pampulha** em parceria com o assistente inteligente **Antigravity (Google DeepMind)**.

---

## ⏱️ 1. Tempo de Desenvolvimento

| Métrica | Valor | Detalhes |
| :--- | :--- | :--- |
| **Tempo Total Decorrido (Ciclo de Vida)** | **~29 horas** | De 07/11/2026 às 17h36 até 08/11/2026 às 22h45 |
| **Tempo Efetivo de Trabalho em Sessão** | **~14 horas e 20 minutos** | Tempo somado de pareamento ativo |
| **Total de Interações / Solicitações** | **38 comandos do usuário** | Refinamentos, regras de negócio e novas features |
| **Operações de Ferramentas Executadas** | **706 operações** | Leituras, edições cirúrgicas, testes, builds e deploys |
| **Total de Commits Versionados** | **19 commits** | Histórico rastreável na branch `main` |
| **Suíte de Testes Automatizados** | **59 testes (100% de aprovação)** | Vitest + React Testing Library |

---

## 🪙 2. Consumo de Tokens (LLM)

| Tipo de Token | Quantidade | Descrição |
| :--- | :---: | :--- |
| **Tokens de Saída (*Output Tokens*)** | **401.753** | Todo o código TypeScript/React gerado, testes, documentação e respostas |
| **Tokens de Entrada (*Input Tokens*)** | **4.473.866** | Novas instruções, arquivos carregados e diffs analisados |
| **Tokens Lidos em Cache (*Prompt Cache Read*)** | **90.591.989** | Contexto do projeto e regras reutilizados sem custo de latência |
| **Total Geral de Tokens Processados** | **95.467.608** | Volume total de tokens trafegados ao longo do desenvolvimento |

> 💡 **Nota sobre Cache:** Mais de **95%** dos tokens foram atendidos via *Prompt Cache*, garantindo alta velocidade de resposta e economia de recursos.

---

## 📅 3. Linha do Tempo e Principais Marcos

### 🔹 07/11/2026 (Início do Projeto - ~1h42 de trabalho)
- Estruturação do repositório, documentação inicial (PRD) e arquitetura limpa.
- Setup da stack: React 19, Vite 6, Tailwind CSS v4, TypeScript e Vitest.
- Criação dos módulos centrais:
  - Calendário em lista cronológica com filtros por categoria e busca textual.
  - Feed de Notícias e Comunicados com modal de leitura completa.
  - Painel Administrativo com login, CRUD de eventos e CRUD de notícias.
  - Configuração do pipeline de CI/CD via GitHub Actions com deploy no GitHub Pages.

### 🔹 08/11/2026 - Manhã (~1h21 de trabalho)
- Implementação de alternância dinâmica de tema Claro/Escuro (*Dark Mode*).
- Adoção da paleta de cores institucional da Nova Acrópole (`#086357` verde profundo, `#f39300` ouro solar, `#faf9f6` pergaminho).
- Estilização do frontispício de jornal clássico (*Diário da Pampulha*).

### 🔹 08/11/2026 - Tarde e Noite (~11h15 de trabalho)
- Atualização cadastral do endereço oficial da sede para o **JL Mall** e remoção de textos obsoletos.
- **Upload e Compressão de Imagens no Navegador:**
  - Redimensionamento e compressão via `createImageBitmap` e canvas (< 50ms) gerando JPEGs otimizados de ~50 KB a 75 KB.
  - Pré-visualização com remoção e preservação de URL externa alternativa.
- **Conexão e Resiliência em Nuvem:**
  - Diagnóstico do bloqueio de regras do Cloud Firestore (`PERMISSION_DENIED`).
  - Liberação de regras públicas de leitura e escrita para o projeto `nova-acropole-pampulha`.
  - Migração dos dados locais do computador para a nuvem sem perda de conteúdo.
  - Sincronização em tempo real entre computador, celular e público geral.
- **Ajustes de UX e Responsividade:**
  - Ocultação de logotipo/título do topo exclusivamente no celular para priorizar a navegação.
  - Remoção do filtro redundante "Apenas Próximos" para exibição limpa da programação completa.
