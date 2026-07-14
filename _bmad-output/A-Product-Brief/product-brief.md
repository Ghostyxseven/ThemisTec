# Product Brief: ThemisTec

> Versão: 1.0 | Última atualização: Julho 2026

---

## Visão do Produto

O **ThemisTec** é uma plataforma web (PWA) de gestão jurídica voltada para advogados autônomos e pequenos escritórios. Substitui planilhas, cadernos e WhatsApp por uma solução centralizada de gestão de clientes, processos e documentos.

## Problema

Advogados em início de carreira sofrem com:
- **Desorganização:** Informações de clientes espalhadas entre planilhas, cadernos e mensagens.
- **Perda de prazos:** Sem visibilidade clara do andamento dos processos.
- **Ferramentas caras:** Sistemas como AdvBox e Projuris são complexos e custosos para profissionais solo.

## Solução

Uma plataforma **simples, acessível e moderna** que permite:
1. Cadastrar e consultar clientes em segundos.
2. Registrar processos vinculados a clientes com status e filtros.
3. Anexar documentos PDF aos processos.
4. Acessar de qualquer dispositivo (desktop e mobile).

## Público-Alvo

| Persona | Perfil | Dor Principal |
|---------|--------|---------------|
| **Advogado Autônomo** | Recém-formado, OAB ativa há 1-3 anos | Não tem sistema para organizar clientes e processos |
| **Pequeno Escritório** | 2-5 advogados compartilhando base | Informações descentralizadas entre os sócios |

## Proposta de Valor

- **Custo operacional baixo** (R$ 8-12/usuário/mês após plano gratuito)
- **Interface simples** sem curva de aprendizado extensa
- **PWA** com funcionamento responsivo
- **Foco no iniciante/autônomo**, não em grandes escritórios

## Métricas de Sucesso do MVP

| Métrica | Meta |
|---------|------|
| User Stories implementadas | 9/9 (100%) |
| Tempo de resposta (listagens) | < 2 segundos |
| Cobertura de specs | 100% das rotas com contrato OpenAPI |
| Deploy | Aplicação acessível em `themistec.site` |

## Concorrência

| Concorrente | Diferencial do ThemisTec |
|-------------|--------------------------|
| **AdvBox** | Voltado a grandes escritórios; ThemisTec é mais simples e barato |
| **Projuris** | Complexo demais para advogados solo |
| **Planilhas Google** | Não oferece vínculo cliente↔processo, busca rápida ou anexos |

## Escopo do MVP

### Incluído
- **EP01 – Autenticação:** Login, Cadastro, Recuperação de senha (Firebase Auth)
- **EP02 – Gestão de Clientes:** CRUD completo com busca por nome/CPF
- **EP03 – Gestão de Processos:** Registro vinculado a cliente, filtros, anexo PDF

### Excluído (Versões Futuras)
- Dashboard com KPIs
- Controle financeiro
- Rastreamento de prazos judiciais
- Notificações push
- Multi-tenancy com permissões
