const degree = document.getElementById('degree');
// Implementação original do módulo de funções: Arthur Cantarutti Caldeira (@kkkantarutty).
// O módulo recebeu integração, correções e ampliação para expressões posteriormente.
const inputA = document.getElementById('a');
const inputB = document.getElementById('b');
const inputC = document.getElementById('c');
const inputX = document.getElementById('x');
const cField = document.getElementById('c-field');
const formula = document.getElementById('formula');
const message = document.getElementById('message');
const functionTitle = document.getElementById('function-title');
const fxLabel = document.getElementById('fx-label');
const fxResult = document.getElementById('fx-result');
const analysis = document.getElementById('analysis');
const valueTable = document.getElementById('value-table');
const results = document.getElementById('results');
const graphMessage = document.getElementById('graph-message');
let chart;

const format = valor => Matematica.formatar(valor);

function signedTerm(valor, variavel = '') {
  return (valor < 0 ? ' - ' : ' + ') + format(Math.abs(valor)) + variavel;
}

function getFunctionLabel(a, b, c, isQuadratic) {
  if (isQuadratic) return `f(x) = ${format(a)}x²${signedTerm(b, 'x')}${signedTerm(c)}`;
  return `f(x) = ${format(a)}x${signedTerm(b)}`;
}

// Um resultado anterior deixa de valer quando os dados mudam.
function clearResults() {
  results.hidden = true;
  functionTitle.textContent = '';
  fxLabel.textContent = '';
  fxResult.textContent = '';
  analysis.replaceChildren();
  valueTable.replaceChildren();
  graphMessage.textContent = '';
  if (chart) chart.destroy();
  chart = undefined;
}

function updateFields() {
  const livre = degree.value === 'expressao';
  document.getElementById('campo-expressao').hidden = !livre;
  document.getElementById('campos-coeficientes').hidden = livre;
  cField.hidden = degree.value !== '2';
  formula.textContent = livre ? 'f(x) = expressão digitada' : degree.value === '2' ? 'f(x) = ax² + bx + c' : 'f(x) = ax + b';
  clearResults();
}

function readNumber(id) {
  const campo = document.getElementById(id);
  if (campo.value.trim() === '' || !Number.isFinite(Number(campo.value))) {
    throw new Error('Preencha todos os campos necessários com números válidos.');
  }
  return Number(campo.value);
}

function readInterval() {
  const start = readNumber('inicio');
  const end = readNumber('fim');
  const step = readNumber('passo');
  if (end <= start) throw new Error('O fim do intervalo deve ser maior que o início.');
  if (step <= 0) throw new Error('O passo deve ser positivo.');
  const span = Matematica.finito(end - start);
  if (start + step === start) throw new Error('O passo é pequeno demais para os valores do intervalo.');
  const quantidade = span / step;
  if (!Number.isFinite(quantidade) || quantidade > 200 + 1e-10) {
    throw new Error('A tabela aceita até 201 linhas. Aumente o passo ou reduza o intervalo.');
  }
  return { start, end, step, count: Math.floor(quantidade + 1e-10) + 1 };
}

function addAnalysis(label, value) {
  const item = document.createElement('div');
  const name = document.createElement('span');
  const result = document.createElement('strong');
  item.className = 'analysis-item';
  name.textContent = label;
  result.textContent = value;
  item.append(name, result);
  analysis.append(item);
}

