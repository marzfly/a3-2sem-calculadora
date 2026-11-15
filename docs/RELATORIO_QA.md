# Relatório de QA — Calculadora Euler

**Data da avaliação:** 15/11/2026.

O projeto foi revisado e testado nos módulos de calculadora científica, funções, matrizes e análise combinatória. O módulo diferencial está sendo desenvolvido separadamente pelo grupo e não teve seus cálculos avaliados nesta etapa.

## Resultado geral

Na avaliação inicial, foram identificados nove defeitos e uma observação de usabilidade. Os problemas foram corrigidos e os cenários foram executados novamente.

| Verificação após as correções | Passaram | Falharam |
| --- | ---: | ---: |
| Regressão principal no navegador | 147 | 0 |
| Reprodução dos problemas iniciais | 19 | 0 |
| Novos testes de expressões, domínio e intervalos | 38 | 0 |
| Testes matemáticos automatizados | 57 | 0 |
| **Total** | **261** | **0** |

Esses números representam as execuções realizadas nesta avaliação, não uma garantia de ausência de qualquer outro defeito. As verificações de navegador incluem cenários repetidos para confirmar correções. Os testes matemáticos permanecem no repositório para execução pelo grupo; arquivos temporários, capturas e roteiros de automação do navegador foram removidos na organização do projeto.

## Correções realizadas

| Problema encontrado | Solução | Situação no reteste |
| --- | --- | --- |
| Coeficientes `a=0.1`, `b=0.6`, `c=0.9` eram classificados como sem raízes reais | Tratamento do erro de precisão no delta | Raiz dupla em `-3` reconhecida |
| Funções exibia infinito ou `NaN` como resultado válido | Validação dos resultados e cálculos intermediários | Limites numéricos informados por mensagem |
| Coeficientes pequenos apareciam como zero | Notação científica e formatação por algarismos significativos | Valores pequenos preservados na apresentação |
| Matrizes não nulas apareciam como matrizes zero | Uso da mesma formatação numérica | Elemento `1e-7` continua não nulo na exibição |
| Erros de entrada deixavam respostas antigas na tela | Limpeza dos resultados ao alterar os dados ou falhar na validação | Respostas anteriores deixam de ser apresentadas como atuais |
| Falha do Chart.js deixava o gráfico vazio sem aviso | Mensagem de indisponibilidade e separação entre gráfico e cálculo | Cálculo e tabela funcionam sem o gráfico |
| Intervalo do gráfico podia se reduzir a um único ponto | Intervalo configurável e validação da escala | Pontos distintos no cenário reproduzido |
| Resultados longos alargavam a página no celular | Formatação compacta, quebra de texto e rolagem interna | Conteúdo contido no cenário testado em 320 pixels |
| Matrizes exibiam zero negativo | Normalização da apresentação de zero | Exibe `0`, preservando valores não nulos |
| Digitar após `=` juntava o novo número ao resultado | Controle do estado de cálculo concluído | Novo número ou constante inicia outra expressão; operador continua a conta |

## Recursos de Funções acrescentados

- Modo de entrada de expressões, além das opções de primeiro e segundo grau por coeficientes.
- Expressões como `2x² + 3x - 1`, `sqrt(x)`, `1/x` e `log(x)`.
- Início, fim e passo da tabela configuráveis, com até 201 linhas.
- Identificação de pontos fora do domínio real, como raiz de negativo e divisão por zero.
- Gráfico com lacunas nos pontos amostrados inválidos.
- Leitura de expressões sem executar o texto digitado como código JavaScript.

## Exemplos para demonstração manual

| Módulo | Entrada ou ação | Resultado esperado |
| --- | --- | --- |
| Científica | `2+3*4`, depois `=` | `14` |
| Científica | `30`, DEG e `sen` | Aproximadamente `0,5` |
| Científica | `2+3=`, depois digitar `2` | Nova expressão com `2` |
| Científica | `1/0`, depois `=` | Mensagem de erro |
| Funções | Expressão `x^2-4`, x=`3` | `5` |
| Funções | Mesma expressão, intervalo de `-2` a `2`, passo `1` | Tabela: `0, -3, -4, -3, 0` |
| Funções | Segundo grau: `a=0.1`, `b=0.6`, `c=0.9` | Raiz dupla em `-3` |
| Funções | `sqrt(x)` em x=`-1` ou `1/x` em x=`0` | Aviso de ponto fora do domínio |
| Funções | Passo zero, negativo ou mais de 201 linhas | Mensagem de validação |
| Matrizes | Determinante de A com linhas `[1,2]` e `[3,4]` | `-2` |
| Matrizes | A=`[[1e-7]]`, escalar=`1` | Resultado não nulo, em notação científica |
| Matrizes | Soma com dimensões diferentes | Mensagem de incompatibilidade |
| Combinatória | `C(10,3)`, `P(5)` e `A(5,3)` | `120`, `120` e `60` |
| Combinatória | Combinação simples com k maior que n | Mensagem de erro |

Também foram verificados caminhos de recursos, IDs únicos, nomes dos campos, links de retorno ao menu e disposição das páginas nas larguras de 1440, 768, 390 e 320 pixels. A matriz de dimensão 8 × 8 manteve rolagem interna em tela pequena.

## Como repetir os testes matemáticos

Com Node.js instalado, abra o terminal na pasta do projeto e execute:

```bash
node --test tests/matematica.test.cjs
```

O arquivo contém 57 testes e não exige instalação de pacotes npm. A saída indica quantos testes passaram ou falharam. Para repetir as verificações de interface sem os antigos roteiros de automação, use os exemplos manuais acima.

## Limites da avaliação

Os testes de interface foram executados no Microsoft Edge, no Windows. Não foram realizados testes em aparelhos físicos, Firefox, Safari ou leitor de tela. A avaliação de acessibilidade foi parcial, sem certificação de conformidade.

O gráfico usa uma amostragem de 101 pontos, sem análise simbólica de todo o domínio ou de todas as descontinuidades. Uma singularidade entre pontos amostrados pode não ser identificada. Os módulos que usam `Number` continuam sujeitos à precisão de ponto flutuante; a combinatória usa `BigInt` para os cálculos inteiros grandes.

O parecer final é que os quatro módulos avaliados passaram nos cenários descritos após as correções. O funcionamento interno do diferencial deve ser validado pelo grupo quando sua integração estiver concluída. Este relatório registra o QA e não substitui o relatório técnico acadêmico exigido pelo professor.
