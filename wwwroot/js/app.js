/* =========================================================
   SenaiControl — lógica de painel
   ========================================================= */

const API_URL = '/api/salas';
const INTERVALO_ATUALIZACAO = 10000;

let todasAsSalas = [];
let filtroAtual = 'Todos';
let salaEmEdicao = null;
let emModoDemo = false;

// Dados de exemplo, usados somente se a API não responder
// (ex.: ao abrir o arquivo localmente, sem backend).
const DADOS_DEMONSTRACAO = [
    { id: 1, nome: '101', bloco: 'A', pavimento: 'Térreo', estaOcupada: false, docenteAtual: null },
    { id: 2, nome: '102', bloco: 'A', pavimento: 'Térreo', estaOcupada: true, docenteAtual: 'Marcos Silva' },
    { id: 3, nome: '103', bloco: 'A', pavimento: 'Térreo', estaOcupada: false, docenteAtual: null },
    { id: 4, nome: '201', bloco: 'B', pavimento: '1º Pavimento', estaOcupada: true, docenteAtual: 'Ana Cardoso' },
    { id: 5, nome: '202', bloco: 'B', pavimento: '1º Pavimento', estaOcupada: false, docenteAtual: null },
    { id: 6, nome: '203', bloco: 'B', pavimento: '1º Pavimento', estaOcupada: false, docenteAtual: null },
    { id: 7, nome: '301', bloco: 'C', pavimento: '2º Pavimento', estaOcupada: true, docenteAtual: 'Renato Alves' },
    { id: 8, nome: '302', bloco: 'C', pavimento: '2º Pavimento', estaOcupada: false, docenteAtual: null },
    { id: 9, nome: 'Oficina 1', bloco: 'Oficinas', pavimento: 'Oficinas', estaOcupada: true, docenteAtual: 'Paulo Nunes' },
    { id: 10, nome: 'Oficina 2', bloco: 'Oficinas', pavimento: 'Oficinas', estaOcupada: false, docenteAtual: null },
];

function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
}

/* ---------------------------------------------------------
   Relógio
   --------------------------------------------------------- */

function iniciarRelogio() {
    const el = document.getElementById('relogio');
    const atualizar = () => {
        el.textContent = new Date().toLocaleTimeString('pt-BR');
    };
    atualizar();
    setInterval(atualizar, 1000);
}

/* ---------------------------------------------------------
   Carregamento de dados
   --------------------------------------------------------- */

async function carregarSalas() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Resposta inválida da API');
        todasAsSalas = await res.json();
        emModoDemo = false;
        document.getElementById('aviso-demo').hidden = true;
    } catch (err) {
        // mantém as alterações já feitas na demonstração em vez de resetar a cada atualização
        todasAsSalas = emModoDemo ? todasAsSalas : DADOS_DEMONSTRACAO;
        emModoDemo = true;
        document.getElementById('aviso-demo').hidden = false;
    }
    aplicarFiltro(filtroAtual);
}

function filtrar(pavimento) {
    filtroAtual = pavimento;
    document.querySelectorAll('.filtros button').forEach(btn => {
        btn.classList.toggle('ativo', btn.dataset.pavimento === pavimento);
    });
    aplicarFiltro(pavimento);
}

function aplicarFiltro(pavimento) {
    const salas = pavimento === 'Todos'
        ? todasAsSalas
        : todasAsSalas.filter(s => s.pavimento === pavimento);
    renderizarSalas(salas);
}

/* ---------------------------------------------------------
   Renderização
   --------------------------------------------------------- */

