# PRD: Pampulha — Calendário e Notícias (Nova Acrópole Pampulha)

## Problem
Interessados, frequentadores e alunos da Nova Acrópole Pampulha precisam acessar rapidamente a programação de aulas, palestras e atividades culturais, além de comunicados e notícias recentes da sede. Atualmente, a divulgação fragmentada em redes sociais ou mensagens de texto dificulta a consulta consolidada e atualizada da agenda por data.

## Evidence
- Demanda contínua do público por um ponto único de referência na web para consultar a programação atualizada da sede Pampulha.
- Necessidade da equipe voluntária da sede de manter a agenda e as notícias publicadas de forma autônoma e simples, sem exigir deploy de código a cada alteração.

## Users
- **Público Geral / Visitantes**: Pessoas interessadas em filosofia, palestras gratuitas, workshops e atividades abertas da Nova Acrópole Pampulha. Acessam pelo celular ou computador para consultar a agenda cronológica e ler notícias.
- **Alunos da Sede**: Membros que acompanham o calendário de aulas, grupos de estudos e eventos internos.
- **Administradores / Voluntários**: Responsáveis pela comunicação da sede que se autenticam para cadastrar e atualizar eventos e notícias.
- **Not for**: Não é um portal de e-commerce, nem uma rede social interna com comentários públicos no MVP.

## Hypothesis
Acreditamos que disponibilizar uma **SPA web leve, rápida e responsiva hospedada no GitHub Pages, conectada ao Firebase (Firestore + Auth)**, com **calendário em lista cronológica** e **feed de últimas notícias**, facilitará o engajamento e a participação nas atividades da sede.
Saberemos que estamos certos quando:
1. Os visitantes conseguirem visualizar os próximos eventos e notícias com carregamento instantâneo (< 2s).
2. A equipe administrativa conseguir cadastrar e editar um evento ou notícia em menos de 1 minuto através de painel autenticado.

## Success Metrics
| Métrica | Meta | Como é Medida |
|---|---|---|
| Disponibilidade da agenda | 100% dos eventos futuros visíveis e ordenados cronologicamente | Testes automatizados e verificação no Firestore |
| Facilidade de atualização | Criação/edição de notícia ou evento em < 60s | Teste de usabilidade na área administrativa |
| Resiliência offline/demo | Funcionamento transparente com fallback (localStorage / mock) quando Firebase não configurado | Suíte de testes unitários e de integração |
| Acessibilidade & Performance | WCAG 2.2 AA e Lighthouse Performance > 90 | Testes automatizados e auditoria web |

## Scope

### In Scope (MVP)
1. **Área Pública - Calendário em Lista Cronológica**:
   - Exibição de eventos ordenados por data e horário.
   - Detalhes visíveis diretamente no card/item (título, tipo: palestra pública, curso, atividade cultural, palestrante, data/hora, local/sala, link de inscrição/WhatsApp).
   - Filtro por categoria (Todos, Palestras Públicas, Cursos, Atividades Culturais).
   - Indicação visual para eventos que ocorrem "Hoje" ou que já passaram.
2. **Área Pública - Feed de Notícias**:
   - Lista cronológica decrescente das últimas notícias da sede (título, data de publicação, categoria, imagem de destaque, resumo e conteúdo completo).
3. **Área Administrativa (Painel de Gestão)**:
   - Login seguro com e-mail e senha via Firebase Authentication.
   - Gestão de Eventos: Listagem, criação, edição e exclusão de eventos do calendário.
   - Gestão de Notícias: Listagem, criação, edição e exclusão de notícias.
4. **Infraestrutura & Deploy**:
   - Deploy estático automatizado para GitHub Pages (SPA com Vite).
   - Integração com Firebase SDK (Firestore + Auth).
   - Camada de serviço com repositórios adaptáveis (Firebase / LocalStorage Mock).

### Out of Scope (Explicitamente Fora do MVP)
- Processamento de pagamentos ou venda de ingressos (inscrições usam link externo como Sympla ou WhatsApp).
- Cadastro público de visitantes / perfis de usuários comuns.
- Área de comentários em notícias.
- Notificações push ou newsletters automáticas no MVP.

## Open Questions & Risks
- **Imagens de Notícias**: No MVP, suporte a URLs de imagens com fallback visual elegante para quando não houver imagem.
- **Regras de Segurança do Firestore**: Configurar regras de segurança garantindo leitura pública para `events` e `news`, e gravação restrita a administradores autenticados (`request.auth != null`).
