const degree = document.getElementById("degree");
const inputA = document.getElementById("a");
const inputB = document.getElementById("b");
const inputC = document.getElementById("c");
const inputX = document.getElementById("x");
const cField = document.getElementById("c-field");
const formula = document.getElementById("formula");
const message = document.getElementById("message");
const functionTitle = document.getElementById("function-title");
const fxLabel = document.getElementById("fx-label");
const fxResult = document.getElementById("fx-result");
const analysis = document.getElementById("analysis");
const valueTable = document.getElementById("value-table");
let chart;

const format = value => Number(value.toFixed(4)).toLocaleString("pt-BR", {
  maximumFractionDigits: 4
});

const signedTerm = (value, variable = "") => {
  const sign = value < 0 ? " - " : " + ";
  return sign + format(Math.abs(value)) + variable;
};

function updateFields() {
  const isQuadratic = degree.value === "2";
  cField.hidden = !isQuadratic;
  formula.textContent = isQuadratic ? "f(x) = ax² + bx + c" : "f(x) = ax + b";
}

function getFunctionLabel(a, b, c, isQuadratic) {
  if (isQuadratic) {
    return `f(x) = ${format(a)}x²${signedTerm(b, "x")}${signedTerm(c)}`;
  }
  return `f(x) = ${format(a)}x${signedTerm(b)}`;
}

function addAnalysis(label, value) {
  const item = document.createElement("div");
  const name = document.createElement("span");
  const result = document.createElement("strong");
  item.className = "analysis-item";
  name.textContent = label;
  result.textContent = value;
  item.append(name, result);
  analysis.append(item);
}

function calculate() {
  message.textContent = "";
  const isQuadratic = degree.value === "2";
  const raw = [inputA.value, inputB.value, inputX.value];
  if (isQuadratic) raw.push(inputC.value);

  if (raw.some(value => value.trim() === "")) {
    message.textContent = "Preencha todos os campos necessários.";
    return;
  }

  const a = Number(inputA.value);
  const b = Number(inputB.value);
  const c = isQuadratic ? Number(inputC.value) : 0;
  const x = Number(inputX.value);

  if (![a, b, c, x].every(Number.isFinite)) {
    message.textContent = "Insira somente valores numéricos válidos.";
    return;
  }

  if (a === 0) {
    message.textContent = "O coeficiente a precisa ser diferente de zero.";
    return;
  }

  const fx = isQuadratic ? a * x * x + b * x + c : a * x + b;
  functionTitle.textContent = getFunctionLabel(a, b, c, isQuadratic);
  fxLabel.textContent = `f(${format(x)})`;
  fxResult.textContent = format(fx);
  analysis.replaceChildren();

  if (!isQuadratic) {
    const root = -b / a;
    addAnalysis("Raiz", `x = ${format(root)}`);
    addAnalysis("Classificação", a > 0 ? "Crescente" : "Decrescente");
    addAnalysis("Coeficiente angular", format(a));
    addAnalysis("Intercepto em y", format(b));
  } else {
    const delta = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = -delta / (4 * a);
    addAnalysis("Delta (Δ)", format(delta));

    if (delta > 0) {
      const x1 = (-b + Math.sqrt(delta)) / (2 * a);
      const x2 = (-b - Math.sqrt(delta)) / (2 * a);
      addAnalysis("Raiz x₁", format(x1));
      addAnalysis("Raiz x₂", format(x2));
      addAnalysis("Raízes reais", "Duas raízes distintas");
    } else if (delta === 0) {
      addAnalysis("Raiz", format(-b / (2 * a)));
      addAnalysis("Raízes reais", "Uma raiz real dupla");
    } else {
      addAnalysis("Raízes reais", "Não existem raízes reais");
    }

    addAnalysis("Vértice (xᵥ, yᵥ)", `(${format(vertexX)}, ${format(vertexY)})`);
    addAnalysis("Concavidade", a > 0 ? "Para cima" : "Para baixo");
    addAnalysis("Valor extremo", a > 0 ? "Mínimo" : "Máximo");
  }

  renderTable(a, b, c, isQuadratic, x);
  renderChart(a, b, c, isQuadratic);
}

function evaluate(a, b, c, x, isQuadratic) {
  return isQuadratic ? a * x * x + b * x + c : a * x + b;
}

function renderTable(a, b, c, isQuadratic, center) {
  valueTable.replaceChildren();
  for (let offset = -2; offset <= 2; offset++) {
    const currentX = center + offset;
    const row = document.createElement("tr");
    const xCell = document.createElement("td");
    const yCell = document.createElement("td");
    xCell.textContent = format(currentX);
    yCell.textContent = format(evaluate(a, b, c, currentX, isQuadratic));
    row.append(xCell, yCell);
    valueTable.append(row);
  }
}

function renderChart(a, b, c, isQuadratic) {
  const points = [];
  const center = isQuadratic ? -b / (2 * a) : -b / a;
  const start = Number.isFinite(center) ? center - 10 : -10;
  const end = Number.isFinite(center) ? center + 10 : 10;

  for (let i = 0; i <= 100; i++) {
    const x = start + (end - start) * i / 100;
    points.push({ x, y: evaluate(a, b, c, x, isQuadratic) });
  }

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("function-chart"), {
    type: "scatter",
    data: {
      datasets: [{
        label: "f(x)",
        data: points,
        showLine: true,
        borderColor: "#596338",
        backgroundColor: "#596338",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      parsing: false,
      plugins: {
        legend: { labels: { color: "#303522" } }
      },
      scales: {
        x: {
          type: "linear",
          title: { display: true, text: "x", color: "#303522" },
          ticks: { color: "#303522" },
          grid: { color: "rgba(48,53,34,.15)" }
        },
        y: {
          title: { display: true, text: "f(x)", color: "#303522" },
          ticks: { color: "#303522" },
          grid: { color: "rgba(48,53,34,.15)" }
        }
      }
    }
  });
}

degree.addEventListener("change", () => {
  updateFields();
  calculate();
});

document.getElementById("calculate").addEventListener("click", calculate);

document.getElementById("reset").addEventListener("click", () => {
  degree.value = "1";
  inputA.value = "2";
  inputB.value = "-4";
  inputC.value = "2";
  inputX.value = "3";
  updateFields();
  calculate();
});

updateFields();
calculate();
