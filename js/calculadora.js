const visor = document.getElementById('visor');
const mensagem = document.getElementById('mensagem-calculadora');
let resultadoConcluido = false;

// O leitor de expressões fica em matematica.js e é compartilhado com Funções.
function avaliarExpressao(texto) {
  return Matematica.avaliar(texto, undefined, document.getElementById('angulo').value);
}
function addnumero(numero) {
  mensagem.textContent = '';
  if (resultadoConcluido) visor.value = '';
  resultadoConcluido = false;
  // Inclui a multiplicação em expressões como 2(3 + 4).
  if (numero === '(' && /[\d.)]$/.test(visor.value.trim())) visor.value += '*';
  visor.value += numero;
}

function addoperador(operador) {
  mensagem.textContent = '';
  resultadoConcluido = false;
  const texto = visor.value.trim();
  // Permite um número negativo após uma multiplicação, divisão ou potência.
  if (operador === '-' && (texto === '' || /[*/^(]$/.test(texto))) {
    visor.value = texto + '-';
  } else {
    visor.value = texto.replace(/[+\-*/^]+$/, '') + operador;
  }
}

function inserirConstante(valor) {
  if (resultadoConcluido) visor.value = '';
  if (/[\d.)]$/.test(visor.value.trim())) visor.value += '*';
  addnumero(valor);
}

function limpar() {
  resultadoConcluido = false;
  visor.value = '';
  mensagem.textContent = '';
}

function apagar() {
  resultadoConcluido = false;
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
    resultadoConcluido = true;
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
visor.addEventListener('input', () => {
  resultadoConcluido = false;
  mensagem.textContent = '';
});
