# SPEC: Motor de Autenticação com Firebase (Backend)

**Referência:** Story 1.1 (Micael)  
**Status:** Implementado ✅  

## 1. Definição do Problema
Precisamos implementar a lógica de backend para autenticação (Login e Cadastro) usando Firebase, mas respeitando o padrão arquitetural MVVM do projeto. A camada visual não pode conhecer a existência do Firebase.

## 2. Abordagem Arquitetural (Design Técnico)
Para resolver esse problema, aplicaremos o padrão **Adapter** combinado com **Injeção de Dependência** através de Interfaces em TypeScript.

### 2.1. O Contrato de Serviço (`IAuthService`)
Será criada uma interface rigorosa que define as capacidades do motor de autenticação:
```typescript
interface IAuthService {
  login(dados: LoginData): Promise<User>;
  register(dados: RegisterData): Promise<User>;
}
```
Essa interface blinda o resto da aplicação. Se no futuro trocarmos o Firebase pela AWS, o resto do sistema não quebra.

### 2.2. O Adaptador (`FirebaseAuthAdapter`)
Classe concreta que implementará a `IAuthService` e fará os "imports" reais do SDK do Firebase (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`).

### 2.3. O View-Model (`useLogin` / `useRegister`)
Criaremos hooks customizados React que vão instanciar o `FirebaseAuthAdapter`.
- **Entrada:** Vai receber chamadas da View (botão Clicar).
- **Processamento:** Vai despachar a chamada para a Interface.
- **Saída:** Vai atualizar os estados do React (`isLoading`, `errorMessage`) para a View desenhar na tela.

## 3. Segurança e Validação de Dados
- **Feedforward (Zod):** Antes de bater no Firebase, os dados da View devem passar obrigatoriamente pelas regras definidas em `src/specs/schemas/auth.schema.ts`.
- **Tratamento de Erros:** O Adapter deve interceptar os erros feios do Firebase (ex: `auth/email-already-in-use`) e jogar exceções com mensagens traduzidas para português.

## 4. Variáveis de Ambiente Necessárias
O desenvolvedor deverá incluir no `.env.local`:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

---
> **Nota do Arquiteto:** Este artefato de implementação serviu como base técnica estrita para o desenvolvimento do Épico 01, garantindo que o código não violasse as decisões arquiteturais da equipe.
