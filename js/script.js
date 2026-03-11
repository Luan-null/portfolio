// --- COMPORTAMENTO DE INÍCIO DO SITE ---
// Impede o navegador de tentar lembrar a posição da rolagem
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Garante que a página sempre comece no topo (pixel 0,0) quando recarregada
window.scrollTo(0, 0);

const btnTema = document.getElementById('btn-tema');
const html = document.documentElement;

btnTema.addEventListener('click', () => {
    // Verifica qual é o tema atual
    const temaAtual = html.getAttribute('data-tema');

if (temaAtual === 'claro') {
        html.removeAttribute('data-tema');
        btnTema.textContent = '🌙';
    } else {
        html.setAttribute('data-tema', 'claro');
        btnTema.textContent = '☀️';
    }
});

// --- LÓGICA DA CALCULADORA ---
const selectTipo = document.getElementById('tipo-site');
const selectPrazo = document.getElementById('prazo');
const valorTotal = document.getElementById('valor-total');
const btnWhatsapp = document.getElementById('btn-whatsapp');

const MEU_NUMERO = "5513996029076"; 

function calcularOrcamento() {
    // Pega os valores selecionados e transforma em número
    const precoBase = parseFloat(selectTipo.value);
    const multiplicadorPrazo = parseFloat(selectPrazo.value);
    
    // Faz a conta
    const total = precoBase * multiplicadorPrazo;
    
    // Atualiza o texto grande na tela
    valorTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    // Monta a mensagem automática para o WhatsApp
    const nomeServico = selectTipo.options[selectTipo.selectedIndex].text;
    const mensagem = `Olá, Luan! Fiz uma simulação no seu portfólio para um(a) ${nomeServico} e o valor estimado foi de R$ ${total.toFixed(2).replace('.', ',')}. Podemos conversar?`;
    
    // Atualiza o link do botão
    btnWhatsapp.href = `https://wa.me/${MEU_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

// Fica "ouvindo" toda vez que o usuário muda uma opção
selectTipo.addEventListener('change', calcularOrcamento);
selectPrazo.addEventListener('change', calcularOrcamento);

// Roda a função uma vez assim que o site carrega para ajustar o preço inicial
calcularOrcamento();

// --- ANIMAÇÕES DE SCROLL (REVEAL) ---

// Seleciona tudo que tiver a classe 'animar-scroll'
const elementosParaAnimar = document.querySelectorAll('.animar-scroll');

// Cria o vigia (Observer)
const observadorDeScroll = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        // Se o elemento entrou na tela...
        if (entrada.isIntersecting) {
            // Adiciona a classe que faz a animação acontecer
            entrada.target.classList.add('mostrar');
            
            // Opcional: faz a animação acontecer só uma vez
            // observadorDeScroll.unobserve(entrada.target); 
        }
    });
}, {
    threshold: 0.15 // A animação dispara quando 15% do elemento estiver visível
});

// Manda o vigia observar cada um dos elementos
elementosParaAnimar.forEach((elemento) => {
    observadorDeScroll.observe(elemento);
});

// --- CARROSSEL 3D DE PROJETOS ---
const cartoesCarrossel = document.querySelectorAll('.carrossel-3d .cartao-projeto');
const btnVoltar = document.getElementById('btn-voltar');
const btnAvancar = document.getElementById('btn-avancar');

let indiceCarrossel = 0;
let tempoAutoPlay; // Variável que vai guardar o nosso "cronômetro"

function atualizarCarrossel() {
    cartoesCarrossel.forEach((cartao, index) => {
        // Remove as classes antigas de todas as cartas
        cartao.classList.remove('ativo', 'esquerda', 'direita');

        // Calcula quem fica onde
        if (index === indiceCarrossel) {
            cartao.classList.add('ativo'); // A do meio
        } else if (index === (indiceCarrossel - 1 + cartoesCarrossel.length) % cartoesCarrossel.length) {
            cartao.classList.add('esquerda'); // A que fica atrás na esquerda
        } else {
            cartao.classList.add('direita'); // A que fica atrás na direita
        }
    });
}

// Criamos funções separadas para avançar e voltar
function proximoCartao() {
    indiceCarrossel = (indiceCarrossel + 1) % cartoesCarrossel.length;
    atualizarCarrossel();
}

function cartaoAnterior() {
    indiceCarrossel = (indiceCarrossel - 1 + cartoesCarrossel.length) % cartoesCarrossel.length;
    atualizarCarrossel();
}

// --- A MÁGICA DO AUTO-PLAY ---
function iniciarAutoPlay() {
    // Primeiro, limpamos qualquer cronômetro antigo para não encavalar
    clearInterval(tempoAutoPlay);
    // Depois, mandamos ele rodar a função "proximoCartao" a cada 4000 milissegundos (4 segundos)
    tempoAutoPlay = setInterval(proximoCartao, 4000);
}

// Ações dos botões (agora eles avançam E reiniciam o cronômetro automático)
btnVoltar.addEventListener('click', () => {
    cartaoAnterior();
    iniciarAutoPlay(); // Se o usuário clicou, damos mais 4 segundos pra ele olhar
});

btnAvancar.addEventListener('click', () => {
    proximoCartao();
    iniciarAutoPlay(); // Se o usuário clicou, damos mais 4 segundos pra ele olhar
});

// Faz a mágica acontecer assim que o site carrega
atualizarCarrossel();
iniciarAutoPlay(); // Dá a partida no motor automático!

// --- FUNCIONAMENTO DO MENU MOBILE ---
const btnHamburguer = document.querySelector('.menu-hamburguer');
const menuNavegacao = document.querySelector('.menu-navegacao');
const linksMenu = document.querySelectorAll('.menu-navegacao a');

// 1. Abre e fecha o menu ao clicar no sanduíche
btnHamburguer.addEventListener('click', () => {
    menuNavegacao.classList.toggle('ativo');
});

// 2. Fecha a gaveta automaticamente após clicar em um link (para o site rolar e a tela ficar limpa)
linksMenu.forEach(link => {
    link.addEventListener('click', () => {
        menuNavegacao.classList.remove('ativo');
    });
});