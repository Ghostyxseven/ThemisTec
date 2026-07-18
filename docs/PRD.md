# PRD - Product Requirement Document: ThemisTec

> Documento de Requisitos do Produto  
> Versão: 1.0 | Data: Julho 2026  
> Equipe: ThemisTec (OrbitTech)

---

## 1. Visão Geral do Produto

O **ThemisTec** é uma plataforma web de gestão jurídica desenvolvida para advogados autônomos e pequenos escritórios. O sistema substitui controles manuais, planilhas e pastas físicas por uma solução centralizada de gestão de clientes, processos e documentos.

A plataforma permite que advogados em início de carreira organizem seu fluxo de trabalho de forma eficiente, segura e acessível — online e offline — através de uma Progressive Web App (PWA) moderna e intuitiva.

**Problema que resolve:** Desorganização de informações de clientes, processos e documentos no ambiente jurídico. Advogados perdem tempo procurando informações, cometem erros por registros incorretos e não têm visibilidade clara do andamento dos processos.

---

## 2. Valor de Mercado

### Oportunidade

- Advogados em início de carreira frequentemente não possuem orçamento para sistemas robustos como AdvBox ou Projuris
- Dependem de planilhas, cadernos e WhatsApp para gerenciar clientes e prazos
- O mercado jurídico brasileiro possui mais de 1,4 milhão de advogados ativos (OAB)
- Ferramentas existentes são caras e complexas para profissionais solo

### Diferencial

- Custo operacional baixo (R$ 8-12/usuário/mês após plano gratuito)
- Interface simples e objetiva, sem curva de aprendizado extensa
- Foco no advogado iniciante/autônomo, não em grandes escritórios
- PWA com funcionamento offline

### Referência de Mercado

- **AdvBox** (https://advbox.com.br/) — principal concorrente, voltado a escritórios maiores

---

## 3. Personas (Público-Alvo)

### Persona Primária: Advogado Autônomo Iniciante

| Atributo | Descrição |
|----------|-----------|
| Nome fictício | Dr. Rafael, 28 anos |
| Perfil | Recém-formado, OAB ativa há 1-3 anos |
| Dor principal | Não tem sistema para organizar clientes e processos |
| Comportamento atual | Usa planilhas do Google, caderno e WhatsApp |
| Necessidade | Sistema simples, barato e que funcione no celular |
| Critério de sucesso | Encontrar qualquer informação de cliente/processo em menos de 10 segundos |

### Persona Secundária: Pequeno Escritório (2-5 advogados)

| Atributo | Descrição |
|----------|-----------|
| Nome fictício | Escritório Mendes & Associados |
| Perfil | 3 advogados compartilhando mesma base de clientes |
| Dor principal | Informações descentralizadas entre os sócios |
| Necessidade | Base única de clientes/processos acessível por todos |

---

## 4. Escopo do MVP

### 4.1 O que entra no MVP

| Épico | Funcionalidades | Prioridade |
|-------|----------------|------------|
| **EP01 – Autenticação** | Login com e-mail/senha, cadastro de conta, recuperação de senha | Alta |
| **EP02 – Gestão de Clientes** | Cadastro, consulta (com busca), edição e exclusão de clientes | Alta |
| **EP03 – Gestão de Processos** | Registro de processo vinculado a cliente, consulta com filtros, anexo de PDF | Alta |

#### Detalhamento das User Stories do MVP

**Autenticação:**
- US01: Login com e-mail e senha (Supabase Auth)
- US02: Cadastro de conta com confirmação por e-mail
- US03: Recuperação de senha via link por e-mail

**Gestão de Clientes:**
- US04: Cadastro de cliente (nome e CPF obrigatórios, CPF único e validado)
- US05: Listagem paginada com busca por nome ou CPF
- US06: Edição e exclusão de cliente (com confirmação)

**Gestão de Processos:**
- US07: Registro de processo vinculado a cliente (número único, tipo e data obrigatórios)
- US08: Consulta de processos com filtro por status e cliente
- US09: Anexar PDF ao processo (máx. 5MB, referência salva no PostgreSQL)

### 4.2 O que fica de fora (versões futuras)

| Feature | Motivo da exclusão |
|---------|-------------------|
| Dashboard com KPIs | Complexidade além do escopo do MVP |
| Controle financeiro | Requer integrações adicionais |
| Rastreamento de prazos judiciais | Necessita integração com tribunais |
| Notificações push | Dependência de serviço adicional |
| Geração automática de petições | Complexidade de IA/templates |
| Modo offline (PWA completo) | Service workers exigem mais tempo |
| Multi-tenancy (escritório com permissões) | Arquitetura mais complexa |
| Relatórios e exportação | Feature de conveniência, não essencial |

---

## 5. Requisitos Não-Funcionais

| Requisito | Especificação |
|-----------|---------------|
| Performance | Listagens retornam em menos de 2 segundos |
| Segurança | Dados acessíveis apenas por usuários autenticados (JWT) |
| Disponibilidade | 99.5% (Vercel + Supabase) |
| Compatibilidade | Navegadores modernos (Chrome, Firefox, Safari, Edge) |
| Responsividade | Funcional em desktop e mobile |
| Proteção de dados | Conformidade com LGPD (coleta mínima, sem compartilhamento) |
| Upload | Apenas PDF, máximo 10MB por arquivo, 5GB por usuário |

---

## 6. Arquitetura Técnica (Resumo)

| Camada | Tecnologia | Responsabilidade |
|--------|-----------|-----------------|
| Frontend | Next.js + React | Interface do usuário (PWA) |
| Backend | Next.js API Routes / Server Actions | Lógica de servidor |
| Banco de Dados | Supabase PostgreSQL | Armazenamento de dados com RLS |
| Autenticação | Supabase Auth | Login, cadastro, sessões |
| Armazenamento | Supabase Storage | Upload privado de PDFs |
| Hospedagem | Vercel | Deploy e CDN |
| DNS/Segurança | Cloudflare | DDoS, cache, SSL |
| Domínio | Hostinger | themistec.site |

**Padrão Arquitetural:** MVVM (Model-View-ViewModel) com Monolito Modular

**Padrões de Projeto (GoF):**
- Adapter — isolamento do SDK do Supabase
- Singleton — instância única do Supabase Client
- Observer — reações ao cadastro de processo

---

## 7. Critérios de Sucesso

| Métrica | Meta |
|---------|------|
| MVP funcional | Todas as 9 user stories implementadas e funcionando |
| Tempo de resposta | Listagens < 2s |
| Cobertura de specs | 100% das rotas com contrato OpenAPI |
| Harness configurado | ESLint + TypeScript strict + testes automatizados |
| Deploy | Aplicação acessível em themistec.site |
| Conformidade acadêmica | 4 artefatos entregues (PRD, Specs, Harness, MVP) |

---

## 8. Equipe

| Papel | Responsável |
|-------|-------------|
| Líder de Projeto / Scrum Master | Marcos Vinícius de Oliveira Teixeira |
| Dev Backend / DBA | Micael Cardoso Reis |
| Dev Frontend / Designer | Josiane Amorim Mendes |
| Product Owner (PO) | Gisele Dias Plácido, Marcos Vinícius de Oliveira Teixeira |

---

## 9. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Limitações do plano gratuito Firebase | Média | Alto | Créditos US$300 Google Cloud + monitoramento de uso |
| Gestão de tempo e escopo | Alta | Alto | MVP delimitado, sem scope creep, reuniões semanais |
| Problemas de integração Next.js/Firebase | Média | Alto | Padrão Singleton + Adapter para isolar dependências |
