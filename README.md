# ATIVIDADE AVALIATIVA A3 - MATEMÁTICA COMPUTACIONAL
*Atividade produzida para obtenção de nota na disciplina de Matemática Computacional, ministrada pelos professores André e Leonardo - Campus Una Contagem*

## Integrantes
*Alunos do segundo período dos cursos de Ciência da Computação e Análise e Desenvolvimento de Sistemas*

NOME | RA | PAPEL
--- | --- | --- |
Arthur Cantarutti Caldeira | 4261213396 | Dev Funções
Bernardo Rocha Fernando | 4261215392 | Dev Combinatória
Gabrielly da Silva Cunha | 4261213545 | Dev Matrizes
Guilherme Augusto Honorato dos Santos | 4261210846 | QA / Testes
Mariana de Paula Duarte | 4261214425 | Líder Técnica
Thaís Augusta Pereira de Miranda | 4261216308 | Dev Módulo Diferencial

**Crédito de implementação:** a estrutura HTML original do módulo de matrizes foi desenvolvida por [Gabrielly da Silva Cunha (@gabbycunha)](https://github.com/gabbycunha) e enviada para integração ao projeto. A integração, a estilização e os ajustes posteriores foram realizados em etapas separadas. A autoria desse HTML não implica autoria do JavaScript do módulo.

**Crédito de implementação:** a implementação original do módulo de análise combinatória foi desenvolvida por [Bernardo Rocha Fernando (@bernardo486)](https://github.com/bernardo486), com integração e ajustes posteriores em etapas separadas.

**Crédito de implementação:** a implementação original do módulo de funções foi desenvolvida por [Arthur Cantarutti Caldeira (@kkkantarutty)](https://github.com/kkkantarutty). A integração, as correções e a ampliação para expressões foram realizadas posteriormente.

## Sobre o projeto
O projeto aqui presente consiste, essencialmente, em uma calculadora científica digital. Além das funções clássicas, possui funcionalidades como funções, matrizes, análise combinatória e aplicação da fórmula de Bhaskara, ampliando, assim, o conhecimento da matemática e a sua aplicação prática com o uso da computação. Esta calculadora é, basicamente, um aparelho de conexão entre as mais diversas áreas do estudo básico e um facilitador dos estudos, planejado com a sua estética escura e liminar para evocar uma nostalgia estranha e invocar, ao mesmo tempo, o entendimento das áreas aqui citadas.

**Tecnologias usadas:** Foram usados, no projeto, componentes clássicos da programação web: HTML, CSS e JavaScript. É de suma importância ressaltar a colaboração e a padronização entre os integrantes do grupo.

## Como executar

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` no navegador.
3. No menu, escolha **Calculadora científica**, **Análise combinatória**, **Funções** ou **Matrizes**.

Não é necessário instalar dependências ou iniciar um servidor. O gráfico da página de funções usa a biblioteca Chart.js, carregada por CDN, e precisa de conexão com a internet.

## Funcionalidades disponíveis no menu

### Calculadora científica

- Operações básicas, parênteses, potências e raiz quadrada.
- Seno, cosseno e tangente, com seleção de graus (DEG) ou radianos (RAD).
- Logaritmo decimal (`log`), logaritmo natural (`ln`) e constantes π e e.
- Fatorial, inverso, troca de sinal e porcentagem.
- Teclas para limpar o visor e apagar o último caractere.
- Mensagens para expressões inválidas e operações como divisão por zero.

As funções científicas são aplicadas ao resultado da expressão no visor. Por exemplo, digite `30` e clique em `sen`, com DEG selecionado, para obter aproximadamente `0,5`. Para calcular uma potência, use `2`, `xʸ`, `3` e `=` para obter `8`. A tecla `%` divide o valor do visor por 100; o fatorial aceita inteiros de 0 a 170.

### Análise combinatória

- Fatorial.
- Permutação simples, com repetição e circular.
- Arranjo simples e com repetição.
- Combinação simples e com repetição.
- Exibição da fórmula, substituição dos valores e resultado.
- Validação de entradas e mensagens de erro.

Os cálculos de análise combinatória usam `BigInt` para representar resultados inteiros grandes com precisão. As entradas são limitadas a 1000, conforme as regras de cada operação.

### Funções

- Funções de primeiro grau (`ax + b`) e segundo grau (`ax² + bx + c`).
- Entrada de expressões como `2x² + 3x - 1`, `sqrt(x)` e `1/x`.
- Cálculo de `f(x)` para o valor informado.
- Análise das raízes e classificação da função.
- Para o segundo grau: delta, vértice, concavidade e tipo de extremo.
- Gráfico e tabela com início, fim e passo configuráveis, com até 201 linhas na tabela.
- Identificação de pontos fora do domínio, como raiz de negativo ou divisão por zero.
- Restauração dos valores iniciais.

Nos modos por coeficientes, `a` deve ser diferente de zero. No modo **Digitar uma expressão**, use `x`, parênteses, `+`, `-`, `*`, `/`, `^`, `sqrt`, `raiz`, `abs`, `sen`/`sin`, `cos`, `tan`, `log`, `ln` e `exp`. As funções trigonométricas desse módulo usam radianos. O gráfico usa o intervalo escolhido e omite pontos não representáveis. A verificação de domínio é feita nos pontos avaliados, sem análise simbólica de todo o domínio.

Se o Chart.js não carregar, a página avisa que o gráfico está indisponível e mantém o cálculo e a tabela funcionando.

### Matrizes

- Criação de matrizes A e B com 1 a 8 linhas e colunas.
- Soma e subtração de matrizes com as mesmas dimensões.
- Multiplicação de A por um escalar.
- Multiplicação de A por B, respeitando a compatibilidade das dimensões.
- Determinante de A, quando quadrada, e transposta de A.
- Exibição do resultado em tabela e mensagens para entradas inválidas.

Alterar as dimensões recria os campos da matriz com zero. A matriz B só aparece nas operações que precisam dela.

Os módulos científico, de funções e de matrizes usam o tipo `Number` do JavaScript. Por isso, resultados decimais e números muito grandes podem apresentar aproximações.

## Organização dos arquivos

- `index.html`: menu principal.
- `calculadora.html`: interface da calculadora científica.
- `combinatoria.html`: formulário e resultados de análise combinatória.
- `funcoes.html`: interface de funções de primeiro e segundo grau.
- `matrizes.html`: interface das operações com matrizes.
- `js/calculadora.js`: leitura das expressões e funções científicas.
- `js/matematica.js`: leitor de expressões e formatação numérica compartilhados.
- `js/script.js`: cálculos e validação da análise combinatória.
- `js/functions.js`: cálculos, análise, gráfico e tabela de funções.
- `js/matrizes.js`: criação dos campos, validação e operações com matrizes.
- `css/style.css`: estilos compartilhados pelas páginas do projeto.
- `assets/`: imagens usadas na interface.
- `tests/matematica.test.cjs`: testes matemáticos que podem ser executados com `node --test tests/matematica.test.cjs`.

## Estilo visual

A interface segue uma estética grunge inspirada no protótipo: foto de fundo escurecida, tons de verde-oliva e marrom, painel com aparência de papel envelhecido e fonte de máquina de escrever. O CSS contém comentários explicando as principais partes da estilização.

## Registro de desenvolvimento — 15/11/2026

Nesta etapa, foram preparados o menu inicial e a página de análise combinatória, com navegação entre as duas telas. A interface recebeu uma estilização inspirada no protótipo, usando a imagem da pasta `assets` como fundo.

Na sequência, foram integrados os módulos de funções e matrizes e a calculadora científica. O teclado científico foi organizado com funções à esquerda e números e operadores à direita; em telas pequenas, os blocos ficam um abaixo do outro. As páginas dos módulos possuem um link para voltar ao menu.

### Roteiro de verificação manual

- Abrir o `index.html` e acessar a análise combinatória pelo menu.
- Calcular `C(10, 3)` e conferir se o resultado é `120`.
- Escolher fatorial, informar `5` e conferir se o resultado é `120`.
- Em combinação simples, informar `k` maior que `n` e conferir a mensagem de erro.
- Usar o link de voltar e conferir o retorno ao menu.

Para conferir os demais módulos:

| Módulo | Entrada ou ação | Resultado esperado |
| --- | --- | --- |
| Científica | `2 + 3 * 4`, seguido de `=` | `14`, respeitando a ordem das operações |
| Científica | `30`, DEG e `sen` | Aproximadamente `0,5` |
| Científica | `1 / 0`, seguido de `=` | Mensagem de divisão por zero |
| Funções | Primeiro grau, `a = 2`, `b = -4` e `x = 3` | `f(3) = 2`, raiz `2`, gráfico e tabela preenchidos |
| Funções | Segundo grau, `a = 1`, `b = -3`, `c = 2` | Raízes `1` e `2`, delta `1` e concavidade para cima |
| Matrizes | Determinante de A com linhas `[1, 2]` e `[3, 4]` | `-2` |
| Matrizes | Soma com A de dimensão 2 × 2 e B de dimensão 2 × 3 | Mensagem de dimensões incompatíveis |

Também conferir a navegação de cada módulo de volta ao menu e a disposição do teclado científico em telas pequenas.

Este roteiro documenta verificações a realizar; não representa um registro de testes já executados.
