// Calculadora de Análise Combinatória
// Implementação original: Bernardo Rocha Fernando (@bernardo486).
// O módulo recebeu integração e ajustes posteriores no projeto.
// Usa BigInt para resultados exatos, mesmo com números enormes.

const $ = (id) => document.getElementById(id);
const LIMITE = 1000; // máximo para n e k (evita travar o navegador)

// ---------- Funções matemáticas (BigInt) ----------

function fatorial(n) {
  let r = 1n;
  for (let i = 2n; i <= BigInt(n); i++) r *= i;
  return r;
}

// A(n,k) = n · (n-1) · ... · (n-k+1)
function arranjo(n, k) {
  let r = 1n;
  for (let i = 0; i < k; i++) r *= BigInt(n - i);
  return r;
}

// C(n,k) calculado de forma incremental (divisão sempre exata)
function combinacao(n, k) {
  if (k > n) return 0n;
  k = Math.min(k, n - k);
  let r = 1n;
  for (let i = 1; i <= k; i++) {
    r = (r * BigInt(n - k + i)) / BigInt(i);
  }
  return r;
}

// ---------- Tipos de cálculo ----------

const TIPOS = {
  fatorial: {
    usa: { n: true, k: false },
    descricao: 'Produto de todos os inteiros de 1 até n. Por definição, 0! = 1.',
    calcular: ({ n }) => ({
      formula: 'n!',
      substituicao: `${n}!`,
      valor: fatorial(n),
    }),
  },
  permSimples: {
    usa: { n: true, k: false },
    descricao: 'Quantas formas de ordenar n elementos distintos.',
    calcular: ({ n }) => ({
      formula: 'P(n) = n!',
      substituicao: `P(${n}) = ${n}!`,
      valor: fatorial(n),
    }),
  },
  permCircular: {
    usa: { n: true, k: false },
    descricao: 'Formas de dispor n elementos distintos em círculo (rotações contam como a mesma).',
    validar: ({ n }) => (n < 1 ? 'Para permutação circular, n deve ser pelo menos 1.' : null),
    calcular: ({ n }) => ({
      formula: 'PC(n) = (n − 1)!',
      substituicao: `PC(${n}) = (${n} − 1)!`,
      valor: fatorial(n - 1),
    }),
  },
  permRep: {
    usa: { reps: true },
    descricao: 'Anagramas de n elementos em que alguns se repetem.',
    calcular: ({ reps }) => {
      const n = reps.reduce((a, b) => a + b, 0);
      let denom = 1n;
      reps.forEach((r) => (denom *= fatorial(r)));
      return {
        formula: 'P = n! / (n₁! · n₂! · ... · nᵣ!)',
        substituicao: `${n}! / (${reps.map((r) => r + '!').join(' · ')})`,
        valor: fatorial(n) / denom,
      };
    },
  },
  arranjoSimples: {
    usa: { n: true, k: true },
    descricao: 'Escolher k de n elementos distintos, e a ordem importa.',
    validar: ({ n, k }) => (k > n ? 'Em arranjo simples, k não pode ser maior que n.' : null),
    calcular: ({ n, k }) => ({
      formula: 'A(n, k) = n! / (n − k)!',
      substituicao: `${n}! / (${n} − ${k})!`,
      valor: arranjo(n, k),
    }),
  },
  arranjoRep: {
    usa: { n: true, k: true },
    descricao: 'Escolher k elementos de n, a ordem importa e pode repetir elementos.',
    calcular: ({ n, k }) => ({
      formula: 'AR(n, k) = nᵏ',
      substituicao: `${n}^${k}`,
      valor: BigInt(n) ** BigInt(k),
    }),
  },
  combSimples: {
    usa: { n: true, k: true },
    descricao: 'Escolher k de n elementos distintos, e a ordem não importa.',
    validar: ({ n, k }) => (k > n ? 'Em combinação simples, k não pode ser maior que n.' : null),
    calcular: ({ n, k }) => ({
      formula: 'C(n, k) = n! / (k! · (n − k)!)',
      substituicao: `${n}! / (${k}! · (${n} − ${k})!)`,
      valor: combinacao(n, k),
    }),
  },
  combRep: {
    usa: { n: true, k: true },
    descricao: 'Escolher k elementos de n, a ordem não importa e pode repetir elementos.',
    validar: ({ n }) => (n < 1 ? 'Em combinação com repetição, n deve ser pelo menos 1.' : null),
    calcular: ({ n, k }) => ({
      formula: 'CR(n, k) = C(n + k − 1, k)',
      substituicao: `C(${n} + ${k} − 1, ${k}) = C(${n + k - 1}, ${k})`,
      valor: combinacao(n + k - 1, k),
    }),
  },
};

