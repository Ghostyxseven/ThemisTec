# 📝 Code Review: Funcionalidade de Login

| Meta | Detalhe |
| :--- | :--- |
| **Feature** | `feat(auth): implementar pagina de login com MVVM e validacao Zod` |
| **Desenvolvedora** | Josiane |
| **Status** | 🟢 Aprovado (Arquitetura e UX) |

---

## 🏆 O que está excelente! (Pontos Fortes)

Você fez um trabalho muito sólido estabelecendo a base de autenticação do ThemisTec. Os seguintes pontos demonstram alto rigor técnico e alinhamento com nossas **Architectural Decision Records (ADRs)**:

*   ✅ **MVVM Perfeito (ADR-0007):** A separação entre o arquivo visual `page.tsx` (View) e a lógica em `useLogin.ts` (ViewModel) mantém o código testável e limpo.
*   ✅ **Instância Única (ADR-0008):** A implementação do `firebase.client.ts` resolvendo o problema do *Server-Side Rendering* do Next.js via Padrão Singleton foi cirúrgica.
*   ✅ **Robustez nas Bordas:** O uso correto das propriedades ARIA para acessibilidade e a validação no limite do componente utilizando **Zod** (`LoginSchema`) são excelentes práticas.

---

## 🏗️ Ação Necessária: Adapter Orientado a Objetos (ADR-0008)

Notamos o seguinte comentário na submissão do seu ViewModel (`useLogin.ts`):
> `TODO (Micael): substituir pelo FirebaseAuthAdapter quando implementado.`

Excelente percepção! O nosso **ADR-0008** exige rigorosamente que a fronteira com bibliotecas externas utilize **Programação Orientada a Objetos (POO)**. Para fechar esse débito técnico (seja por você agora ou pelo Micael depois), a implementação deve seguir estes passos:

### 1. Criar o Contrato (Interface)
Garante que o ViewModel não saiba nada sobre "Firebase", facilitando a criação de Mocks nos testes unitários.
```typescript
// src/shared/interfaces/IAuthService.ts
import { LoginInput } from "@/specs/schemas/auth.schema";

export interface IAuthService {
  login(dados: LoginInput): Promise<void>;
  logout(): Promise<void>;
}
```

### 2. Criar a Classe (Padrão Adapter)
Encapsula o SDK do Firebase e traduz erros técnicos para mensagens amigáveis de negócio.
```typescript
// src/services/firebase/FirebaseAuthAdapter.ts
import { IAuthService } from "@/shared/interfaces/IAuthService";
import { LoginInput } from "@/specs/schemas/auth.schema";
import { getFirebaseApp } from "./firebase.client";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export class FirebaseAuthAdapter implements IAuthService {
  private auth;

  constructor() {
    this.auth = getAuth(getFirebaseApp());
  }

  public async login(dados: LoginInput): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, dados.email, dados.senha);
    } catch (error: any) {
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        throw new Error("E-mail ou senha incorretos.");
      }
      throw new Error("Falha na autenticação. Tente novamente.");
    }
  }

  public async logout(): Promise<void> {
    await this.auth.signOut();
  }
}
```

### 3. Injeção de Dependência no ViewModel
Substitua a lógica procedural dentro do seu `useLogin.ts` pela chamada do objeto instanciado:
```typescript
import { FirebaseAuthAdapter } from "@/services/firebase/FirebaseAuthAdapter";
// ...
const authService = new FirebaseAuthAdapter();
// ...
await authService.login(dados); 
```

---

## 💡 Próximos Passos & Oportunidades de Refinamento (UX)

Para deixar a funcionalidade com qualidade "Premium" para o usuário final, recomendamos algumas adições:

### 1. Migração para `react-hook-form`
Atualmente o formulário usa estados locais pesados (`form` e `fieldErrors`). Como o Zod já está configurado, o `react-hook-form` reduzirá a renderização e o boilerplate drásticamente.

<details>
<summary>Exemplo rápido de integração</summary>

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginInput } from "@/specs/schemas/auth.schema";

const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
  resolver: zodResolver(LoginSchema)
});

// No formulário:
// <form onSubmit={handleSubmit(suaFuncaoDeLogin)}>
// <input {...register("email")} />
// {errors.email && <span>{errors.email.message}</span>}
```
</details>

### 2. Ocultar/Exibir Senha
No mobile (e web), digitar senhas complexas sem visualização frustra usuários. Adicione um pequeno estado para alternar o `type` do input entre `"password"` e `"text"`.
```tsx
const [mostrarSenha, setMostrarSenha] = useState(false);
// ...
<input type={mostrarSenha ? "text" : "password"} {...register("senha")} />
<button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}>👁️</button>
```

### 3. Input Mode Específico (Mobile)
Adicione `inputMode="email"` no input de e-mail. Isso força o teclado do celular a já abrir exibindo a tecla `@`, acelerando o login.

---

## ✅ Checklist para Conclusão

- [x] Implementar `IAuthService` e `FirebaseAuthAdapter` (ou alinhar com Micael).
- [x] Refatorar `useLogin` para usar o Adapter (Injeção de dependência).
- [x] Refatorar a View para usar `react-hook-form` + `zodResolver`.
- [x] Adicionar botão de visualizar senha (UX).
- [x] Adicionar `inputMode="email"` ao campo de e-mail (UX).
