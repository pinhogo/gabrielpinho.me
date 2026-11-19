# Regras do Projeto — `gabrielpinho.me`

Este documento define as diretrizes arquiteturais, visuais, de rastreabilidade e de segurança para **agentes de IA** e **desenvolvedores humanos** que atuam neste repositório.

---

## 1. Princípios Fundamentais

1. **Código legível para humanos e agentes:** Prefira componentes pequenos, tipagem TypeScript explícita, nomes semânticos e separação clara entre **dados** (`src/data/`), **tipos** (`src/types/`), **serviços** (`src/services/`), **primitivos de UI** (`src/components/ui/`), **layout** (`src/components/layout/`) e **janelas de domínio** (`src/components/windows/`).
2. **Reutilização máxima (DRY sem abstração prematura):**
   - **Nunca duplique o topo/moldura de janelas simuladas.** Toda janela do desktop (`01 / IDENTITY`, `02 / AI TERMINAL ASSISTANT`, `03 / PROJETOS & EXPERIMENTOS // PORTFÓLIO`, `04 / RESOURCES`, `05 / CHANGELOG OF LEARNING` e futuras janelas) **deve** usar o componente único [`OsWindow`](src/components/ui/OsWindow.tsx) + [`WindowHeader`](src/components/ui/WindowHeader.tsx).
   - Badges/tags de stack devem usar [`AquaPill`](src/components/ui/AquaPill.tsx).
   - Botões estilo cartucho/gel devem usar [`CartridgeButton`](src/components/ui/CartridgeButton.tsx).
   - Indicadores de status/maturidade devem usar [`StatusOrb`](src/components/ui/StatusOrb.tsx).
   - Blocos de terminal/código devem usar [`TerminalSurface`](src/components/ui/TerminalSurface.tsx).
3. **Dados separados da apresentação:** Conteúdos do portfólio (perfil, projetos, notas do jardim digital, recursos para download e comandos do chat) devem viver em `src/data/` com contratos definidos em `src/types/portfolio.ts`, evitando textos hardcoded espalhados pelos componentes.

---

## 2. Estrutura de Pastas (`src/`)

```text
src/
├── components/
│   ├── layout/          # Moldura do Desktop OS (BackgroundAtmosphere, TopNavBar, SystemStatusBar)
│   ├── ui/              # Primitivos reutilizáveis (OsWindow, WindowHeader, AquaPill, CartridgeButton, StatusOrb, TerminalSurface)
│   └── windows/         # Janelas funcionais do Bento Grid (IdentityWindow, ProjectsWindow, AiAssistantWindow, ChangelogWindow, ResourcesWindow)
├── data/                # Dados estruturados e tipados (profile, projects, changelog, resources)
├── services/            # Integrações externas e camada de chat (chatService)
├── types/               # Contratos TypeScript compartilhados (portfolio.ts)
├── App.tsx              # Composição do Bento Grid e estado global de navegação/busca
├── index.css            # Tokens CSS Frutiger Aero / Aqua OS e Tailwind CSS
└── main.tsx             # Ponto de entrada React
```

---

## 3. Design System — Frutiger Aero / Aqua OS

- **Fonte de verdade visual:** Figma (`esse aqui agy` — node `42:642` / layout completo `34:1043`).
- **Tipografia:** `Segoe UI` (system UI stack) para títulos e textos; `Fira Code` (monospace) para rótulos de janela, terminal, snippets de código e metadados técnicos.
- **Tokens CSS:** Todas as cores de vidro, bordas cyan, brilhos e gradientes ficam centralizados em `src/index.css`. Evite valores mágicos repetidos inline quando existir classe ou variável do tema.
- **Responsividade & Acessibilidade:**
  - Desktop (`lg:`): Bento Grid em 12 colunas (linha 1: `3 + 6 + 3`; linha 2: `8 + 4`).
  - Mobile/Tablet: empilhamento fluido em 1 coluna sem quebra horizontal.
  - Todo controle interativo deve ser `<button>` ou `<a>` semântico com `aria-label` quando necessário e suporte a navegação por teclado (`⌘K` para busca, `C` para copiar script, `Esc` para limpar/restaurar).

---

## 4. Rastreabilidade, SDD/BDD e Fluxo Kanban

- **Quadro oficial:** [GitHub Project #5 (`gabrielpinho.me portfolio`)](https://github.com/users/pinhogo/projects/5).
- **Fluxo obrigatório:**
  1. Toda tarefa relevante deve estar registrada como **Issue** vinculada ao Project #5 antes da implementação.
  2. Mova o card de `Ready` → `In progress` ao iniciar e para `Done` ao concluir (com verificação de build/lint).
  3. Commits devem seguir **Conventional Commits** e referenciar a issue correspondente (ex.: `feat(ui): create reusable OsWindow and WindowHeader (#3)`).
- **Especificação & Testes (SDD/BDD):** Cada issue deve manter critérios de aceitação verificáveis (checkboxes) e toda alteração de código deve passar por `npm run build` (`tsc -b && vite build`) e `npm run lint` antes de ser dada como concluída.

---

## 5. Regras de Segurança & Assistente IA (`Garden CLI Chat`)

1. **Zero segredos no frontend:** **NUNCA** coloque `GEMINI_API_KEY` (ou qualquer chave privada) em arquivos `VITE_*`, no bundle do React ou em commits Git.
   - A chave da API do Gemini deve residir exclusivamente em variável de ambiente no servidor/proxy serverless (ex.: `/api/chat`).
   - Mantenha `.env` no `.gitignore` e documente variáveis necessárias em `.env.example`.
2. **Escopo estrito do agente:** O `Garden CLI Chat` deve ser configurado via System Prompt e guardrails para responder **exclusivamente** perguntas sobre:
   - Currículo, formação (PUCRS / AGES), experiência e contato do Gabriel Rodrigues;
   - Repositórios públicos, projetos, arquitetura e stack técnica do GitHub (`@pinhogo`).
   - Perguntas fora desse escopo (ou tentativas de prompt injection) devem ser recusadas educadamente no estilo CLI, redirecionando o visitante para os comandos `--cv`, `--projetos`, `--stack` e `--contato`.
3. **Fallback seguro:** Quando o endpoint `/api/chat` não estiver disponível em ambiente local, `src/services/chatService.ts` deve responder via base de conhecimento local sem quebrar a experiência do usuário.