// Valida também os valores calculados, não apenas as entradas.
function polynomialAnalysis(a, b, c, isQuadratic) {
  if (!isQuadratic) {
    const root = Matematica.finito(-b / a);
    return [
      ['Raiz', 'x = ' + format(root)],
      ['Classificação', a > 0 ? 'Crescente' : 'Decrescente'],
      ['Coeficiente angular', format(a)],
      ['Intercepto em y', format(b)]
    ];
  }
  const bQuadrado = Matematica.finito(b * b);
  const quatroAC = Matematica.finito(4 * (a * c));
  let delta = Matematica.finito(bQuadrado - quatroAC);
  // Corrige somente o erro de arredondamento relativo à escala da conta.
  // Não transforma deltas pequenos legítimos em zero por uma regra fixa.
  const tolerancia = 8 * Number.EPSILON * Math.max(Math.abs(bQuadrado), Math.abs(quatroAC));
  if (Math.abs(delta) <= tolerancia) delta = 0;
  const vertexX = Matematica.finito(-b / a / 2);
  const vertexY = Matematica.finito(-delta / a / 4);
  const itens = [['Delta (Δ)', format(delta)]];
  if (delta > 0) {
    // Esta forma evita a perda de precisão ao subtrair números próximos.
    const q = -0.5 * (b + (b >= 0 ? 1 : -1) * Math.sqrt(delta));
    const roots = [Matematica.finito(q / a), Matematica.finito(c / q)].sort((x, y) => x - y);
    itens.push(['Raiz x₁', format(roots[0])], ['Raiz x₂', format(roots[1])], ['Raízes reais', 'Duas raízes distintas']);
  } else if (delta === 0) {
    itens.push(['Raiz', format(vertexX)], ['Raízes reais', 'Uma raiz real dupla']);
  } else {
    itens.push(['Raízes reais', 'Não existem raízes reais']);
  }
  itens.push(
    ['Vértice (xᵥ, yᵥ)', `(${format(vertexX)}, ${format(vertexY)})`],
    ['Concavidade', a > 0 ? 'Para cima' : 'Para baixo'],
    ['Valor extremo', a > 0 ? 'Mínimo' : 'Máximo']
  );
  return itens;
}

function evaluate(a, b, c, x, isQuadratic) {
  return Matematica.finito(isQuadratic ? (a * x + b) * x + c : a * x + b);
}

// Um ponto pode estar fora do domínio sem invalidar os outros pontos da tabela.
function sample(calcular, x) {
  try {
    return { value: Matematica.finito(calcular(x)), error: '' };
  } catch (erro) {
    if (erro.tipo !== 'dominio' && erro.tipo !== 'limite') throw erro;
    return { value: null, error: erro.message, type: erro.tipo };
  }
}

function renderTable(calcular, intervalo) {
  for (let i = 0; i < intervalo.count; i++) {
    const x = intervalo.start + intervalo.step * i;
    const ponto = sample(calcular, x);
    const row = document.createElement('tr');
    const xCell = document.createElement('td');
    const yCell = document.createElement('td');
    xCell.textContent = format(x);
    yCell.textContent = ponto.error ? (ponto.type === 'dominio' ? 'Fora do domínio' : 'Limite numérico') : format(ponto.value);
    if (ponto.error) yCell.title = ponto.error;
    row.append(xCell, yCell);
    valueTable.append(row);
  }
}

