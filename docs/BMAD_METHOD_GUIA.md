# BMad Method - Guia de Uso para a Equipe ThemisTec

## O que é?

O **BMad Method** é um framework de desenvolvimento ágil orientado por IA. Ele fornece um fluxo estruturado para levar uma ideia desde a concepção até a implementação, usando agentes de IA como parceiros de desenvolvimento.

**Resumo:** Ele organiza o trabalho em etapas claras (requisitos → arquitetura → tarefas → código) e fornece skills (habilidades) para os agentes de IA seguirem boas práticas em cada etapa.

---

## Módulos Instalados

| Módulo | Versão | O que faz |
|--------|--------|-----------|
| BMad Core | v6.10.0 | Núcleo do framework, configurações base e agentes |
| BMad Method | v6.10.0 | Fluxo completo: análise, planejamento, arquitetura e implementação |
| Test Architect | v1.19.0 | Estratégia de qualidade, automação de testes e gates de release |
| BMad Builder | v2.1.0 | Criação de agentes, workflows e módulos customizados |
| Creative Intelligence Suite | v0.2.1 | Brainstorming, ideação, storytelling e design thinking |
| Whiteport Design Studio | v0.4.3 | Planejamento estratégico de UX e design |

---

## Como Instalar (para novos membros)

### Pré-requisitos

- **Node.js** (v18+)
- **Python UV** - instalar via: `pip install uv` ou [docs.astral.sh/uv](https://docs.astral.sh/uv/getting-started/installation/)
- Uma IDE com suporte a agente IA (Kiro, Cursor, VS Code + Copilot, etc.)

### Passos

1. Clone o repositório e entre na pasta:
   ```bash
   git clone <url-do-repositorio>
   cd ThemisTec
   ```

2. Execute a instalação do BMad:
   ```bash
   npx bmad-method install
   ```

3. Durante a instalação, responda:
   - **Installation directory** → Enter (pasta atual)
   - **Install to this directory?** → Yes
   - **Select official modules** → Selecione todos (ou pelo menos BMad Core + BMad Method)
   - **Community modules?** → No
   - **Ready to install?** → Yes
   - **Integrate with** → Selecione sua IDE (Kiro, Cursor, etc.)
   - **What should agents call you?** → ThemisTec
   - **Project name** → ThemisTec
   - **Language** → Português
   - **Document output language** → Português
   - **Output files** → bmad-output

---

## Estrutura de Pastas Gerada

```
ThemisTec/
├── _bmad/                    # Núcleo do BMad (NÃO commitar)
├── bmad-output/              # Documentos gerados (PRD, arquitetura, etc.)
│   ├── planning-artifacts/   # Artefatos de planejamento
│   ├── implementation-artifacts/ # Artefatos de implementação
│   └── test-artifacts/       # Artefatos de teste
├── design-artifacts/         # Artefatos de design UX (NÃO commitar)
│   ├── A-Product-Brief/
│   ├── B-Trigger-Map/
│   ├── C-UX-Scenarios/
│   ├── D-Design-System/
│   └── E-Development/
├── .kiro/skills/             # Skills para o Kiro (NÃO commitar)
└── .agent/skills/            # Skills para outros agentes (NÃO commitar)
```

> **Nota:** Apenas a pasta `bmad-output/` é commitada no git. As demais são geradas localmente por cada membro.

---

## Como Usar

### Fluxo de Trabalho (Passo a Passo)

| Etapa | Skill | O que faz |
|-------|-------|-----------|
| 0 | `bmad-help` | Analisa o estado do projeto e sugere o próximo passo |
| 1 | `bmad-product-brief` | Define visão, público-alvo e proposta de valor |
| 2 | `bmad-prd` | Cria o PRD (Documento de Requisitos do Produto) |
| 3 | `bmad-architecture` | Define a arquitetura técnica da solução |
| 4 | `bmad-create-epics-and-stories` | Quebra requisitos em épicos e user stories |
| 5 | `bmad-sprint-planning` | Planeja o sprint com as stories priorizadas |
| 6 | `bmad-dev-story` | Implementa uma story seguindo o spec |

### Como Invocar Skills

Na conversa com o agente IA, basta pedir. Exemplos:

- "me ajude a criar o PRD"
- "crie a arquitetura do projeto"
- "quebre os requisitos em épicos e stories"
- "implemente a próxima story do sprint"
- "bmad help" (para orientação)

### Agentes Disponíveis

| Agente | Nome | Papel |
|--------|------|-------|
| Mary | Analista de Negócios | Requisitos e análise estratégica |
| John | Product Manager | Criação de PRD e descoberta de requisitos |
| Winston | Arquiteto | Design técnico e decisões de arquitetura |
| Sally | UX Designer | Design de interface e experiência |
| Amelia | Desenvolvedora | Implementação de código |
| Paige | Tech Writer | Documentação técnica |
| Murat | Test Architect | Estratégia de testes e qualidade |

Para conversar com um agente específico: "quero falar com o Winston" ou "chame a Mary".

---

## Dicas

- Sempre comece com `bmad-help` se não souber o que fazer
- Os documentos em `bmad-output/` são compartilhados com a equipe via git
- Cada membro precisa rodar `npx bmad-method install` na sua máquina
- Use `uv` para scripts Python do workflow: `uv run <script>`

---

## Links Úteis

- 📖 Documentação: https://bmadcode.com/
- 💬 Discord: https://discord.gg/gk8jAdXWmj
- 🎥 YouTube: https://www.youtube.com/@BMadCode
- ⭐ GitHub: https://github.com/bmad-code-org/BMAD-METHOD/
