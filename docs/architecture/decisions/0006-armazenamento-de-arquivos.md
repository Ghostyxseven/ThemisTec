# 6. Armazenamento de Arquivos

Data: 2026-06-18

## Status
Aceito

## Contexto
No Épico de Gestão de Processos (US09), o advogado precisa anexar documentos PDF aos processos para guardar documentos importantes. É necessário armazenar isso de forma segura e atrelar ao banco de dados.

## Decisão
Usaremos o **Firebase Storage**. 
O sistema terá validações rígidas:
- Permitir apenas o formato PDF.
- Tamanho máximo de 10 MB por arquivo.
- Após o upload, a URL do arquivo no Firebase Storage será vinculada ao documento do processo no Firestore.

## Consequências
- Fácil integração com a stack atual do Firebase.
- Custos geridos sob o plano de armazenamento (Plano Blaze necessário futuramente, mitigado inicialmente pelos créditos Cloud).
- Tratativas de erro e fluxo de upload bem estabelecidos no front-end.