function renderizarSalas(salas) {
    atualizarContadores(todasAsSalas);

    const grid = document.getElementById('grid-salas');

    if (salas.length === 0) {
        grid.innerHTML = '<p class="vazio">Nenhuma sala encontrada neste pavimento.</p>';
        return;
    }

    const blocos = [...new Set(salas.map(s => s.bloco))];

    grid.innerHTML = blocos.map(bloco => `
        <div class="bloco-container">
            <div class="titulo-bloco">
                <h2>Bloco ${escaparHtml(bloco)}</h2>
                <div class="regua" aria-hidden="true"></div>
            </div>
            <div class="planta-baixa">
                ${salas.filter(s => s.bloco === bloco).map(salaParaHtml).join('')}
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.sala-mapa').forEach(el => {
        el.addEventListener('click', () => abrirModal(Number(el.dataset.id)));
    });
}

function salaParaHtml(sala) {
    const status = sala.estaOcupada ? 'ocupada' : 'livre';
    return `
        <button type="button" class="sala-mapa ${status}" data-id="${sala.id}"
                aria-label="Sala ${escaparHtml(sala.nome)}, ${sala.estaOcupada ? 'ocupada' : 'livre'}">
            <div class="sala-cabecalho">
                <span class="sala-nome">${escaparHtml(sala.nome)}</span>
                ${iconePorta()}
            </div>
            <div class="sala-rodape">
                <span class="sala-status">
                    <span class="led led--${status}"></span>
                    ${sala.estaOcupada ? 'Ocupada' : 'Livre'}
                </span>
                ${sala.estaOcupada && sala.docenteAtual
                    ? `<span class="sala-docente">${escaparHtml(sala.docenteAtual)}</span>`
                    : ''}
            </div>
        </button>
    `;
}

function iconePorta() {
    return `
        <svg class="sala-porta" width="26" height="26" viewBox="0 0 28 28" fill="none">
            <path d="M3 26 L3 3" stroke="var(--linha)" stroke-width="2" stroke-linecap="round"/>
            <path d="M3 3 A23 23 0 0 1 26 26" stroke="var(--linha)" stroke-width="1.2" stroke-dasharray="2 2"/>
        </svg>
    `;
}

function atualizarContadores(salas) {
    document.getElementById('contagem-livre').textContent = salas.filter(s => !s.estaOcupada).length;
    document.getElementById('contagem-ocupada').textContent = salas.filter(s => s.estaOcupada).length;
}

/* ---------------------------------------------------------
   Modal de acesso
   --------------------------------------------------------- */

function abrirModal(id) {
    salaEmEdicao = todasAsSalas.find(s => s.id === id);
    if (!salaEmEdicao) return;

    const vaiOcupar = !salaEmEdicao.estaOcupada;

    document.getElementById('modal-titulo').textContent =
        (vaiOcupar ? 'Registrar ocupação — Sala ' : 'Liberar acesso — Sala ') + salaEmEdicao.nome;

    document.getElementById('modal-sub').textContent = vaiOcupar
        ? 'Informe o docente responsável e a senha de acesso.'
        : `Atualmente com ${salaEmEdicao.docenteAtual || 'docente não informado'}. Informe a senha para liberar.`;

    document.getElementById('campo-docente').hidden = !vaiOcupar;
    document.getElementById('input-docente').value = '';
    document.getElementById('input-senha').value = '';
    document.getElementById('modal-confirmar').textContent = vaiOcupar ? 'Ocupar sala' : 'Liberar sala';
    esconderErroModal();

    document.getElementById('modal-overlay').hidden = false;
    (vaiOcupar ? document.getElementById('input-docente') : document.getElementById('input-senha')).focus();
}

function fecharModal() {
    document.getElementById('modal-overlay').hidden = true;
    salaEmEdicao = null;
}

function mostrarErroModal(mensagem) {
    const el = document.getElementById('modal-erro');
    el.textContent = mensagem;
    el.hidden = false;
}

function esconderErroModal() {
    document.getElementById('modal-erro').hidden = true;
}

async function confirmarModal(evento) {
    evento.preventDefault();
    if (!salaEmEdicao) return;

    const vaiOcupar = !salaEmEdicao.estaOcupada;
    const senha = document.getElementById('input-senha').value.trim();
    const docente = document.getElementById('input-docente').value.trim();

    if (!senha) return mostrarErroModal('Informe a senha de acesso.');
    if (vaiOcupar && !docente) return mostrarErroModal('Informe o nome do docente.');

    // Sem API real conectada: aplica a alteração localmente para demonstrar o painel.
    if (emModoDemo) {
        salaEmEdicao.estaOcupada = vaiOcupar;
        salaEmEdicao.docenteAtual = vaiOcupar ? docente : null;
        fecharModal();
        aplicarFiltro(filtroAtual);
        return;
    }

    const payload = { senha, docenteAtual: vaiOcupar ? docente : null, ocupar: vaiOcupar };
    const botao = document.getElementById('modal-confirmar');
    const textoOriginal = botao.textContent;
    botao.disabled = true;
    botao.textContent = 'Enviando…';

    try {
        const res = await fetch(`${API_URL}/${salaEmEdicao.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const erro = await res.json().catch(() => ({}));
            mostrarErroModal(erro.message || `Erro ${res.status}: acesso negado.`);
            return;
        }

        fecharModal();
        carregarSalas();
    } catch (err) {
        console.error('SenaiControl — falha ao enviar status da sala:', err);
        mostrarErroModal('Não foi possível conectar ao servidor. Veja o console (F12) para detalhes.');
    } finally {
        botao.disabled = false;
        botao.textContent = textoOriginal;
    }
}

document.getElementById('modal-form').addEventListener('submit', confirmarModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') fecharModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModal();
});

/* ---------------------------------------------------------
   Inicialização
   --------------------------------------------------------- */

iniciarRelogio();
carregarSalas();
setInterval(carregarSalas, INTERVALO_ATUALIZACAO);