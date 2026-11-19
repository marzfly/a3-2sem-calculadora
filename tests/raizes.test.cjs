// Executar na raiz do projeto: node --test tests/raizes.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const contexto = vm.createContext({});
for (const arquivo of ['matematica.js', 'raizes.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js', arquivo), 'utf8'), contexto);
}
const resolver = (a, b, c) => JSON.parse(JSON.stringify(contexto.resolverSegundoGrau(a, b, c)));

for (const [nome, a, b, c, esperado] of [
  ['duas raízes', 1, -3, 2, [1, 2]],
  ['raiz dupla', 1, -2, 1, [1]],
  ['sem raízes reais', 1, 0, 1, []],
  ['raiz dupla decimal', 0.1, 0.6, 0.9, [-3]],
  ['coeficiente a negativo', -1, 3, -2, [1, 2]],
  ['termo independente zero', 1, -2, 0, [0, 2]],
  ['b e c iguais a zero', 1, 0, 0, [0]],
  ['delta pequeno legítimo', 1e-10, 0, -1e-10, [-1, 1]],
  ['raízes de escalas diferentes', 1, -1e10, 1, [1e-10, 1e10]]
]) {
  test(nome, () => {
    const resposta = resolver(a, b, c);
    assert.equal(resposta.raizes.length, esperado.length);
    resposta.raizes.forEach((raiz, i) => {
      assert.ok(Math.abs(raiz - esperado[i]) <= Math.max(Math.abs(esperado[i]) * 1e-12, 1e-15));
    });
  });
}
for (const [nome, a, b, c] of [
  ['a zero', 0, 2, 1], ['entrada não finita', Infinity, 1, 1],
  ['entrada inválida', NaN, 1, 1], ['estouro de delta', 1, 1e200, 1],
  ['produto abaixo da precisão', 1e-200, 0, -1e-200],
  ['quadrado de b abaixo da precisão', 1e-200, 1e-200, 0],
  ['produto subnormal impreciso', 1e-160, 0, -1e-160]
]) {
  test('recusa ' + nome, () => assert.throws(() => resolver(a, b, c)));
}

test('raízes conhecidas de 99 equações construídas por fatores', () => {
  // a(x-r1)(x-r2) dá os coeficientes sem usar Bhaskara como resposta esperada.
  for (const a of [-2, 0.5, 3]) {
    for (let r1 = -5; r1 <= 5; r1++) {
      for (const distancia of [0, 1, 4]) {
        const r2 = r1 + distancia;
        const resposta = resolver(a, -a * (r1 + r2), a * r1 * r2);
        const esperado = distancia === 0 ? [r1] : [r1, r2];
        assert.equal(resposta.raizes.length, esperado.length);
        resposta.raizes.forEach((raiz, i) => assert.ok(Math.abs(raiz - esperado[i]) < 1e-10));
      }
    }
  }
});
