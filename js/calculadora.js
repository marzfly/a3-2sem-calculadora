const visor = document.getElementById('visor');
const mensagem = document.getElementById('mensagem-calculadora');

// Lê a expressão em partes, respeitando parênteses e a ordem das operações.
// Assim o texto digitado não é executado como código JavaScript.
function avaliarExpressao(texto) {
  const expressao = texto.trim().replace(/,/g, '.');
  let posicao = 0;
  if (expressao === '') throw new Error('Digite um número ou expressão.');

  function consumir(simbolo) {
    while (/\s/.test(expressao[posicao] || '') && posicao < expressao.length) posicao++;
    if (expressao[posicao] === simbolo) {
      posicao++;
      return true;
    }
    return false;
  }

  function numero() {
    if (consumir('(')) {
      const valor = soma();
      if (!consumir(')')) throw new Error('Falta fechar um parêntese.');
      return valor;
    }
    // Aceita decimais e números grandes como 1e+20.
    const encontrado = expressao.slice(posicao).match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);
    if (!encontrado) throw new Error('Confira os números e operadores da expressão.');
    posicao += encontrado[0].length;
    return Number(encontrado[0]);
  }

  function potencia() {
    const base = numero();
    if (consumir('^')) return Math.pow(base, sinal());
    return base;
  }

  function sinal() {
    if (consumir('+')) return sinal();
    if (consumir('-')) return -sinal();
    return potencia();
  }

  function produto() {
    let valor = sinal();
    while (true) {
      if (consumir('*')) {
        valor *= sinal();
      } else if (consumir('/')) {
        const divisor = sinal();
        if (divisor === 0) throw new Error('Não é possível dividir por zero.');
        valor /= divisor;
      } else {
        return valor;
      }
    }
  }

  function soma() {
    let valor = produto();
    while (true) {
      if (consumir('+')) valor += produto();
      else if (consumir('-')) valor -= produto();
      else return valor;
    }
  }

  const valor = soma();
  if (posicao !== expressao.length) throw new Error('Expressão inválida. Use números e os operadores +, -, *, / e ^.');
  if (!Number.isFinite(valor)) throw new Error('O resultado não é um número real finito.');
  return valor;
}

function addnumero(numero) {
  mensagem.textContent = '';
  // Inclui a multiplicação em expressões como 2(3 + 4).
  if (numero === '(' && /[\d.)]$/.test(visor.value.trim())) visor.value += '*';
  visor.value += numero;
}

function addoperador(operador) {
  mensagem.textContent = '';
  const texto = visor.value.trim();
  // Permite um número negativo após uma multiplicação, divisão ou potência.
  if (operador === '-' && (texto === '' || /[*/^(]$/.test(texto))) {
    visor.value = texto + '-';
  } else {
    visor.value = texto.replace(/[+\-*/^]+$/, '') + operador;
  }
}

function inserirConstante(valor) {
  if (/[\d.)]$/.test(visor.value.trim())) visor.value += '*';
  addnumero(valor);
}

function limpar() {
  visor.value = '';
  mensagem.textContent = '';
}

function apagar() {
  visor.value = visor.value.slice(0, -1);
  mensagem.textContent = '';
}

// Centraliza as mensagens de erro e mantém o visor editável.
function executar(calculo) {
  mensagem.textContent = '';
  try {
    const valor = calculo();
    if (!Number.isFinite(valor)) throw new Error('O resultado ultrapassou o limite numérico ou não é real.');
    visor.value = String(valor);
  } catch (erro) {
    mensagem.textContent = erro.message;
  }
}

function resultado() {
  executar(() => avaliarExpressao(visor.value));
}

// Aplica uma função científica ao resultado da expressão que está no visor.
function calcularFuncao(tipo, valor, unidade) {
  const radianos = unidade === 'graus' ? valor * Math.PI / 180 : valor;
  switch (tipo) {
    case 'sen': return Math.sin(radianos);
    case 'cos': return Math.cos(radianos);
    case 'tan':
      if (Math.abs(Math.cos(radianos)) < 1e-12) throw new Error('A tangente não está definida nesse ângulo.');
      return Math.tan(radianos);
    case 'raiz':
      if (valor < 0) throw new Error('A raiz de um número negativo não é real.');
      return Math.sqrt(valor);
    case 'log':
    case 'ln':
      if (valor <= 0) throw new Error('O logaritmo exige um número positivo.');
      return tipo === 'log' ? Math.log10(valor) : Math.log(valor);
    case 'quadrado': return valor * valor;
    case 'inverso':
      if (valor === 0) throw new Error('Não é possível dividir por zero.');
      return 1 / valor;
    case 'sinal': return -valor;
    case 'porcentagem': return valor / 100;
    case 'fatorial': {
      if (!Number.isInteger(valor) || valor < 0 || valor > 170) {
        throw new Error('Use um inteiro entre 0 e 170 para o fatorial.');
      }
      let total = 1;
      for (let i = 2; i <= valor; i++) total *= i;
      return total;
    }
    default: throw new Error('Função desconhecida.');
  }
}

function aplicarFuncao(tipo) {
  executar(() => calcularFuncao(tipo, avaliarExpressao(visor.value), document.getElementById('angulo').value));
}

visor.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {
    evento.preventDefault();
    resultado();
  }
  if (evento.key === 'Escape') limpar();
});
visor.addEventListener('input', () => { mensagem.textContent = ''; });
