# Disciplina: Engenharia de Software
**Professor:** Mayllon Veras

## ANATOMIA E PADRÕES DA ARQUITETURA DE SOFTWARE
### Trabalho de Pesquisa Orientada

**Integrantes:**
- Gisele Dias Plácido
- Josiane Amorim Mendes
- Marcos Vinícius de Oliveira Teixeira
- Micael Cardoso

**Curso:** Análise e Desenvolvimento de Sistemas — 20262

## 1. Introdução

No cenário atual da tecnologia, desenvolver um sistema que apenas funcione já não é suficiente. Os softwares modernos precisam ser organizados, seguros, fáceis de manter e preparados para crescer conforme surgem novas necessidades.

Dessa forma, a arquitetura de software se torna uma etapa essencial no desenvolvimento, pois define como os componentes do sistema serão estruturados e como irão se comunicar.

A arquitetura de software não está relacionada apenas à escolha de linguagens ou frameworks, mas principalmente à definição de padrões que permitam criar aplicações mais organizadas, escaláveis e de fácil manutenção. Uma arquitetura mal planejada pode gerar problemas como dificuldade de evolução do sistema, aumento de erros, código desorganizado e baixa produtividade no desenvolvimento.

Diante disso, diversos padrões arquiteturais foram criados para solucionar problemas recorrentes no desenvolvimento de software, permitindo uma melhor separação de responsabilidades entre interface, lógica de negócio e armazenamento de dados. Entre esses padrões, destacam-se MVC, MVP, MVVM, Clean Architecture, Arquitetura em Camadas e Monolito Modular, amplamente utilizados em aplicações modernas.

Neste trabalho, será realizada uma análise dos principais padrões de arquitetura de software em diferentes níveis: apresentação da interface, organização interna do código e estrutura geral da aplicação. Além da explicação conceitual, serão discutidas vantagens, desvantagens e aplicabilidades práticas de cada abordagem.

A pesquisa será relacionada ao desenvolvimento do sistema ThemisTec, uma plataforma voltada para advogados autônomos e pequenos escritórios jurídicos. O sistema tem como objetivo centralizar o gerenciamento de clientes, processos e documentos jurídicos, substituindo métodos manuais e planilhas por uma solução web moderna e organizada.

O projeto utiliza tecnologias como Next.js, Firebase, Vercel e Cloudflare, buscando oferecer desempenho, segurança e facilidade de uso. Dessa forma, os padrões arquiteturais estudados serão analisados considerando as necessidades reais do MVP do ThemisTec, permitindo identificar quais abordagens são mais adequadas para garantir organização, escalabilidade, manutenção e eficiência no desenvolvimento do sistema.

## 2. Padrões de Apresentação

### 2.1 MVC (Model View Controller)

O padrão MVC (Model View Controller) é uma arquitetura que divide o sistema em três partes principais: Model, View e Controller. Seu principal objetivo é separar a lógica do sistema da interface visual, facilitando a organização e manutenção do software.

No sistema ThemisTec, o Model seria responsável pelos dados dos clientes, processos jurídicos e documentos armazenados no Firebase. A View corresponde às telas desenvolvidas em Next.js, como cadastro de clientes, listagem de processos e login. Já o Controller atua como intermediador entre a interface e os dados, recebendo as ações do usuário e processando as informações necessárias.

Por exemplo, quando um advogado cadastra um novo processo jurídico: a View envia os dados; o Controller recebe a solicitação; o Model salva as informações no Firebase; a View exibe a confirmação do cadastro.

> **Figura 1 — Fluxo do padrão MVC no ThemisTec.**
> Advogado → View (Next.js) → Controller (lógica) → Model (Firebase) → Atualização da tela

**Vantagens do MVC no projeto:**
- Separação entre interface e lógica;
- Facilidade para manutenção das telas;
- Melhor organização do sistema;
- Permite alterar a interface sem modificar regras de negócio.

**Desvantagens do MVC:**
- Controllers podem crescer excessivamente;
- Dificuldade de testes em projetos maiores;
- Alto acoplamento entre Controller e View.

Para o MVP do ThemisTec, o MVC pode ser útil em funcionalidades simples, como login e cadastro de clientes, devido à sua implementação mais rápida.

### 2.2 MVP (Model View Presenter)

O padrão MVP (Model View Presenter) também divide o sistema em três partes, porém o Presenter assume maior controle sobre a interface. No ThemisTec, o Model continua sendo responsável pelos dados; a View apenas exibe informações; o Presenter controla toda a lógica de interação.

