# 4. Autenticação com Firebase

Data: 2026-06-18

## Status
Substituído pelo ADR-0009

## Contexto
O Themis lidará com dados sensíveis de processos jurídicos e clientes. É estritamente necessário garantir que somente usuários autorizados acessem a plataforma (Épico EP01). Precisamos implementar login, cadastro e recuperação de senha.

## Decisão
Usaremos o **Firebase Authentication**. A autenticação se dará exclusivamente por Email e Senha (com senhas de no mínimo 8 caracteres). Também utilizaremos validação via Token JWT nas requisições ao sistema.

## Consequências
- Acelera a implementação da US01, US02 e US03, abstraindo a complexidade de gerenciar senhas criptografadas e tokens manualmente.
- Facilita a segurança e conformidade com leis de proteção de dados.
