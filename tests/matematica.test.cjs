// Executar com: node --test tests/matematica.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const contexto = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/matematica.js'), 'utf8'), contexto);
const matematica = vm.runInContext('Matematica', contexto);

const exemplos = [
  ['2+3*4', undefined, 14], ['(2+3)*4', undefined, 20],
  ['2^3^2', undefined, 512], ['-2^2', undefined, -4],
  ['(-2)^2', undefined, 4], ['2^-3', undefined, 0.125],
  ['2,5+1.5', undefined, 4], ['1e20/1e19', undefined, 10],
  [' 2 + 3 ', undefined, 5], ['.5*8', undefined, 4],
  ['x^2 - 4', 3, 5], ['2x² + 3x - 1', 2, 13],
  ['2(x+1)', 3, 8], ['(x+1)(x-1)', 3, 8],
  ['sqrt(x)', 4, 2], ['raiz(x)', 9, 3], ['√(x)', 16, 4],
  ['1/x', 2, 0.5], ['1/(x-1)', 3, 0.5],
  ['log(x)', 100, 2], ['ln(e)', undefined, 1],
  ['sin(pi/2)', undefined, 1], ['sen(pi/2)', undefined, 1],
  ['cos(0)', undefined, 1], ['tan(0)', undefined, 0],
  ['abs(x)', -5, 5], ['exp(0)', undefined, 1], ['x³', -2, -8],
  ['0^0', undefined, 1], ['1e-20*x+1', 0, 1]
];
for (const [expressao, x, esperado] of exemplos) {
  test('avalia ' + expressao + ' com x=' + x, () => {
    const recebido = matematica.avaliar(expressao, x);
    assert.ok(Math.abs(recebido - esperado) <= 1e-12 * Math.max(1, Math.abs(esperado)));
  });
}

for (const [expressao, x] of [
  ['',0], ['1/0',0], ['sqrt(x)',-1], ['log(x)',0], ['ln(x)',-1],
  ['1/(x-1)',1], ['tan(pi/2)',0], ['(-1)^.5',0], ['1e309',0],
  ['exp(1000)',0], ['(2+3',0], ['2+',0], ['1 2',0], ['2**3',0],
  ['Math.PI',0], ['alert(1)',0], ['constructor(1)',0], ['[1,2]',0],
  ['x',undefined], ['9^999',0], ['('.repeat(70)+'1'+')'.repeat(70),0]
]) {
  test('recusa entrada ou domínio inválido: ' + expressao.slice(0, 35), () => {
    assert.throws(() => matematica.avaliar(expressao, x));
  });
}

test('expressão compilada pode ser reutilizada em uma tabela', () => {
  const funcao = matematica.compilar('x^2 - 4');
  assert.deepEqual([-2,-1,0,1,2].map(x => funcao.calcular(x)), [0,-3,-4,-3,0]);
});
test('erro em um ponto não contamina os outros pontos', () => {
  const funcao = matematica.compilar('1/x');
  assert.throws(() => funcao.calcular(0), erro => erro.tipo === 'dominio');
  assert.equal(funcao.calcular(2), 0.5);
});
test('preserva números pequenos na apresentação', () => {
  assert.notEqual(matematica.formatar(1e-7), '0');
  assert.notEqual(matematica.formatar(-1e-7), '0');
  assert.equal(matematica.formatar(0.00001), '1e-5');
});
test('normaliza zero negativo sem apagar valores não nulos', () => {
  assert.equal(matematica.formatar(-0), '0');
  assert.notEqual(matematica.formatar(-1e-15), '0');
});
test('valores grandes usam notação compacta e finitos inválidos são rejeitados', () => {
  assert.ok(matematica.formatar(1e200).length < 20);
  assert.throws(() => matematica.formatar(Infinity));
  assert.throws(() => matematica.formatar(NaN));
});

test('funções digitadas podem usar graus sem mudar o padrão em radianos', () => {
  assert.ok(Math.abs(matematica.avaliar('sen(30)', undefined, 'graus') - 0.5) < 1e-12);
  assert.equal(matematica.avaliar('sen(pi/2)'), 1);
  assert.throws(() => matematica.avaliar('tan(90)', undefined, 'graus'), erro => erro.tipo === 'dominio');
});

test('produto numérico usado no delta recusa estouro e perda para zero', () => {
  assert.equal(matematica.produtoFinito(2, 3), 6);
  assert.equal(matematica.produtoFinito(0, 1e-200), 0);
  assert.throws(() => matematica.produtoFinito(1e308, 2));
  assert.throws(() => matematica.produtoFinito(1e-200, 1e-200));
  assert.throws(() => matematica.produtoFinito(1e-160, 1e-160));
});