function renderChart(calcular, intervalo) {
  const area = document.querySelector('.chart-wrap');
  area.hidden = true;
  if (typeof Chart !== 'function') {
    graphMessage.textContent = 'Gráfico indisponível: a biblioteca Chart.js não carregou. Confira a internet. O cálculo e a tabela continuam disponíveis.';
    return;
  }
  const points = [];
  for (let i = 0; i <= 100; i++) {
    const x = i === 100 ? intervalo.end : intervalo.start + (intervalo.end - intervalo.start) * i / 100;
    const ponto = sample(calcular, x);
    // null deixa uma lacuna; a linha não atravessa o ponto indefinido.
    points.push({ x, y: ponto.value });
  }
  if (new Set(points.map(p => p.x)).size < 2) {
    graphMessage.textContent = 'Gráfico indisponível nessa escala. Escolha um intervalo maior.';
    return;
  }
  if (!points.some(p => p.y !== null)) {
    graphMessage.textContent = 'Não há pontos reais representáveis no intervalo escolhido.';
    return;
  }
  if (points.some(p => p.y === null)) {
    graphMessage.textContent = 'Pontos fora do domínio ou do limite numérico não são desenhados. A curva é uma amostra do intervalo.';
  }
  area.hidden = false;
  try {
    chart = new Chart(document.getElementById('function-chart'), {
      type: 'scatter',
      data: { datasets: [{ label: 'f(x)', data: points, showLine: true, spanGaps: false,
        borderColor: '#596338', backgroundColor: '#596338', borderWidth: 2, pointRadius: 0, tension: 0 }] },
      options: {
        responsive: true, maintainAspectRatio: false, parsing: false,
        plugins: { legend: { labels: { color: '#303522' } } },
        scales: {
          x: { type: 'linear', title: { display: true, text: 'x', color: '#303522' }, ticks: { color: '#303522' }, grid: { color: 'rgba(48,53,34,.15)' } },
          y: { title: { display: true, text: 'f(x)', color: '#303522' }, ticks: { color: '#303522' }, grid: { color: 'rgba(48,53,34,.15)' } }
        }
      }
    });
  } catch (erro) {
    area.hidden = true;
    graphMessage.textContent = 'Não foi possível desenhar o gráfico. O cálculo e a tabela continuam disponíveis.';
  }
}

function calculate() {
  clearResults();
  message.textContent = '';
  try {
    const x = readNumber('x');
    const intervalo = readInterval();
    let calcular;
    let titulo;
    let itens;
    if (degree.value === 'expressao') {
      const texto = document.getElementById('expressao').value;
      calcular = Matematica.compilar(texto).calcular;
      titulo = 'f(x) = ' + texto;
      itens = [['Domínio', 'Verificado em cada ponto avaliado. A tabela identifica os pontos inválidos; não é uma análise simbólica completa.']];
    } else {
      const a = readNumber('a');
      const b = readNumber('b');
      const isQuadratic = degree.value === '2';
      const c = isQuadratic ? readNumber('c') : 0;
      if (a === 0) throw new Error('O coeficiente a precisa ser diferente de zero.');
      itens = polynomialAnalysis(a, b, c, isQuadratic);
      calcular = valor => evaluate(a, b, c, valor, isQuadratic);
      titulo = getFunctionLabel(a, b, c, isQuadratic);
    }
    const ponto = sample(calcular, x);
    if (ponto.type === 'limite') throw new Error(ponto.error);
    functionTitle.textContent = titulo;
    fxLabel.textContent = 'f(' + format(x) + ')';
    fxResult.textContent = ponto.error ? 'Fora do domínio' : format(ponto.value);
    if (ponto.error) message.textContent = ponto.error;
    for (const [label, valor] of itens) addAnalysis(label, valor);
    renderTable(calcular, intervalo);
    results.hidden = false;
    renderChart(calcular, intervalo);
  } catch (erro) {
    clearResults();
    message.textContent = erro.message;
  }
}

degree.addEventListener('change', () => {
  updateFields();
  calculate();
});

// Digitar novos dados invalida a resposta antiga até o próximo cálculo.
for (const id of ['a', 'b', 'c', 'x', 'expressao', 'inicio', 'fim', 'passo']) {
  document.getElementById(id).addEventListener('input', () => {
    clearResults();
    message.textContent = '';
  });
  document.getElementById(id).addEventListener('keydown', evento => {
    if (evento.key === 'Enter') { evento.preventDefault(); calculate(); }
  });
}
document.getElementById('calculate').addEventListener('click', calculate);
document.getElementById('reset').addEventListener('click', () => {
  degree.value = '1';
  inputA.value = '2'; inputB.value = '-4'; inputC.value = '2'; inputX.value = '3';
  document.getElementById('expressao').value = 'x^2 - 4';
  document.getElementById('inicio').value = '-2';
  document.getElementById('fim').value = '2';
  document.getElementById('passo').value = '1';
  updateFields();
  calculate();
});
updateFields();
calculate();