Em uma funcionalidade de consulta de processos: o advogado pesquisa um processo; a View envia o evento ao Presenter; o Presenter consulta os dados no Firebase; os resultados retornam para a View.

> **Figura 2 — Fluxo do padrão MVP no ThemisTec.**
> Usuário → View (passiva) → Presenter (controla) → Model (Firebase)
> (Setas tracejadas: atualização de retorno)

**Vantagens do MVP no projeto:**
- Melhor desacoplamento da interface;
- Facilidade para testes;
- Organização maior da lógica da interface.

**Desvantagens:**
- Presenter pode se tornar muito grande;
- Maior quantidade de código;
- Complexidade maior para equipes pequenas.

Para o MVP do ThemisTec, o MVP pode funcionar bem em módulos mais específicos, mas pode aumentar a complexidade do projeto inicial.

**Comparação MVC × MVP no ThemisTec**

| MVC | MVP |
|---|---|
| Controller controla o fluxo | Presenter controla o fluxo |
| View possui mais responsabilidade | View possui menos responsabilidade |
| Mais simples para MVP rápido | Melhor organização em sistemas maiores |
| Implementação mais rápida | Melhor testabilidade |

### 2.3 MVT (Model View Template)

O padrão MVT (Model View Template) é utilizado principalmente no Django e funciona como uma adaptação do MVC tradicional. No MVT, o Model gerencia os dados; a View controla a lógica; o Template representa a interface visual.

Embora o ThemisTec utilize Next.js e não Django, o conceito do MVT ainda ajuda a compreender a separação entre lógica, dados e interface. Em um cenário hipotético utilizando Django, a View buscaria os processos jurídicos, o Model acessaria o banco e o Template exibiria os dados ao advogado.

> **Figura 3 — Fluxo do padrão MVT.**
> Usuário → View (lógica) → Model (dados) → Template (visual)

**Equivalência entre MVC e MVT**

| MVC | MVT |
|---|---|
| Model | Model |
| View | Template |
| Controller | View |

**Vantagens do MVT:**
- Boa integração no Django;
- Separação clara das responsabilidades;
- Desenvolvimento rápido.

**Desvantagens:**
- Dependência do framework;
- Estrutura menos intuitiva para iniciantes.

Apesar de o ThemisTec não utilizar Django, compreender o MVT ajuda na análise comparativa entre arquiteturas modernas.

### 2.4 MVVM (Model View ViewModel)

O padrão MVVM (Model View ViewModel) é muito utilizado em aplicações modernas com interfaces reativas, como React, Angular e Flutter. Como o ThemisTec utiliza Next.js, que trabalha com componentes reativos semelhantes ao React, o MVVM se encaixa melhor no projeto.

No MVVM, o Model representa os dados do sistema, a View representa as telas e a ViewModel faz a ligação entre interface e dados. No sistema ThemisTec, quando um advogado altera o status de um processo, a ViewModel atualiza os dados, a interface muda automaticamente, e não é necessário recarregar a página.

> **Figura 4 — Fluxo do padrão MVVM com data binding bidirecional.**
> Usuário → View ⇄ ViewModel ⇄ Model (Firebase) [data binding]

**Data Binding no ThemisTec**

O Data Binding permite atualização automática da interface. Exemplo: um processo muda de "Em andamento" para "Concluído"; o sistema atualiza automaticamente a tela; o advogado visualiza a alteração instantaneamente. Isso melhora a experiência do usuário, a produtividade e a rapidez no gerenciamento dos processos.

**Vantagens do MVVM no projeto:**
- Melhor desacoplamento;
- Atualização automática das telas;
- Melhor experiência do usuário;
- Facilidade para manutenção futura;
- Boa integração com interfaces modernas.

**Desvantagens:**
- Curva de aprendizado maior;
- Maior complexidade estrutural;
- Comunicação entre componentes pode ficar complexa.

## 3. Aplicabilidade no MVP do ThemisTec

Considerando as necessidades do sistema ThemisTec, o padrão MVVM apresenta maior compatibilidade com o projeto devido ao uso do Next.js e da necessidade de interfaces dinâmicas e reativas.

O MVC pode auxiliar em partes mais simples do sistema, porém o MVVM oferece maior escalabilidade e melhor experiência para o usuário final. Já o MVP apresenta vantagens em organização, mas pode adicionar complexidade desnecessária ao MVP inicial.

