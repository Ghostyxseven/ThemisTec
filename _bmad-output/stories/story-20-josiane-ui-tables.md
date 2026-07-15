# [STORY] Estilização de Tabelas e Cards (US20)

**Issue:** #49
**Responsável:** Josiane (Frontend)
**Épico:** 05 (Revitalização de UI/UX)

## Descrição
Como advogado, eu quero visualizar os dados dos meus clientes, processos e métricas do painel em interfaces limpas, bem espaçadas e que destaquem as informações mais importantes (como status), para que a minha navegação seja agradável, intuitiva e transmita a sensação de um sistema corporativo "premium".

## Critérios de Aceite
1. **Cards (Dashboard)**: Os cards de métricas devem possuir bordas mais suaves, sombras melhor desenhadas (`shadow-sm` para `shadow-lg` no *hover*), e ícones com cores vibrantes em "bolhas" (círculos com background suavizado).
2. **Tabelas (Clientes e Processos)**:
    - O cabeçalho da tabela deve se destacar de maneira sutil.
    - As linhas da tabela devem possuir espaçamento generoso (`py-5`) para dar um aspecto menos "esmagado".
    - Deve haver uma transição de cor (`hover:bg-gray-50`) ao passar o mouse pelas linhas.
3. **Badges**:
    - Todos os indicadores visuais (Em Andamento, Concluído, Pago, etc.) devem ser refatorados para o padrão de *pill badges* modernos (bordas arredondadas, fundo da cor de destaque muito claro `bg-opacity-10`, texto forte e com ícone ou *dot* indicativo opcional).
4. **Empty States (Estados Vazios)**:
    - Quando a tabela estiver vazia, exibir um ícone grande, limpo e ilustrativo com uma mensagem de ação ("Call to Action") clara.
