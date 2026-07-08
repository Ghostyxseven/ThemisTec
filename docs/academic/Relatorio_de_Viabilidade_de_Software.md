# Relatório de Viabilidade de Software (RVS)

**Componente Curricular:** Engenharia de Software 2
**Professor:** Mayllon
**Formato:** Grupos (Times do Projeto)
**Peso:** Parte integrante do Status Report 1
**Integrantes:** Gisele Dias Plácido, Josiane Amorim Mendes, Marcos Vinícius Oliveira Teixeira, Micael Cardoso Reis.

## 1. Objetivo

Este documento apresenta a análise de viabilidade do sistema ThemisTec. O software tem como finalidade automatizar o fluxo de trabalho de advogados autônomos e pequenos escritórios, substituindo controles manuais e planilhas por uma plataforma centralizada de gestão de clientes, processos e prazos.

## 2. Instruções de Execução

### A. Viabilidade Técnica (Technical)

- **FireBase:** Utilização de um banco de dados para armazenamento das informações dos usuários, Autenticação somente pelo Email e senha.
- **Next Js 16.2.3:** Utilização para desenvolvimento da interface do sistema (front-end), criação de páginas dinâmicas como cadastro e listagem de clientes e processos, além de permitir a implementação de rotas e lógica básica no back-end, facilitando a integração com o Firebase.
- **Vercel:** utilização para hospedagem e deploy do sistema, permitindo publicar a aplicação de forma rápida e simples, com integração direta com projetos em Next.js, além de facilitar atualizações automáticas.
- **Hostinger:** Utilização para gerenciamento de domínio e suporte de hospedagem, garantindo que o sistema esteja acessível na internet. themistec.site
- **Cloudflare:** Utilização para melhorar a segurança e o desempenho do sistema, oferecendo proteção contra ataques (como DDoS), além de otimizar o carregamento do site através de cache e distribuição de conteúdo.

As tecnologias escolhidas (Next.js, Firebase, Vercel, Hostinger e Cloudflare) são estáveis, amplamente utilizadas no mercado e adequadas para o desenvolvimento do sistema proposto.

O Next.js permite a criação de interfaces rápidas e organizadas, sendo ideal para sistemas com múltiplas páginas, como cadastro e consulta de clientes e processos. O Firebase oferece um banco de dados seguro e escalável, além de autenticação integrada, atendendo bem à necessidade de armazenamento e controle de acesso.

O Vercel garante uma hospedagem eficiente e otimizada para aplicações em Next.js, enquanto o Hostinger pode ser utilizado para gerenciamento de domínio. Já o Cloudflare contribui com segurança e desempenho, protegendo o sistema contra ataques e melhorando o tempo de carregamento.

Dessa forma, a stack escolhida é adequada ao problema, pois atende às necessidades do sistema com bom desempenho, segurança e facilidade de implementação.

**Riscos:**

Os riscos de integração com APIs externas são baixos, pois o sistema utilizará principalmente o Firebase, que já oferece serviços integrados como banco de dados e autenticação, reduzindo a necessidade de dependência de APIs externas.

Caso seja necessário integrar outras APIs no futuro (como serviços jurídicos ou envio de e-mails), pode haver riscos como instabilidade do serviço externo, limites de uso (requisições) ou mudanças nas APIs. No entanto, esses riscos podem ser controlados com boas práticas de desenvolvimento.

Em relação ao hardware, não há grandes limitações, pois o sistema será baseado em nuvem (Vercel e Firebase), não exigindo servidores locais robustos. Os usuários precisarão apenas de um dispositivo com acesso à internet e um navegador atualizado.

Dessa forma, os riscos são considerados baixos e não comprometem o desenvolvimento do projeto.

### B. Viabilidade Econômica (Economic)

**Custo Estimado:**

Os custos de infraestrutura do sistema Themis (OrbitTech) são considerados baixos, principalmente na fase inicial, devido à utilização de serviços em nuvem com modelo pay-as-you-go e planos gratuitos.

A solução utiliza a plataforma Firebase, que oferece um conjunto integrado de serviços, incluindo:

- Firestore (banco de dados em tempo real)
- Firebase Authentication (gerenciamento de usuários)
- Firebase Storage (armazenamento de arquivos)
- Firebase Hosting (hospedagem da aplicação web/PWA)

No plano gratuito (Spark), é possível atender aplicações de pequeno porte sem custos iniciais, com limites controlados de armazenamento, operações e transferência de dados.

**Estimativa de Custos Operacionais**

Considerando um modelo de uso com limite de 5 GB por usuário, com possibilidade de expansão conforme necessidade (gerenciada pelo administrador), os custos médios são:

