# Story 01: Motor de Autenticação com Firebase (Backend/Model)

**Responsável:** Micael  
**Status:** done
**Épico Relacionado:** Épico 01 - Autenticação  

## 1. Contexto e Objetivo
Precisamos de um sistema de autenticação seguro para a ThemisTec. Para garantir escalabilidade e não acoplar a aplicação a um único provedor (Vendor Lock-in), essa história exige a criação de um motor de autenticação utilizando os princípios de **Clean Architecture** e **Injeção de Dependência** da camada Model do nosso padrão MVVM.

## 2. Contratos Rigorosos (Spec-Driven Development)
Esta task não deve tocar em interfaces visuais (HTML/CSS). Ela deve se limitar à lógica de negócios baseada nos contratos:
- **Interface Mestra:** Criar uma interface rigorosa `IAuthService` definindo os métodos `login` e `register`. Nenhuma outra camada deve importar o SDK do Firebase, apenas esta interface.
- **Data Contracts:** As entradas dos métodos devem respeitar as tipagens de e-mail e senha exigidas no `auth.schema.ts`.

## 3. Requisitos Técnicos
O Micael deverá implementar:

1. **Setup do Firebase:**
   - Criar `firebase.config.ts` para inicializar a aplicação com as variáveis de ambiente seguras (`.env.local`).

2. **O Adapter:**
   - Criar `FirebaseAuthAdapter.ts` que implementa a `IAuthService`.
   - Utilizar as funções `signInWithEmailAndPassword` e `createUserWithEmailAndPassword` do Firebase.
   - Traduzir os erros criptografados do Firebase (ex: `auth/wrong-password`) para mensagens humanizadas que o ViewModel possa usar.

3. **O ViewModel Base:**
   - Criar os hooks reativos `useLogin` e `useRegister` que vão instanciar o `FirebaseAuthAdapter` e expor as funções de login junto com estados de `isLoading` e `errorMessage` para que os desenvolvedores de front-end (ex: Josiane) possam consumi-los posteriormente.

## 4. Harness Engineering (Regras de Entrega)
- [x] O TypeScript não pode acusar quebras de contrato na Interface.
- [x] O `FirebaseAuthAdapter` não pode exportar instâncias diretas do SDK do Firebase.
- [x] **REGRA OBRIGATÓRIA:** A PR deve ser associada a uma Issue usando `Closes #N`.
