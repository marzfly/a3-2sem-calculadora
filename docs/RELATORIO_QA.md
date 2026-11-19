# Relatório de QA — Calculadora Euler

**Avaliação mais recente:** 19/11/2026. Revisão dos arquivos locais após a integração do módulo de raízes do segundo grau.

## Parecer

Os cinco módulos passaram nos cenários executados após as correções desta rodada. Não foram observadas exceções JavaScript não tratadas na execução final. Isso não comprova ausência de qualquer outro defeito nem substitui a validação em outros navegadores e aparelhos.

A revisão incluiu código, cálculos, validações, navegação, nomes dos campos, foco por teclado, responsividade, dependência externa do gráfico e comportamento dos fundos. O diferencial foi avaliado tecnicamente como calculadora de raízes reais com resolução passo a passo. A aceitação pedagógica desse recurso como diferencial precisa ser confirmada com o professor, pois Funções já possui análise de equações quadráticas.

## Resultado desta rodada

| Conjunto | Passaram | Falharam |
| --- | ---: | ---: |
| Menu: estrutura, recursos e telas | 9 | 0 |
| Calculadora científica e fundos | 60 | 0 |
| Análise combinatória | 34 | 0 |
| Funções, domínio, intervalos e gráfico | 45 | 0 |
| Matrizes | 32 | 0 |
| Diferencial: raízes e interface | 29 | 0 |
| Diferencial aberto diretamente pelo arquivo HTML | 1 | 0 |
| **Subtotal no navegador** | **210** | **0** |
| Testes matemáticos automatizados | 75 | 0 |
| **Total de verificações** | **285** | **0** |

As contagens representam casos executados, não percentual de cobertura. Um dos 75 testes matemáticos verifica 99 equações construídas a partir de fatores conhecidos; essas equações não foram somadas como 99 testes separados. Os oito arquivos JavaScript da aplicação também passaram na verificação de sintaxe.

## Defeitos encontrados e corrigidos em 19/11

| Problema | Como reproduzir antes da correção | Correção e resultado do reteste |
| --- | --- | --- |
| Digitação física após igual anexava o número | Calcular `2+3=`, colocar o cursor ao final do visor e digitar `2` pelo teclado: aparecia `52` | Tratamento do evento de entrada antes de inserir o caractere. Agora aparece `2`; operadores continuam permitindo usar o resultado anterior |
| Resposta antiga em combinatória | Calcular `5!` e alterar n para 6: a resposta 120 continuava visível | O resultado é ocultado ao editar os dados e volta somente após novo cálculo |
| Resposta antiga em matrizes | Calcular a transposta e alterar um elemento: a tabela anterior continuava visível | A resposta e a mensagem anterior são limpas ao editar os dados |
| Coeficientes muito pequenos geravam raiz dupla incorreta | Informar `a=1e-200`, `b=0`, `c=-1e-200`: o produto usado no delta virava zero e o módulo dizia que a raiz era zero | Produtos abaixo da faixa numérica confiável são recusados com aviso para reescalar todos os coeficientes. A proteção vale também para o segundo grau em Funções |
| Intervalo grande válido falhava na geração do gráfico | Expressão `x`, avaliação em 1, intervalo de 0 a `1e308`, passo `1e306`: a multiplicação intermediária para gerar pontos estourava | A fração é calculada antes da multiplicação. A avaliação retorna 1 e os 101 pontos ficam finitos no cenário testado |

Os problemas confirmados foram corrigidos e suas reproduções passaram na execução final. Uma divergência inicial na verificação de foco era do próprio teste: foco programático não ativa necessariamente `:focus-visible`. O roteiro foi ajustado para enviar a tecla Tab real e o indicador de foco passou nas cinco páginas de módulos, sem mudar o CSS para mascarar o resultado.

## O que foi verificado

### Estrutura e integração