- Armazenamento: aproximadamente R$ 0,65 por usuário/mês
- Transferência de dados (downloads): entre R$ 8 e R$ 12 por usuário/mês

**Fatores de Impacto nos Custos**

Os principais fatores que influenciam os custos são:

- Volume de arquivos armazenados (documentos jurídicos, PDFs, etc.)
- Frequência de acesso e download desses arquivos
- Crescimento da base de usuários

Destaca-se que o custo de transferência de dados (download) tende a ser o principal componente financeiro, superando o custo de armazenamento.

**Custo total estimado:** R$ 8 a R$ 12 por usuário/mês

Além disso, a equipe possui acesso a um crédito de US$ 300 do Google Cloud, com duração de até alguns meses (geralmente até 90 dias), que pode ser utilizado para cobrir custos com armazenamento, banco de dados e requisições durante o desenvolvimento e testes do sistema.

O Vercel oferece hospedagem gratuita, e o Cloudflare também possui plano gratuito para segurança e desempenho. O único custo inicial pode ser o domínio via Hostinger, entre aproximadamente R$ 40 a R$ 80 por ano.

**Benefícios:**

O sistema entrega valor ao organizar de forma centralizada as informações de clientes, processos e documentos, facilitando o acesso e a gestão no dia a dia.

Com isso, gera:

- Economia de tempo, pois reduz o tempo gasto procurando informações
- Redução de erros, evitando perda de dados ou registros incorretos
- Maior produtividade, com processos mais organizados
- Melhor controle, permitindo acompanhar o andamento dos processos

O sistema não gera lucro direto inicialmente, mas contribui para a eficiência do trabalho, podendo resultar em ganhos indiretos ao melhorar a organização e o atendimento.

Estime o TCO (Custo Total de Propriedade) simplificado para os primeiros 6 meses.

### C. Viabilidade Legal (Legal)

O sistema Themis (OrbitTech) lida com dados pessoais de usuários, tais como nome, telefone e informações relacionadas a processos jurídicos. Dependendo do contexto, esses dados podem envolver informações sensíveis, exigindo cuidados adicionais de segurança e privacidade.

Para garantir a adequação à Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018), o sistema adota as seguintes medidas:

- **Controle de acesso:** os dados são acessíveis apenas por usuários autenticados, mediante login e senha
- **Segurança da informação:** os dados são armazenados em ambiente seguro utilizando a infraestrutura do Firebase, que oferece criptografia e proteção contra acessos não autorizados
- **Restrição de compartilhamento:** não há compartilhamento de dados com terceiros sem necessidade ou autorização
- **Princípio da necessidade:** o sistema coleta apenas os dados essenciais para o funcionamento da aplicação
- **Responsabilidade no tratamento:** os dados são utilizados exclusivamente para fins relacionados à gestão dos processos jurídicos

Estimativa simplificada considerando o uso inicial do sistema:

- Firebase (banco + auth + storage): R$ 0 (plano gratuito + uso dos créditos de US$ 300 do Google Cloud) com necessidade de ativação do plano Blaze para o uso do STORAGE de forma que os custos vai ser de forma que foi usado que delimitado em 5G por usuários.
- Vercel (hospedagem): R$ 0 (plano gratuito)
- Cloudflare (segurança e desempenho): R$ 0 (plano gratuito)
- Domínio (Hostinger): ~ R$ 20 a R$ 40 (proporcional a 6 meses)

**Total estimado:** ~ R$ 28,65 a R$ 52,65

Observação: custos podem surgir se houver alto volume de dados ou acessos, mas são cobertos inicialmente pelos créditos do Google Cloud.

Não há restrições significativas de direitos autorais que impactem diretamente o projeto, pois as tecnologias utilizadas (Next.js, Firebase, Vercel e Cloudflare) são ferramentas de uso permitido, com licenças abertas ou comerciais adequadas para desenvolvimento de sistemas.

No entanto, é necessário respeitar os termos de uso dessas plataformas, especialmente do Firebase (Google Cloud), que possui limites de uso, regras para armazenamento de dados e políticas de segurança.

Caso o sistema utilize APIs de terceiros no futuro, será necessário verificar suas políticas, como limites de requisições, custos e permissões de uso. Além disso, deve-se evitar o uso de conteúdos protegidos por direitos autorais sem autorização, como documentos, imagens ou dados externos.

Dessa forma, não há impedimentos legais relevantes, desde que as regras das plataformas utilizadas sejam seguidas corretamente.

### D. Viabilidade Operacional (Operational)

