# Pampulha

Projeto SPA Frontend em React 19, TypeScript, Vite e Tailwind CSS, regido pela esteira de engenharia do **ECC (Everything Claude Code)**.

## 🛠️ Comandos de Desenvolvimento

- **Servidor de Desenvolvimento**: `npm run dev`
- **Compilação de Produção**: `npm run build`
- **Executar Testes**: `npm test`
- **Testes em Watch Mode**: `npm run test:watch`
- **Cobertura de Código**: `npm run test:coverage`
- **Pré-visualização do Build**: `npm run preview`

## 📐 Padrões e Convenções

- **Arquitetura**: SPA baseada em fatias verticais finas (*Thin Vertical Slices*).
- **Componentes**: React funcionais, hooks idiomáticos, acessibilidade semântica (ARIA, labels, roles).
- **Estilização**: Tailwind CSS v4 com utilitários diretos e classes combinadas via `clsx` / `tailwind-merge`.
- **Testes (TDD)**: Vitest + React Testing Library. Sempre testar o comportamento visível pelo usuário via acessibilidade (`getByRole`, `getByLabelText`), simulando interações com `userEvent`. Cobertura mínima de 80%.
- **Qualidade & Git**: Commits semânticos no padrão Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `refactor:`).
