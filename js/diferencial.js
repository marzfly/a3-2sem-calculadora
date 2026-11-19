const formRaizes = document.getElementById('form-raizes');
const saidaRaizes = document.getElementById('saida-raizes');
const erroRaizes = document.getElementById('erro-raizes');

function limparRespostaRaizes() {
  saidaRaizes.hidden = true;
  erroRaizes.textContent = '';
}

function lerCoeficienteRaizes(id) {
  const texto = document.getElementById(id).value;
  if (texto.trim() === '' || !Number.isFinite(Number(texto))) {
    throw new Error('Preencha os três coeficientes com números válidos.');
  }
  return Number(texto);
}

formRaizes.addEventListener('submit', evento => {
  evento.preventDefault();
  limparRespostaRaizes();
  try {
    const a = lerCoeficienteRaizes('raiz-a');
    const b = lerCoeficienteRaizes('raiz-b');
    const c = lerCoeficienteRaizes('raiz-c');
    const resposta = resolverSegundoGrau(a, b, c);
    const f = Matematica.formatar;
    const termo = valor => (valor < 0 ? ' − ' : ' + ') + f(Math.abs(valor));

    document.getElementById('equacao-raizes').textContent = f(a) + 'x²' + termo(b) + 'x' + termo(c) + ' = 0';
    document.getElementById('conta-delta').textContent = 'Δ = (' + f(b) + ')² − 4 × (' + f(a) + ') × (' + f(c) + ')';
    document.getElementById('valor-delta').textContent = f(resposta.delta);
    document.getElementById('conta-bhaskara').textContent = resposta.delta < 0
      ? 'Como Δ < 0, √Δ não tem valor real.'
      : 'x = (−(' + f(b) + ') ± √(' + f(resposta.delta) + ')) / (2 × (' + f(a) + '))';

    const tipo = document.getElementById('tipo-raizes');
    const valores = document.getElementById('valor-raizes');
    if (resposta.raizes.length === 0) {
      tipo.textContent = 'Δ < 0: a equação não possui raízes reais.';
      valores.textContent = '';
    } else if (resposta.raizes.length === 1) {
      tipo.textContent = 'Δ = 0: a equação possui uma raiz real dupla.';
      valores.textContent = 'x₁ = x₂ = ' + f(resposta.raizes[0]);
    } else {
      tipo.textContent = 'Δ > 0: a equação possui duas raízes reais distintas (em ordem crescente).';
      valores.textContent = 'x₁ = ' + f(resposta.raizes[0]) + ' e x₂ = ' + f(resposta.raizes[1]);
    }
    saidaRaizes.hidden = false;
  } catch (erro) {
    erroRaizes.textContent = erro.message;
  }
});

// Não mantém uma resposta antiga visível depois que os dados são alterados.
formRaizes.addEventListener('input', limparRespostaRaizes);
