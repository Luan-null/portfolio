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

// Seleciona os elementos da calculadora
const selectTipo = document.getElementById("tipo-site");
const selectComplexidade = document.getElementById("complexidade");
const selectPrazo = document.getElementById("prazo");
const visorTotal = document.getElementById("valor-total");
const btnWhatsapp = document.getElementById("btn-whatsapp"); // Pegamos o botão aqui

function calcularOrcamento() {
    // 1. Faz a matemática dos valores numéricos
    let valorBase = parseFloat(selectTipo.value);
    let multComplexidade = parseFloat(selectComplexidade.value);
    let multPrazo = parseFloat(selectPrazo.value);

    let total = valorBase * multComplexidade * multPrazo;
    let valorFormatado = "";

    // 2. Define a moeda com base no idioma
    if (typeof idiomaAtual !== 'undefined' && idiomaAtual === "en") {
        let totalDolar = total / 5; // Cotação base
        valorFormatado = totalDolar.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    } else {
        valorFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Atualiza o visor na tela
    visorTotal.innerText = valorFormatado;

    // --- 3. LÓGICA DO WHATSAPP (A MÁGICA) ---
    // Pega o texto visível que o cliente escolheu (não o número)
    let textoTipo = selectTipo.options[selectTipo.selectedIndex].text;
    let textoComplexidade = selectComplexidade.options[selectComplexidade.selectedIndex].text;
    let textoPrazo = selectPrazo.options[selectPrazo.selectedIndex].text;

    let mensagem = "";

    // Monta a mensagem no idioma correto
    if (typeof idiomaAtual !== 'undefined' && idiomaAtual === "en") {
        mensagem = `Hi Luan! I'm interested in starting a project.\n\n` +
                   `*Project:* ${textoTipo}\n` +
                   `*Complexity:* ${textoComplexidade}\n` +
                   `*Timeframe:* ${textoPrazo}\n\n` +
                   `*Estimated Investment:* ${valorFormatado}`;
    } else {
        mensagem = `Olá Luan! Tenho interesse em iniciar um projeto.\n\n` +
                   `*Projeto:* ${textoTipo}\n` +
                   `*Complexidade:* ${textoComplexidade}\n` +
                   `*Prazo:* ${textoPrazo}\n\n` +
                   `*Investimento Estimado:* ${valorFormatado}`;
    }

    // Atualiza o link do botão com a mensagem codificada para URL
    btnWhatsapp.href = `https://wa.me/5513996029076?text=${encodeURIComponent(mensagem)}`;
}

// Escuta as mudanças
selectTipo.addEventListener("change", calcularOrcamento);
selectComplexidade.addEventListener("change", calcularOrcamento);
selectPrazo.addEventListener("change", calcularOrcamento);

// Roda a conta uma vez assim que o site carrega
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