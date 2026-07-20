# Source Tree Analysis

A estrutura de diretórios foca na organização Clean Architecture e MVVM implementada no projeto.

```
project-root/
├── src/
│   ├── app/                 # Next.js App Router (Views e Rotas)
│   │   ├── login/           # Tela de Login (View e ViewModel)
│   │   │   ├── page.tsx     # View (Renderização)
│   │   │   └── useLogin.ts  # ViewModel (Lógica de estado e chamadas ao Model)
│   │   └── ...
│   ├── services/            # Serviços de Infraestrutura (Model)
│   │   └── supabase/        # Integração com Supabase
│   │       ├── supabase.config.ts    # Inicialização do App Supabase
│   │       └── SupabaseAuthAdapter.ts# Implementação da injeção de dependência
│   ├── shared/              # Código compartilhado
│   │   └── interfaces/      # Interfaces de contrato (ex: IAuthService.ts)
│   └── specs/               # Especificações, validadores e tipos
│       └── schemas/         # Schemas do Zod (ex: auth.schema.ts)
├── _bmad-output/            # Saída de documentação do BMad
│   ├── planning-artifacts/  # Documentos de planejamento de Épicos
│   └── project-knowledge/   # Base de conhecimento e arquitetura do projeto
└── public/                  # Arquivos estáticos
```

## Pastas Críticas Explicadas

- **\src/app/*\**: Contém os Entry Points da aplicação (páginas visuais) seguindo as convenções do Next.js.
- **\src/services/*\**: A camada de serviços, que é o Model no padrão MVVM. Contém o motor de autenticação e comunicação com APIs externas.
- **\src/shared/interfaces/*\**: Define os contratos rigorosos (Interfaces TS) que os serviços devem implementar, mantendo o baixo acoplamento entre View e Model.
