// Cálculo separado da interface para facilitar os testes e a explicação.
function resolverSegundoGrau(a, b, c) {
  if (![a, b, c].every(Number.isFinite)) throw new Error('Informe coeficientes numéricos válidos.');
  if (a === 0) throw new Error('O coeficiente a precisa ser diferente de zero para a equação ser do segundo grau.');

  const bQuadrado = Matematica.produtoFinito(b, b);
  const quatroAC = Matematica.produtoFinito(4, Matematica.produtoFinito(a, c));
  let delta = Matematica.finito(bQuadrado - quatroAC);

  // Decimais podem produzir uma diferença minúscula quando o delta deveria ser zero.
  const tolerancia = 8 * Number.EPSILON * Math.max(Math.abs(bQuadrado), Math.abs(quatroAC));
  if (Math.abs(delta) <= tolerancia) delta = 0;

  if (delta < 0) return { delta, raizes: [] };
  if (delta === 0) return { delta, raizes: [Matematica.finito(-b / a / 2)] };

  // Forma equivalente a Bhaskara que evita subtrair números quase iguais.
  const q = -0.5 * (b + (b >= 0 ? 1 : -1) * Math.sqrt(delta));
  const raizes = [Matematica.finito(q / a), Matematica.finito(c / q)];
  raizes.sort((x, y) => x - y);
  return { delta, raizes };
}
