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

## Sobre o projeto
O projeto aqui presente consiste, essencialmente, em uma calculadora científica digital. Além das funções clássicas, possui funcionalidades como funções, matrizes, análise combinatória e aplicação da fórmula de Bhaskara, ampliando, assim, o conhecimento da matemática e a sua aplicação prática com o uso da computação. Esta calculadora é, basicamente, um aparelho de conexão entre as mais diversas áreas do estudo básico e um facilitador dos estudos, planejado com a sua estética escura e liminar para evocar uma nostalgia estranha e invocar, ao mesmo tempo, o entendimento das áreas aqui citadas.

**Tecnologias usadas:** Foram usados, no projeto, componentes clássicos da programação web: HTML, CSS e JavaScript. É de suma importância ressaltar a colaboração e a padronização entre os integrantes do grupo.

## Como executar

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` no navegador.
3. No menu, escolha **Análise combinatória**.

O menu e a calculadora de análise combinatória não precisam de instalação de dependências.

## Funcionalidades disponíveis no menu

- Fatorial.
- Permutação simples, com repetição e circular.
- Arranjo simples e com repetição.
- Combinação simples e com repetição.
- Exibição da fórmula, substituição dos valores e resultado.
- Validação de entradas e mensagens de erro.

Os cálculos de análise combinatória usam `BigInt` para representar resultados inteiros grandes com precisão. As entradas são limitadas a 1000, conforme as regras de cada operação.

## Organização dos arquivos

- `index.html`: menu principal.
- `combinatoria.html`: formulário e resultados de análise combinatória.
- `js/script.js`: cálculos, validação e atualização dos campos do formulário.
- `css/style.css`: estilos compartilhados pelo menu e pela análise combinatória.
- `assets/`: imagens usadas na interface.

## Estilo visual

A interface segue uma estética grunge inspirada no protótipo: foto de fundo escurecida, tons de verde-oliva e marrom, painel com aparência de papel envelhecido e fonte de máquina de escrever. O CSS contém comentários explicando as principais partes da estilização.

## Registro de desenvolvimento — 15/11/2026

Nesta etapa, foram preparados o menu inicial e a página de análise combinatória, com navegação entre as duas telas. A interface recebeu uma estilização inspirada no protótipo, usando a imagem da pasta `assets` como fundo.

### Roteiro de verificação manual

- Abrir o `index.html` e acessar a análise combinatória pelo menu.
- Calcular `C(10, 3)` e conferir se o resultado é `120`.
- Escolher fatorial, informar `5` e conferir se o resultado é `120`.
- Em combinação simples, informar `k` maior que `n` e conferir a mensagem de erro.
- Usar o link de voltar e conferir o retorno ao menu.

Este roteiro documenta verificações a realizar; não representa um registro de testes já executados.