// ---------- Leitura e validação ----------

function inteiroNaoNegativo(texto) {
  const v = Number(texto);
  return texto.trim() !== '' && Number.isInteger(v) && v >= 0 ? v : null;
}

function lerEntradas(tipo) {
  const cfg = TIPOS[tipo];
  const dados = {};

  if (cfg.usa.n) {
    dados.n = inteiroNaoNegativo($('n').value);
    if (dados.n === null) return { erro: 'n deve ser um número inteiro maior ou igual a zero.' };
    if (dados.n > LIMITE) return { erro: `n deve ser no máximo ${LIMITE}.` };
  }
  if (cfg.usa.k) {
    dados.k = inteiroNaoNegativo($('k').value);
    if (dados.k === null) return { erro: 'k deve ser um número inteiro maior ou igual a zero.' };
    if (dados.k > LIMITE) return { erro: `k deve ser no máximo ${LIMITE}.` };
  }
  if (cfg.usa.reps) {
    const partes = $('reps').value.split(/[,;\s]+/).filter(Boolean);
    const reps = partes.map(inteiroNaoNegativo);
    if (reps.length === 0 || reps.some((r) => r === null || r < 1)) {
      return { erro: 'Informe inteiros positivos separados por vírgula. Ex.: 2, 3, 1.' };
    }
    if (reps.reduce((a, b) => a + b, 0) > LIMITE) {
      return { erro: `A soma das repetições deve ser no máximo ${LIMITE}.` };
    }
    dados.reps = reps;
  }

  const msg = cfg.validar ? cfg.validar(dados) : null;
  return msg ? { erro: msg } : { dados };
}

// ---------- Interface ----------

function atualizarCampos() {
  const cfg = TIPOS[$('tipo').value];
  $('campo-n').hidden = !cfg.usa.n;
  $('campo-k').hidden = !cfg.usa.k;
  $('campo-reps').hidden = !cfg.usa.reps;
  $('descricao').textContent = cfg.descricao;
  $('saida').hidden = true;
  $('erro').textContent = '';
}

function calcular(ev) {
  ev.preventDefault();
  const tipo = $('tipo').value;
  const { dados, erro } = lerEntradas(tipo);

  if (erro) {
    $('erro').textContent = erro;
    $('saida').hidden = true;
    return;
  }
  $('erro').textContent = '';

  const r = TIPOS[tipo].calcular(dados);
  const texto = r.valor.toString();

  $('formula').textContent = r.formula;
  $('substituicao').textContent = r.substituicao;
  $('resultado').textContent = r.valor.toLocaleString('pt-BR');
  $('digitos').textContent = texto.length > 15 ? `O resultado tem ${texto.length} dígitos.` : '';
  $('saida').hidden = false;
}

document.addEventListener('DOMContentLoaded', () => {
  $('form').addEventListener('input', () => {
    $('saida').hidden = true;
    $('erro').textContent = '';
  });
  $('tipo').addEventListener('change', atualizarCampos);
  $('form').addEventListener('submit', calcular);
  atualizarCampos();
});