Assim, para o desenvolvimento inicial do sistema:
- MVC pode ser usado em funcionalidades simples;
- MVVM é mais adequado para as telas dinâmicas do sistema;
- MVP seria mais interessante em módulos específicos e futuros.

## 4. Conclusão Crítica

Considerando as restrições de tempo, escopo e equipe do MVP definido no Status Report 1 — uma equipe de quatro estudantes, prazo de um semestre letivo e público-alvo formado por advogados autônomos e pequenos escritórios — a combinação ideal de padrões para o ThemisTec precisa equilibrar boas práticas e simplicidade, evitando excesso de engenharia.

No nível macro, optamos pelo Monolito Modular. Microsserviços seriam tecnicamente mais modernos, mas introduzem custos de deploy independente, comunicação entre serviços e observabilidade distribuída que não se pagam dentro do prazo disponível. O monolito modular do Next.js permite que cada módulo (clientes, processos, documentos) viva em uma pasta isolada, com fronteiras claras, mas compartilhando deploy, build e autenticação na Vercel. Caso o produto cresça no futuro, será possível extrair módulos específicos para serviços separados.

No nível médio, escolhemos a Arquitetura em Camadas de forma pragmática. Clean Architecture pura exigiria entidades, casos de uso, gateways e adaptadores — uma quantidade de código que atrasa a entrega sem entregar valor proporcional em um MVP. Mantemos o espírito da Clean (regra de dependência apontando para o domínio) mas reduzimos a estrutura a poucas camadas: `app/` para as rotas do Next.js, `features/` para a lógica de cada módulo, `services/` para acesso ao Firebase e APIs externas, e `lib/` para utilitários compartilhados.

No nível micro, adotamos o MVVM como padrão dominante e o MVC em pontos específicos. O MVVM é a escolha natural para componentes React em que o estado dirige a interface, como o painel de processos, o dashboard de KPIs e listagens com filtros reativos — hooks como `useState` e `useEffect` já funcionam essencialmente como uma ViewModel. Já em telas estáticas, com fluxo "preencher formulário e salvar" (login, cadastro de cliente, cadastro inicial de processo), o MVC é mais econômico, com server actions ou route handlers fazendo o papel do Controller. O MVP fica reservado para módulos futuros com lógica de apresentação mais complexa, como geração de petições ou editor jurídico.

O princípio que orienta essas escolhas é simples: o padrão deve ser proporcional à complexidade da feature, e não ao desejo de aplicar a arquitetura mais elaborada possível. O MVP do ThemisTec precisa existir e funcionar ao final do semestre, e uma combinação híbrida e pragmática entrega esse objetivo melhor do que uma arquitetura uniforme e excessivamente sofisticada.

## 5. Referências

1. FOWLER, Martin. *Patterns of Enterprise Application Architecture.* Boston: Addison-Wesley, 2002.
2. FOWLER, Martin. *GUI Architectures.* Disponível em: https://martinfowler.com/eaaDev/uiArchs.html. Acesso em: maio 2026.
3. MARTIN, Robert C. *Clean Architecture: A Craftsman's Guide to Software Structure and Design.* Boston: Prentice Hall, 2017.
4. GAMMA, E.; HELM, R.; JOHNSON, R.; VLISSIDES, J. *Design Patterns: Elements of Reusable Object-Oriented Software.* Boston: Addison-Wesley, 1994.
5. RICHARDS, Mark; FORD, Neal. *Fundamentals of Software Architecture.* Sebastopol: O'Reilly Media, 2020.
6. NEWMAN, Sam. *Monolith to Microservices.* Sebastopol: O'Reilly Media, 2019.
7. VERCEL. *Next.js Documentation.* Disponível em: https://nextjs.org/docs. Acesso em: maio 2026.
8. GOOGLE. *Firebase Documentation.* Disponível em: https://firebase.google.com/docs. Acesso em: maio 2026.
9. DJANGO SOFTWARE FOUNDATION. *Django Documentation.* Disponível em: https://docs.djangoproject.com. Acesso em: maio 2026.
10. PRESSMAN, R. S.; MAXIM, B. R. *Engenharia de Software: Uma Abordagem Profissional.* 8. ed. Porto Alegre: AMGH, 2016.
11. SOMMERVILLE, Ian. *Engenharia de Software.* 10. ed. São Paulo: Pearson, 2019.