Desde que o sistema apresente uma interface simples e organizada, os usuários conseguiriam utilizá-lo com facilidade. O uso do Next.js permite a criação de telas intuitivas, como formulários de cadastro e listagens claras de clientes e processos.

Além disso, funcionalidades básicas como login, navegação por menus e visualização de informações seguem padrões comuns de sistemas web, o que facilita o aprendizado por parte dos usuários.

No entanto, por se tratar de uma versão inicial, pode ser necessário um breve período de adaptação ou orientação para os usuários, principalmente para explorar todas as funcionalidades disponíveis.

Dessa forma, o sistema é utilizável, mas pode evoluir em usabilidade conforme melhorias futuras.

**Resolução do Problema:**

O sistema resolve o problema real identificado, que é a desorganização de informações de clientes, processos e documentos no ambiente jurídico. Ele centraliza esses dados em um único lugar, facilitando o acesso, a atualização e o acompanhamento das informações.

Além disso, o sistema foi pensado para simplificar tarefas do dia a dia, como cadastro, consulta e controle de processos, evitando o uso de métodos manuais ou dispersos (como papel ou múltiplas planilhas).

Não cria processos complexos, pois utiliza uma interface simples e fluxos diretos, mantendo apenas as funcionalidades necessárias. Dessa forma, o sistema reduz a complexidade existente ao invés de aumentá-la.

### E. Viabilidade de Cronograma (Schedule)

**É possível entregar um MVP funcional dentro do calendário acadêmico (até o início de julho)?**

Sim. É possível entregar um MVP funcional dentro do prazo, considerando o uso de tecnologias que agilizam o desenvolvimento, como Next.js e Firebase.

O MVP pode incluir funcionalidades essenciais, como:

- Cadastro e login de usuários
- Cadastro de clientes
- Registro e consulta de processos
- Armazenamento básico de documentos

Como o Firebase já fornece autenticação e banco de dados prontos, e o Next.js facilita a criação das interfaces, o tempo de desenvolvimento é reduzido.

Dessa forma, focando apenas nas funcionalidades principais e evitando complexidades desnecessárias, é viável concluir um MVP funcional dentro do calendário acadêmico.

**Funcionalidades a serem priorizadas:**

Para garantir a entrega dentro do prazo, devem ser priorizadas as funcionalidades essenciais do sistema:

- Autenticação de usuários (login e cadastro)
- Cadastro de clientes
- Cadastro de processos
- Listagem e consulta de clientes e processos
- Edição e exclusão de registros básicos

Essas funcionalidades garantem o funcionamento principal do sistema, permitindo organizar e acessar as informações.

Funcionalidades mais avançadas, como relatórios, notificações ou automações, podem ser deixadas para versões futuras, evitando atrasos no desenvolvimento do MVP.

## 3. Entrega: Matriz de Riscos

Ao final do relatório, o grupo deve apresentar uma Matriz de Riscos simples:

**Identifique os 3 maiores riscos do projeto.**

- **Limitações do plano gratuito:** O uso do Firebase e outras ferramentas gratuitas pode gerar limitações (armazenamento, requisições), afetando o funcionamento caso o sistema cresça rapidamente.
- **Gestão de tempo e escopo:** Existe o risco de tentar implementar muitas funcionalidades além do essencial, o que pode atrasar a entrega do MVP dentro do prazo estabelecido.
- **Problemas de integração:** Pode haver dificuldades na integração entre Next.js e Firebase, como erros na conexão com o banco de dados, autenticação ou armazenamento de arquivos, o que pode atrasar o desenvolvimento.

**Classifique-os em Probabilidade (Baixa/Média/Alta) e Impacto (Baixo/Médio/Alto).**

**Classificação dos riscos**

| Risco | Probabilidade | Impacto |
|---|---|---|
| Limitações do plano gratuito (Firebase/serviços) | Média | Alto |
| Gestão de tempo e escopo | Alta | Alto |
| Problemas de integração (Next.js e Firebase) | Média | Alto |

**Defina uma Ação de Mitigação para o risco mais crítico.**

Para mitigar o risco de atrasos no desenvolvimento do sistema, será definido um escopo mínimo (MVP) bem delimitado desde o início do projeto, priorizando apenas as funcionalidades essenciais, como login, cadastro de usuários e consulta de dados.

Além disso, as atividades serão divididas entre os membros da equipe de forma organizada, com acompanhamento contínuo do progresso por meio de reuniões semanais e controle de tarefas.

Também será adotada a prática de controle de escopo, evitando a inclusão de novas funcionalidades durante o desenvolvimento (scope creep), garantindo maior foco na entrega.