- Os seis HTMLs carregam os recursos locais referenciados, inclusive imagens e scripts compartilhados.
- Não foram encontrados IDs duplicados ou scripts duplicados nas páginas avaliadas.
- Os campos avaliados possuem rótulo por `label` ou nome acessível equivalente.
- Os cinco links de retorno navegam para o menu.
- As páginas couberam nas larguras de 1440, 768, 390 e 320 pixels, com os dados usados nos testes.
- A matriz de 8 × 8 mantém rolagem dentro de sua área em tela de 320 pixels.
- Foram inspecionadas capturas da interface do diferencial em telas de 1440 e 320 pixels.

### Calculadora científica

- Precedência, parênteses, decimais, potências encadeadas e expoentes negativos.
- Seno, cosseno e tangente em graus ou radianos; raiz, logaritmos, inverso, fatorial, porcentagem e troca de sinal.
- Divisão por zero, expressão incompleta, função desconhecida e entradas que não devem ser executadas como JavaScript.
- Fatorial zero e limites inválidos, como negativos, decimais e valores maiores que 170.
- Uso dos botões, Enter, Escape e digitação física após o igual.
- Continuação da conta com operador e início de uma nova conta com número ou constante.

### Combinatória

- Fatorial, permutações simples, com repetição e circular, arranjos simples e com repetição e combinações simples e com repetição.
- Casos conhecidos, como `C(10,3)=120`, `P(5)=120` e `A(5,3)=60`.
- Campos vazios, negativos, valores fracionários, limites acima de 1000 e incompatibilidade entre n e k quando aplicável.
- Cálculo de `1000!` e conferência de seus 2568 dígitos. A contagem não é uma comparação independente de todos os dígitos.
- Ocultação da resposta ao editar os dados.

### Funções

- Primeiro e segundo grau, raiz dupla decimal e inexistência de raízes reais.
- Rejeição de a igual a zero, campos vazios e resultados intermediários fora do limite numérico.
- Expressões com x, multiplicação implícita, raiz, recíproco, logaritmos e trigonometria.
- Avisos de domínio para `sqrt(x)` em x negativo, `1/x` em zero e logaritmo sem argumento positivo.
- Passos decimais, 201 linhas, intervalos invertidos, passo zero ou negativo e passo não representável na escala escolhida.
- Formatação de números pequenos, escala do gráfico, reinício dos valores e invalidação de respostas antigas.
- Bloqueio proposital do CDN do Chart.js: os cálculos e a tabela continuam disponíveis, com aviso de gráfico indisponível. Esse bloqueio esperado foi o único erro de carregamento registrado na rodada final.

### Matrizes

- Soma, subtração, escalar, multiplicação retangular e transposta.
- Determinantes conhecidos de 1 × 1, 2 × 2, 3 × 3 e identidade 8 × 8.
- Dimensões incompatíveis, zero, acima de oito, não inteiras e vazias.
- Preservação da exibição de `1e-7`, normalização de zero negativo e recusa de estouro numérico.
- Limpeza da resposta ao editar elementos e rolagem interna em tela pequena.

### Diferencial: raízes do segundo grau

- Duas raízes reais, raiz dupla, delta negativo, coeficiente a negativo, termo independente zero e b e c iguais a zero.
- Raiz dupla com os decimais `0.1`, `0.6` e `0.9`.
- Rejeição de a igual a zero, campos vazios e valores fora da faixa de precisão do cálculo.
- Preservação de raízes pequenas, como `1e-10`, quando representáveis.
- Equação apresentada, substituição no delta, fórmula de Bhaskara, classificação e raízes em ordem crescente.
- Cálculo por Enter e ocultação da resolução antiga quando os coeficientes mudam.
- Funcionamento ao abrir `diferencial.html` diretamente pelo sistema de arquivos.

### Fundos

