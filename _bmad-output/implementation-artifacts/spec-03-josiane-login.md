# SPEC: Implementação Visual da Tela de Login (Front-end)

**Referência:** Story 1.3 (Josiane)  
**Status:** Ready for Dev (Aguardando Agente/Josiane)  

## 1. Arquivos-Alvo (Target Files)
Esta especificação dita as mudanças exatas que o desenvolvedor (ou Agente) deverá fazer para concluir a Story 1.3.

- **Arquivo Principal:** `src/app/login/page.tsx`
- **Hook de Lógica (Não alterar):** `src/app/login/useLogin.ts`
- **Schema de Validação (Não alterar):** `src/specs/schemas/auth.schema.ts`

## 2. Instruções de Implementação

### 2.1. Importação de Dependências
O componente `page.tsx` deverá ser configurado como Client Component (`"use client";`) e importar estritamente:
- `useForm` do `react-hook-form`.
- `zodResolver` do `@hookform/resolvers/zod`.
- O schema de validação (`loginSchema`) exportado do nosso Zod.
- O hook de ViewModel `useLogin`.
- `useState` do React (para controlar a visibilidade da senha).

### 2.2. Inicialização do Formulário
Inicializar o `react-hook-form` acoplado ao Zod:
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema)
});
```

### 2.3. Lógica de UI (O "Olhinho" da Senha)
Criar um estado local para controlar se a senha está visível:
```typescript
const [showPassword, setShowPassword] = useState(false);
```
O input de senha deverá alternar a propriedade `type` entre `"password"` e `"text"` baseado nesse estado.

### 2.4. Integração com o ViewModel (MVVM)
Instanciar o hook feito pelo Micael:
```typescript
const { login, isLoading, errorMessage } = useLogin();
```
O evento `onSubmit` do formulário deve repassar os dados validados diretamente para a função `login(data)`.

### 2.5. Requisitos Visuais (Tailwind)
- A tela deve ser centralizada verticalmente e horizontalmente.
- O botão de "Entrar" deve ser desabilitado (`disabled={isLoading}`) e mudar de texto para "Carregando..." enquanto a requisição Firebase acontece.
- Se a variável `errorMessage` (vinda do hook) não for nula, ela deve ser exibida no topo do formulário em um alerta vermelho.
- Os erros de campo (ex: `errors.email?.message`) devem ser exibidos logo abaixo dos respectivos `inputs` usando texto vermelho e fonte pequena (`text-red-500 text-sm`).

## 3. Limites Estritos (Harness)
- 🛑 **PROIBIDO:** Importar qualquer coisa do `firebase/auth` neste arquivo. A View não fala com o banco.
- 🛑 **PROIBIDO:** Criar funções de validação de e-mail na mão (Regex). Confie cegamente no Zod.
- ✅ **OBRIGATÓRIO:** Rodar `npm run typecheck` antes de fazer o commit.

