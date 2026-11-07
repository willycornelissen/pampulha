# Pampulha

Aplicação Web (SPA em React 19 + TypeScript + Vite + Tailwind CSS) da **Nova Acrópole Pampulha**, projetada para ser hospedada no **GitHub Pages** e sustentada pelo **Google Firebase (Cloud Firestore + Firebase Authentication)**.

O projeto permite a consulta pública e imediata do **calendário de atividades** (em lista cronológica) e das **últimas notícias**, além de oferecer um **painel administrativo autenticado** para cadastro, edição e exclusão de eventos e comunicados.

---

## 🚀 Principais Funcionalidades

1. **Calendário em Lista Cronológica**:
   - Visualização cronológica crescente de palestras abertas, aulas inaugurais, eventos culturais e mutirões de voluntariado.
   - Detalhes visíveis diretamente no item (dia, mês, horário, título, palestrante, local e entrada gratuita).
   - Filtros dinâmicos por categoria e busca textual em tempo real.
   - Botão direto para inscrição e contato via WhatsApp ou link externo.
   - Identificação visual para eventos de "Hoje".

2. **Feed de Últimas Notícias**:
   - Lista e grade responsiva das publicações e artigos da sede Pampulha.
   - Visualização detalhada de cada artigo via modal acessível (com suporte a tecla `Esc` e controle de foco).

3. **Painel de Gestão Administrativa**:
   - Acesso seguro via Firebase Authentication.
   - CRUD completo de Eventos do Calendário.
   - CRUD completo de Notícias.

4. **Modo Híbrido & Resiliência (Zero Config para Demonstração)**:
   - Se as variáveis `VITE_FIREBASE_*` não estiverem configuradas, a aplicação opera automaticamente com persistência em `localStorage` e dados iniciais de demonstração, permitindo testes locais e preview sem dependência de credenciais externas.
   - Botão no rodapé para restaurar dados de exemplo com 1 clique.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript 5.7+, Vite 6
- **Estilização**: Tailwind CSS v4, Lucide React
- **Backend & Nuvem**: Google Firebase (Cloud Firestore + Auth)
- **Testes & Qualidade**: Vitest, React Testing Library, JSDOM (cobertura $\ge 80\%$)
- **CI/CD**: GitHub Actions para deploy automatizado no GitHub Pages

---

## 💻 Como Rodar Localmente

### 1. Pré-requisitos
- Node.js $\ge$ 20.x e npm $\ge$ 10.x

### 2. Instalação e Execução
```bash
# Clone o repositório
git clone https://github.com/willycornelissen/pampulha.git
cd pampulha

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### 3. (Opcional) Configuração do Firebase
Copie o arquivo `.env.example` para `.env` e preencha suas chaves do Firebase Console:
```bash
cp .env.example .env
```

---

## 🧪 Testes e Qualidade

```bash
# Executar suíte de testes unitários e de componentes
npm test

# Executar testes com relatório de cobertura
npm run test:coverage

# Compilar para produção
npm run build
```

---

## 📄 Licença

Distribuído sob a licença [MIT](https://opensource.org/licenses/MIT).
