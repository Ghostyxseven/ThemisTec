<div align="center">

# ⚖️ ThemisTec

**Plataforma inteligente de gestão jurídica para advogados modernos.**

Desenvolvido por **ThemisTec** · MVP em desenvolvimento ativo

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth%20%7C%20Storage-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/Licença-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Sobre o Projeto

O **ThemisTec** é uma Progressive Web App (PWA) desenvolvida para resolver um problema real de advogados autônomos e pequenos escritórios: **a desorganização e a dependência de planilhas e controles manuais**.

A plataforma centraliza toda a gestão em um único lugar — clientes, processos, prazos, documentos e finanças — com acesso **online e offline**, em qualquer dispositivo.

> 💡 **Por que Themis?** Themis é a deusa grega da Justiça. O nome reflete o compromisso do produto com a organização e a imparcialidade na gestão jurídica.

---

## ✨ Funcionalidades do MVP

| Épico | Funcionalidade | Status |
|---|---|---|
| 🔐 **Autenticação** | Login com e-mail e senha | 🔧 Em desenvolvimento |
| 🔐 **Autenticação** | Cadastro de nova conta | 🔧 Em desenvolvimento |
| 🔐 **Autenticação** | Recuperação de senha por e-mail | 🔧 Em desenvolvimento |
| 👤 **Clientes** | Cadastro de clientes (CPF único) | 🔧 Em desenvolvimento |
| 👤 **Clientes** | Consulta e busca por nome/CPF | 🔧 Em desenvolvimento |
| 👤 **Clientes** | Edição e exclusão de clientes | 🔧 Em desenvolvimento |
| 📁 **Processos** | Registro de processo vinculado a cliente | 🔧 Em desenvolvimento |
| 📁 **Processos** | Consulta e filtros por status | 🔧 Em desenvolvimento |
| 📁 **Processos** | Anexar documentos PDF (até 10MB) | 🔧 Em desenvolvimento |

---

## 🛠️ Stack Tecnológica

```
ThemisTec/
├── 🖥️  Frontend & Backend  → Next.js 15 (App Router)
├── 🔥  Banco de Dados       → Firebase Firestore
├── 🔐  Autenticação         → Firebase Auth (Email/Senha + JWT)
├── 📦  Armazenamento        → Firebase Storage (PDFs)
├── 🚀  Hospedagem           → Vercel (CI/CD automático)
├── 🌐  Domínio              → Hostinger (themistec.site)
└── 🛡️  Segurança & CDN     → Cloudflare
```

---

## 🏗️ Arquitetura

O projeto segue o padrão **MVVM (Model-View-ViewModel)** adaptado para o ecossistema React/Next.js:

```
src/
├── app/              # Rotas e páginas (Next.js App Router)
│   ├── (auth)/       # Telas de login e cadastro
│   ├── dashboard/    # Painel principal
│   ├── clientes/     # Gestão de clientes
│   └── processos/    # Gestão de processos
├── components/       # Componentes reutilizáveis de UI (View)
├── hooks/            # Custom Hooks com lógica de negócios (ViewModel)
├── services/         # Chamadas ao Firebase (Model)
└── lib/              # Configuração do Firebase e utilitários
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Conta no [Firebase](https://firebase.google.com/) com projeto configurado

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/themistec/themistec.git
cd themistec

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Preencha as variáveis com as chaves do seu projeto Firebase

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000` no seu navegador.

### Variáveis de Ambiente

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## 👥 Equipe

| Papel | Nome |
|---|---|
| 🎯 Líder de Projeto / Scrum Master | Marcos Vinícius de Oliveira Teixeira |
| 🛢️ Dev Backend / DBA | Micael Cardoso Reis |
| 🎨 Dev Frontend / Designer | Josiane Amorim Mendes |
| 📋 Product Owner (PO) | Gisele Dias Plácido |

---

## 📂 Documentação

A documentação técnica fica na pasta `docs/`. Todas as decisões arquiteturais são registradas como **ADRs (Architecture Decision Records)**:

- [ADR-0001](docs/architecture/decisions/0001-adocao-de-adrs.md) · Adoção de ADRs
- [ADR-0002](docs/architecture/decisions/0002-organizacao-do-codigo.md) · Organização do Código
- [ADR-0003](docs/architecture/decisions/0003-stack-tecnologica-do-mvp.md) · Stack Tecnológica do MVP
- [ADR-0004](docs/architecture/decisions/0004-autenticacao-com-firebase.md) · Autenticação com Firebase
- [ADR-0005](docs/architecture/decisions/0005-hospedagem-e-infraestrutura.md) · Hospedagem e Infraestrutura
- [ADR-0006](docs/architecture/decisions/0006-armazenamento-de-arquivos.md) · Armazenamento de Arquivos
- [ADR-0007](docs/architecture/decisions/0007-adocao-do-mvvm.md) · Adoção do Padrão MVVM

---

<div align="center">

Desenvolvido com ☕ e ⚖️ por **ThemisTec** · 2026

</div>
