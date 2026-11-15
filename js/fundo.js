// O estado fica salvo nesta aba para acompanhar a navegação entre os módulos.
const imagensDeFundo = [
  'assets/fundo-muro.jpg',
  'assets/fundo-lago.jpg',
  'assets/fundo-trilhos.jpg',
  'assets/fundo-caminho.jpg',
  'assets/WhatsApp Image 2026-11-15 at 14.09.56.jpeg'
];
const intervaloDoFundo = 10000;
const chaveDoFundo = 'euler-fundo';
let estadoDoFundo = { indice: 0, proximaTroca: Date.now() + intervaloDoFundo };
let temporizadorDoFundo;

try {
  const salvo = JSON.parse(sessionStorage.getItem(chaveDoFundo));
  if (salvo && Number.isInteger(salvo.indice) && salvo.indice >= 0 &&
      salvo.indice < imagensDeFundo.length && Number.isFinite(salvo.proximaTroca)) {
    estadoDoFundo = salvo;
  }
} catch (erro) {
  // A página continua funcionando se o navegador bloquear o armazenamento.
}

function salvarFundo() {
  try {
    sessionStorage.setItem(chaveDoFundo, JSON.stringify(estadoDoFundo));
  } catch (erro) {
    // O bloqueio do armazenamento não interfere nas calculadoras.
  }
}

function enderecoDoFundo(indice) {
  return new URL(imagensDeFundo[indice], document.baseURI).href;
}

// Se os 10 segundos passaram durante a navegação, acompanha o relógio salvo.
if (Date.now() >= estadoDoFundo.proximaTroca) {
  const trocasPassadas = Math.floor((Date.now() - estadoDoFundo.proximaTroca) / intervaloDoFundo) + 1;
  estadoDoFundo.indice = (estadoDoFundo.indice + trocasPassadas) % imagensDeFundo.length;
  estadoDoFundo.proximaTroca += trocasPassadas * intervaloDoFundo;
}
salvarFundo();
document.body.style.setProperty('--foto-fundo', 'url("' + enderecoDoFundo(estadoDoFundo.indice) + '")');

// Pré-carrega as fotos para o fade começar com a imagem já disponível.
for (const caminho of imagensDeFundo) {
  const imagem = new Image();
  imagem.src = new URL(caminho, document.baseURI).href;
}

function agendarTrocaDoFundo() {
  clearTimeout(temporizadorDoFundo);
  const restante = Math.max(0, estadoDoFundo.proximaTroca - Date.now());
  temporizadorDoFundo = setTimeout(trocarFundo, restante);
}

function trocarFundo() {
  if (document.hidden) return;
  const proximoIndice = (estadoDoFundo.indice + 1) % imagensDeFundo.length;
  const imagem = new Image();
  imagem.onload = () => {
    estadoDoFundo.indice = proximoIndice;
    estadoDoFundo.proximaTroca = Date.now() + intervaloDoFundo;
    salvarFundo();
    document.body.style.setProperty('--foto-proxima', 'url("' + imagem.src + '")');
    document.body.classList.add('trocando-fundo');

    setTimeout(() => {
      document.body.style.setProperty('--foto-fundo', 'url("' + imagem.src + '")');
      document.body.classList.remove('trocando-fundo');
    }, 1600);
    agendarTrocaDoFundo();
  };
  imagem.onerror = () => {
    estadoDoFundo.proximaTroca = Date.now() + intervaloDoFundo;
    salvarFundo();
    agendarTrocaDoFundo();
  };
  imagem.src = enderecoDoFundo(proximoIndice);
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) agendarTrocaDoFundo();
});
agendarTrocaDoFundo();
