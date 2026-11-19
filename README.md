# gabrielpinho.me

Portfólio pessoal e jardim digital de **Gabriel Pinho (`@pinhogo`)** em **[gabrielpinho.me](https://gabrielpinho.me)**, com interface inspirada em **Frutiger Aero / Aqua OS**, componentização modular em **React 19 + TypeScript + Tailwind CSS v4** e assistente CLI (**Garden CLI Chat**) integrado à **API do Gemini** com escopo estrito ao currículo e repositórios GitHub.

> Consulte [`rules.md`](./rules.md) para diretrizes de arquitetura, reutilização de componentes, segurança e rastreabilidade no [GitHub Project #5](https://github.com/users/pinhogo/projects/5).

## Estrutura Principal

- `rules.md` — regras de engenharia para agentes de IA e humanos.
- `src/components/ui/` — primitivos reutilizáveis (`OsWindow`, `WindowHeader` único para todas as janelas, `AquaPill`, `CartridgeButton`, `StatusOrb`, `TerminalSurface`).
- `src/components/layout/` — moldura Desktop OS (`BackgroundAtmosphere`, `TopNavBar`, `SystemStatusBar`).
- `src/components/windows/` — janelas do Bento Grid (`01 / IDENTITY`, `02 / AI TERMINAL ASSISTANT`, `03 / PROJETOS & EXPERIMENTOS`, `04 / RESOURCES`, `05 / CHANGELOG OF LEARNING`).
- `src/data/` — dados tipados e base de conhecimento (`knowledgeBase.ts`, `githubRepos.snapshot.ts`).
- `src/config/` — System Prompt (`assistantPrompt.ts`) e guardrails (`assistantGuardrails.ts`).
- `api/chat.ts` & `server/` — proxy serverless seguro para a API do Gemini + middleware local de dev.
- `tests/` — suíte de testes BDD dos guardrails, prompt e rate limit.
- `scripts/sync-github.mjs` — sincronização de repositórios públicos do GitHub.

## Como Executar

```bash
npm install
npm run dev
```

### Ativar o Garden CLI Chat com a API do Gemini

1. Copie `.env.example` para `.env` na raiz do repositório:
   ```bash
   cp .env.example .env
   ```
2. Defina sua chave apenas no lado servidor (sem prefixo `VITE_`):
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   GEMINI_MODEL=gemini-2.5-flash
   ```
3. Em desenvolvimento (`npm run dev`), o middleware `server/geminiDevProxy.ts` atende `POST /api/chat` localmente sem expor a chave ao navegador. Em produção (ex.: Vercel), `api/chat.ts` assume o mesmo endpoint usando a variável de ambiente configurada no provedor.

## Comandos Úteis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor Vite + proxy local `/api/chat` |
| `npm run build` | Valida TypeScript (`tsc -b`) e gera o bundle de produção |
| `npm run lint` | Executa ESLint em todo o projeto |
| `npm test` | Roda a suíte BDD de guardrails, System Prompt e proxy (`node:test`) |
| `npm run sync:github` | Atualiza `src/data/githubRepos.snapshot.ts` a partir da API pública do GitHub |

## Contato

- Site: [gabrielpinho.me](https://gabrielpinho.me)
- E-mail: `contato@gabrielpinho.me`
- GitHub: [@pinhogo](https://github.com/pinhogo)