- Foto e prazo da próxima troca mantidos durante a navegação entre módulos na mesma aba.
- Troca observada após 10 segundos e conclusão do fade de 1,6 segundo.
- Com preferência do sistema por movimento reduzido, a transição fica sem animação.
- Bloqueio do armazenamento da sessão não impede calcular raízes; nesse caso, a persistência da foto entre páginas não é garantida.

## Como repetir sem arquivos extras

Os dois arquivos de teste matemático foram mantidos na pasta `tests`. Com Node.js instalado, execute na pasta raiz do projeto:

```powershell
node --test tests/matematica.test.cjs tests/raizes.test.cjs
```

Resultado esperado nesta versão: **75 testes aprovados, zero falhas**. Não é necessário instalar pacotes npm.

Para verificar a interface manualmente:

| Área | Passos | Resultado esperado |
| --- | --- | --- |
| Científica | Calcular `2+3`, pressionar igual e digitar `2` | Começa outra conta com 2 |
| Científica | Calcular `1/0` | Mensagem de erro |
| Combinatória | Calcular `5!`, depois alterar n | A resposta anterior fica oculta |
| Matrizes | Calcular uma operação e editar um elemento | A resposta anterior é limpa |
| Funções | Expressão `x^2-4`, x=3, intervalo -2 até 2, passo 1 | Valor 5; tabela 0, -3, -4, -3, 0 |
| Funções | Expressão `1/x`, x=0 | Aviso de domínio; tabela com pontos válidos e gráfico com lacuna em zero |
| Diferencial | a=1, b=-3, c=2 | Delta 1, raízes 1 e 2 |
| Diferencial | a=0.1, b=0.6, c=0.9 | Raiz dupla -3 |
| Diferencial | a=1, b=0, c=1 | Não existem raízes reais |
| Diferencial | a=0 | Mensagem de validação |
| Diferencial | a=1e-200, b=0, c=-1e-200 | Aviso de limite de precisão, sem raiz falsa |
| Fundo | Navegar antes de completar 10 segundos | Mantém a foto e o prazo; depois ocorre o fade |
| Teclado | Navegar com Tab e calcular usando Enter | Foco visível e operação executada |

Os roteiros temporários de navegador, capturas e perfil de teste foram removidos após a avaliação. Os números das execuções de navegador ficam registrados neste relatório; a automação integral não permanece no repositório. Mantêm-se a suíte matemática reproduzível e o roteiro manual acima.

## Histórico e pendências

Na avaliação de 15/11, haviam sido corrigidos nove defeitos relacionados a precisão do delta, valores infinitos, formatação de números pequenos, respostas antigas, indisponibilidade do gráfico, escala e apresentação. A rodada atual repetiu cenários dessas correções e incluiu o diferencial e os fundos.

Não foi feito commit nem envio ao GitHub nesta atividade. A documentação e as correções estão nos arquivos locais.

A verificação técnica não confirma requisitos externos ao código: aceite do diferencial pelo professor, publicação da versão final, contribuições individuais no Git, relatório técnico acadêmico e apresentação ainda precisam ser conferidos pelo grupo.

## Limites

Foi usado Microsoft Edge headless no Windows, com servidor HTTP local e uma verificação de uso direto do HTML. Não houve teste em Safari, Firefox, aparelhos físicos ou leitor de tela. A acessibilidade foi revista parcialmente; não há certificação de conformidade.

O gráfico é amostrado em 101 pontos. Singularidades entre os pontos podem não ser detectadas. O tipo `Number` continua sujeito à precisão de ponto flutuante; em raízes, casos abaixo da faixa confiável são recusados com aviso em vez de fornecer uma classificação enganosa. A combinatória usa `BigInt` para os inteiros grandes.

Os testes de segurança se limitaram à revisão do leitor de expressões e à rejeição de entradas inválidas, sem auditoria especializada. A responsividade foi verificada nas dimensões e conteúdos descritos, sem promessa de cobrir toda combinação possível de dados e dispositivo.
