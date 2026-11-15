// Atalho para buscar um elemento pelo id.
function elemento(id) {
  return document.getElementById(id);
}

// Cria uma tabela de campos para digitar os elementos de A ou B.
function criarMatriz(nome) {
  const linhas = Number(elemento('lin' + nome).value);
  const colunas = Number(elemento('col' + nome).value);
  const area = elemento('matriz' + nome);
  area.replaceChildren();
  elemento('resultado').replaceChildren();
  elemento('erroMatrizes').textContent = '';
  if (!Number.isInteger(linhas) || !Number.isInteger(colunas) ||
      linhas < 1 || linhas > 8 || colunas < 1 || colunas > 8) {
    elemento('erroMatrizes').textContent = 'Use dimensões inteiras entre 1 e 8.';
    return;
  }
  const tabela = document.createElement('table');
  for (let i = 0; i < linhas; i++) {
    const linha = tabela.insertRow();
    for (let j = 0; j < colunas; j++) {
      const campo = document.createElement('input');
      campo.type = 'number';
      campo.step = 'any';
      campo.value = '0';
      campo.setAttribute('aria-label', 'Matriz ' + nome + ', linha ' + (i + 1) + ', coluna ' + (j + 1));
      linha.insertCell().append(campo);
    }
  }
  area.append(tabela);
}

// Transforma os campos em um array de linhas: [[1, 2], [3, 4]].
function lerMatriz(nome) {
  const tabela = elemento('matriz' + nome).querySelector('table');
  if (!tabela) throw new Error('Confira as dimensões da matriz ' + nome + '.');
  const matriz = [];
  for (const linha of tabela.rows) {
    const numeros = [];
    for (const campo of linha.querySelectorAll('input')) {
      const numero = Number(campo.value);
      if (campo.value.trim() === '' || !Number.isFinite(numero)) {
        throw new Error('Preencha todos os elementos da matriz ' + nome + '.');
      }
      numeros.push(numero);
    }
    matriz.push(numeros);
  }
  return matriz;
}

// Expansão pela primeira linha: reduz a matriz até chegar a 1 × 1.
function determinante(matriz) {
  if (matriz.length === 1) return matriz[0][0];
  let total = 0;
  for (let coluna = 0; coluna < matriz.length; coluna++) {
    const menor = [];
    for (let i = 1; i < matriz.length; i++) {
      menor.push(matriz[i].filter((valor, j) => j !== coluna));
    }
    const sinal = coluna % 2 === 0 ? 1 : -1;
    total += sinal * matriz[0][coluna] * determinante(menor);
  }
  return total;
}

// Faz as contas; esta função não depende do HTML.
function operarMatrizes(a, b, operacao, escalar) {
  const linhas = a.length;
  const colunas = a[0].length;
  if (operacao === 'determinante') {
    if (linhas !== colunas) throw new Error('O determinante exige uma matriz A quadrada.');
    return determinante(a);
  }
  if (operacao === 'soma' || operacao === 'subtracao') {
    if (linhas !== b.length || colunas !== b[0].length) {
      throw new Error('Para somar ou subtrair, A e B precisam ter as mesmas dimensões.');
    }
  }
  if (operacao === 'multiplicacao' && colunas !== b.length) {
    throw new Error('As colunas de A precisam ser iguais às linhas de B.');
  }
  const resultado = [];
  const totalLinhas = operacao === 'transposta' ? colunas : linhas;
  let totalColunas = colunas;
  if (operacao === 'transposta') totalColunas = linhas;
  if (operacao === 'multiplicacao') totalColunas = b[0].length;
  for (let i = 0; i < totalLinhas; i++) {
    resultado[i] = [];
    for (let j = 0; j < totalColunas; j++) {
      if (operacao === 'soma') resultado[i][j] = a[i][j] + b[i][j];
      if (operacao === 'subtracao') resultado[i][j] = a[i][j] - b[i][j];
      if (operacao === 'escalar') resultado[i][j] = a[i][j] * escalar;
      if (operacao === 'transposta') resultado[i][j] = a[j][i];
      if (operacao === 'multiplicacao') {
        resultado[i][j] = 0;
        for (let k = 0; k < colunas; k++) {
          resultado[i][j] += a[i][k] * b[k][j];
        }
      }
    }
  }
  return resultado;
}

function mostrarResultado(resultado) {
  const area = elemento('resultado');
  const valores = Array.isArray(resultado) ? resultado.flat() : [resultado];
  if (!valores.every(Number.isFinite)) {
    throw new Error('O resultado ultrapassou o limite numérico. Use valores menores.');
  }
  if (!Array.isArray(resultado)) {
    area.textContent = 'Determinante de A: ' + Matematica.formatar(resultado);
    return;
  }
  const tabela = document.createElement('table');
  tabela.setAttribute('aria-label', 'Matriz resultado');
  for (const numeros of resultado) {
    const linha = tabela.insertRow();
    for (const numero of numeros) {
      linha.insertCell().textContent = Matematica.formatar(numero);
    }
  }
  area.append(tabela);
}

function calcularMatrizes() {
  elemento('erroMatrizes').textContent = '';
  elemento('resultado').replaceChildren();
  // Se uma entrada for inválida, o catch mostra a mensagem na página.
  try {
    const operacao = elemento('operacao').value;
    const a = lerMatriz('A');
    let b = null;
    if (['soma', 'subtracao', 'multiplicacao'].includes(operacao)) b = lerMatriz('B');
    const campo = elemento('escalar');
    const escalar = Number(campo.value);
    if (operacao === 'escalar' && (campo.value.trim() === '' || !Number.isFinite(escalar))) {
      throw new Error('Informe um escalar válido.');
    }
    mostrarResultado(operarMatrizes(a, b, operacao, escalar));
  } catch (erro) {
    elemento('erroMatrizes').textContent = erro.message;
  }
}

function atualizarOperacao() {
  const operacao = elemento('operacao').value;
  elemento('campoEscalar').hidden = operacao !== 'escalar';
  elemento('campoMatrizB').hidden = !['soma', 'subtracao', 'multiplicacao'].includes(operacao);
  elemento('resultado').replaceChildren();
  elemento('erroMatrizes').textContent = '';
}

// Os eventos ligam as ações da pessoa às funções acima.
for (const nome of ['A', 'B']) {
  elemento('lin' + nome).addEventListener('change', () => criarMatriz(nome));
  elemento('col' + nome).addEventListener('change', () => criarMatriz(nome));
  criarMatriz(nome);
}
elemento('operacao').addEventListener('change', atualizarOperacao);
elemento('calcular').addEventListener('click', calcularMatrizes);
atualizarOperacao();
