// Recursos matemáticos compartilhados. Não usa eval nem executa o texto digitado.
const Matematica = (() => {
  function erro(texto, tipo = 'sintaxe') {
    const falha = new Error(texto);
    falha.tipo = tipo;
    return falha;
  }

  function finito(valor) {
    if (!Number.isFinite(valor)) throw erro('O cálculo ultrapassou o limite numérico. Use valores menores.', 'limite');
    return valor;
  }

  // Um produto muito pequeno pode virar zero em Number (underflow).
  // Nesse caso, recusa a análise em vez de apresentar uma raiz incorreta.
  function produtoFinito(a, b) {
    const valor = finito(a * b);
    if (a !== 0 && b !== 0 && Math.abs(valor) < 2.2250738585072014e-308) {
      throw erro('Os coeficientes são pequenos demais para este cálculo. Multiplique todos por um mesmo fator e tente novamente.', 'limite');
    }
    return valor;
  }

  // Preserva números pequenos e evita textos enormes nos resultados.
  function formatar(valor) {
    finito(valor);
    if (valor === 0) return '0'; // Também normaliza o zero negativo.
    const tamanho = Math.abs(valor);
    if (tamanho < 0.0001 || tamanho >= 1e9) {
      const [base, expoente] = valor.toExponential(6).split('e');
      return Number(base).toLocaleString('pt-BR', { maximumSignificantDigits: 7 }) + 'e' + expoente;
    }
    return valor.toLocaleString('pt-BR', { maximumSignificantDigits: 12 });
  }

  // Primeiro transforma a expressão em uma árvore de operações.
  // A mesma árvore pode ser avaliada para cada x da tabela e do gráfico.
  function compilar(texto, unidade = 'radianos') {
    const expressao = texto.trim().toLowerCase().replace(/,/g, '.')
      .replace(/²/g, '^2').replace(/³/g, '^3').replace(/π/g, 'pi')
      .replace(/√/g, 'sqrt').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    if (!expressao) throw erro('Digite um número ou expressão.');
    if (expressao.length > 300) throw erro('Use uma expressão com até 300 caracteres.');
    let posicao = 0;
    let profundidade = 0;
    const funcoes = ['sqrt', 'raiz', 'abs', 'sin', 'sen', 'cos', 'tan', 'log', 'ln', 'exp'];

    function espacos() {
      while (posicao < expressao.length && /\s/.test(expressao[posicao])) posicao++;
    }

    function consumir(simbolo) {
      espacos();
      if (expressao[posicao] !== simbolo) return false;
      posicao++;
      return true;
    }

    function primario() {
      espacos();
      if (consumir('(')) {
        const no = soma();
        if (!consumir(')')) throw erro('Falta fechar um parêntese.');
        return no;
      }
      const numero = expressao.slice(posicao).match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/);
      if (numero) {
        posicao += numero[0].length;
        return { tipo: 'numero', valor: finito(Number(numero[0])) };
      }
      // Lê somente os nomes permitidos, nunca propriedades ou comandos.
      const nome = expressao.slice(posicao).match(/^[a-z]+/);
      if (!nome) throw erro('Confira os números, funções e operadores da expressão.');
      posicao += nome[0].length;
      if (nome[0] === 'x') return { tipo: 'x' };
      if (nome[0] === 'pi' || nome[0] === 'e') {
        return { tipo: 'numero', valor: nome[0] === 'pi' ? Math.PI : Math.E };
      }
      if (!funcoes.includes(nome[0])) throw erro('Função ou símbolo desconhecido: ' + nome[0] + '.');
      if (!consumir('(')) throw erro('Use parênteses na função, por exemplo sqrt(x).');
      const argumento = soma();
      if (!consumir(')')) throw erro('Falta fechar um parêntese.');
      return { tipo: 'funcao', nome: nome[0], argumento };
    }

    function potencia() {
      const esquerda = primario();
      if (consumir('^')) return { tipo: 'operacao', operador: '^', esquerda, direita: sinal() };
      return esquerda;
    }

    function sinal() {
      profundidade++;
      if (profundidade > 60) throw erro('Há muitos níveis de operações ou parênteses.');
      let no;
      if (consumir('+')) no = sinal();
      else if (consumir('-')) no = { tipo: 'negativo', argumento: sinal() };
      else no = potencia();
      profundidade--;
      return no;
    }

    function produto() {
      let no = sinal();
      while (true) {
        let operador;
        if (consumir('*')) operador = '*';
        else if (consumir('/')) operador = '/';
        // Aceita 2x, 2(x + 1) e (x + 1)(x - 1).
        else if (expressao[posicao] === '(' || /[a-z]/.test(expressao[posicao] || '')) operador = '*';
        else return no;
        no = { tipo: 'operacao', operador, esquerda: no, direita: sinal() };
      }
    }

    function soma() {
      let no = produto();
      while (true) {
        let operador;
        if (consumir('+')) operador = '+';
        else if (consumir('-')) operador = '-';
        else return no;
        no = { tipo: 'operacao', operador, esquerda: no, direita: produto() };
      }
    }

    const arvore = soma();
    espacos();
    if (posicao !== expressao.length) throw erro('Expressão inválida. Confira os operadores e parênteses.');

    function calcularNo(no, x) {
      if (no.tipo === 'numero') return no.valor;
      if (no.tipo === 'x') {
        if (!Number.isFinite(x)) throw erro('Informe um valor válido para x.');
        return x;
      }
      if (no.tipo === 'negativo') return -calcularNo(no.argumento, x);
      if (no.tipo === 'funcao') {
        const valor = calcularNo(no.argumento, x);
        const angulo = unidade === 'graus' ? valor * Math.PI / 180 : valor;
        let resultado;
        switch (no.nome) {
          case 'sqrt':
          case 'raiz':
            if (valor < 0) throw erro('Raiz de número negativo: ponto fora do domínio real.', 'dominio');
            resultado = Math.sqrt(valor); break;
          case 'log':
          case 'ln':
            if (valor <= 0) throw erro('Logaritmo exige argumento positivo: ponto fora do domínio.', 'dominio');
            resultado = no.nome === 'log' ? Math.log10(valor) : Math.log(valor); break;
          case 'abs': resultado = Math.abs(valor); break;
          case 'sen':
          case 'sin': resultado = Math.sin(angulo); break;
          case 'cos': resultado = Math.cos(angulo); break;
          case 'tan':
            if (Math.abs(Math.cos(angulo)) < 1e-12) throw erro('Tangente indefinida nesse ponto.', 'dominio');
            resultado = Math.tan(angulo); break;
          case 'exp': resultado = Math.exp(valor); break;
        }
        return finito(resultado);
      }
      const a = calcularNo(no.esquerda, x);
      const b = calcularNo(no.direita, x);
      let resultado;
      if (no.operador === '+') resultado = a + b;
      if (no.operador === '-') resultado = a - b;
      if (no.operador === '*') resultado = a * b;
      if (no.operador === '/') {
        if (b === 0) throw erro('Divisão por zero: ponto fora do domínio.', 'dominio');
        resultado = a / b;
      }
      if (no.operador === '^') {
        resultado = Math.pow(a, b);
        if (Number.isNaN(resultado)) throw erro('A potência não tem resultado real nesse ponto.', 'dominio');
      }
      return finito(resultado);
    }
    return { calcular: x => calcularNo(arvore, x) };
  }

  return { compilar, avaliar: (texto, x, unidade) => compilar(texto, unidade).calcular(x), formatar, finito, produtoFinito, erro };
})();
