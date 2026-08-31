/* =========================================================
   SenaiControl — lógica de painel
   ========================================================= */

const API_URL = '/api/salas';
const INTERVALO_ATUALIZACAO = 10000;

let todasAsSalas = [];
let salaEmEdicao = null;
let emModoDemo = false;

// Navegação: 'inicio' mostra os blocos/galpões; 'galpao' mostra as
// salas de um galpão específico (definido por galpaoAtivoId).
let vista = 'inicio';
let galpaoAtivoId = null;

// Dados de exemplo, usados somente se a API não responder
// (ex.: ao abrir o arquivo localmente, sem backend).
//
// Itens com `salas` (tipo "galpao") são grupos: ao clicar, o usuário
// navega para uma tela listando as salas daquele galpão em vez de
// abrir o modal de acesso direto. Substitua os nomes/ids abaixo
// pelas salas reais de cada galpão quando estiverem cadastradas.
const DADOS_DEMONSTRACAO = [
    // ================= GALPÕES =================
    {
        id: 'galpao-manutencao', nome: 'Oficina de Manutenção', bloco: 'Galpões', tipo: 'galpao',
        salas: [
            { id: 'manutencao-a', nome: 'Sala A', estaOcupada: false, docenteAtual: null },
            { id: 'manutencao-b', nome: 'Sala B', estaOcupada: true, docenteAtual: 'Marcos Silva' },
            { id: 'manutencao-c', nome: 'Sala C', estaOcupada: false, docenteAtual: null },
        ]
    },
    {
        id: 'galpao-automotiva', nome: 'Oficina de Automotiva', bloco: 'Galpões', tipo: 'galpao',
        salas: [
            { id: 'automotiva-b', nome: 'Sala B', estaOcupada: false, docenteAtual: null },
            { id: 'automotiva-c', nome: 'Sala C', estaOcupada: true, docenteAtual: 'Ana Cardoso' },
            { id: 'automotiva-d', nome: 'Sala D', estaOcupada: false, docenteAtual: null },
            { id: 'automotiva-e', nome: 'Sala E', estaOcupada: false, docenteAtual: null },
            { id: 'automotiva-f', nome: 'Sala F', estaOcupada: false, docenteAtual: null },
            { id: 'automotiva-lab', nome: 'Laboratório de Automotiva', estaOcupada: false, docenteAtual: null },
        ]
    },
    {
        id: 'galpao-usinagem', nome: 'Oficina de Usinagem', bloco: 'Galpões', tipo: 'galpao',
        salas: [
            { id: 'usinagem-info-1', nome: 'Laboratório de Informática 1', estaOcupada: false, docenteAtual: null },
            { id: 'usinagem-info-2', nome: 'Laboratório de Informática 2', estaOcupada: true, docenteAtual: 'Paulo Nunes' },
            { id: 'usinagem-tridimensional', nome: 'Laboratório Tridimensional', estaOcupada: false, docenteAtual: null },
            { id: 'usinagem-b', nome: 'Sala B', estaOcupada: false, docenteAtual: null },
        ]
    },
    {
        id: 'galpao-metalurgia', nome: 'Oficina de Metalurgia', bloco: 'Galpões', tipo: 'galpao',
        salas: [
            { id: 'metalurgia-solda', nome: 'Setor de Simuladores de Solda', estaOcupada: false, docenteAtual: null },
            { id: 'metalurgia-a', nome: 'Sala A', estaOcupada: false, docenteAtual: null },
            { id: 'metalurgia-b', nome: 'Sala B', estaOcupada: true, docenteAtual: 'Renato Alves' },
        ]
    },
    {
        id: 'galpao-ajustagem', nome: 'Oficina de Ajustagem', bloco: 'Galpões', tipo: 'galpao',
        salas: [
            { id: 'ajustagem-a', nome: 'Sala A', estaOcupada: false, docenteAtual: null },
            { id: 'ajustagem-b', nome: 'Sala B', estaOcupada: false, docenteAtual: null },
            { id: 'ajustagem-c', nome: 'Sala C', estaOcupada: false, docenteAtual: null },
            { id: 'ajustagem-moto', nome: 'Laboratório de Motocicleta', estaOcupada: false, docenteAtual: null },
            { id: 'ajustagem-colorimetria', nome: 'Laboratório de Colorimetria 02', estaOcupada: false, docenteAtual: null },
        ]
    },

    // ================= SENAI LAB =================
    { id: 'senai-lab-inovacao', nome: 'Laboratório de Inovação', bloco: 'Senai Lab', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'senai-lab-webconf', nome: 'WebConferência', bloco: 'Senai Lab', tipo: 'sala', estaOcupada: true, docenteAtual: 'Renato Alves' },

    // ================= BLOCO A =================
    { id: 'a-sala-1', nome: 'Sala 1', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'a-sala-2', nome: 'Sala 2 (Laboratório de Informática)', bloco: 'A', tipo: 'sala', estaOcupada: true, docenteAtual: 'Marcos Silva' },
    { id: 'a-sala-3', nome: 'Sala 3', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'a-sala-4', nome: 'Sala 4 (Laboratório de Metrologia)', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'a-sala-5', nome: 'Sala 5 (Laboratório de Eletro-hidráulica)', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'a-sala-6', nome: 'Sala 6 (Laboratório de Pneumática)', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'a-sala-7', nome: 'Sala 7', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'a-sala-8', nome: 'Sala 8', bloco: 'A', tipo: 'sala', estaOcupada: true, docenteAtual: 'Ana Cardoso' },
    { id: 'a-sala-9', nome: 'Sala 9', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'a-sala-10', nome: 'Sala 10', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'a-sala-11', nome: 'Sala 11', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'a-sala-12', nome: 'Sala 12 (Laboratório de Informática)', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'a-sala-13', nome: 'Sala 13', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'a-sala-14', nome: 'Sala 14', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'a-sala-15', nome: 'Sala 15 (Laboratório de Segurança no Trabalho)', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
    { id: 'a-sala-16', nome: 'Sala 16', bloco: 'A', tipo: 'sala', estaOcupada: false, docenteAtual: null },
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
   Estrutura de dados: normalização e busca
   --------------------------------------------------------- */

// Garante que todo item tenha um `tipo` definido, mesmo vindo de uma
// API que ainda não conhece o conceito de galpão (nesse caso, tudo
// é tratado como sala individual, como no comportamento original).
function normalizarItens(lista) {
    return lista.map(item => {
        const tipo = item.tipo || (Array.isArray(item.salas) ? 'galpao' : 'sala');
        if (tipo === 'galpao') {
            return { ...item, tipo, salas: normalizarItens(item.salas || []) };
        }
        return { ...item, tipo };
    });
}

function encontrarPorId(id, lista = todasAsSalas) {
    for (const item of lista) {
        if (String(item.id) === String(id)) return item;
        if (item.tipo === 'galpao' && Array.isArray(item.salas)) {
            const achado = encontrarPorId(id, item.salas);
            if (achado) return achado;
        }
    }
    return null;
}

// "Achata" a estrutura em uma lista só de salas (folhas), incluindo
// as que estão dentro de galpões — usado para os contadores do topo.
function todasSalasFlat(lista = todasAsSalas) {
    let resultado = [];
    for (const item of lista) {
        if (item.tipo === 'galpao' && Array.isArray(item.salas)) {
            resultado = resultado.concat(todasSalasFlat(item.salas));
        } else {
            resultado.push(item);
        }
    }
    return resultado;
}

/* ---------------------------------------------------------
   Carregamento de dados
   --------------------------------------------------------- */

async function carregarSalas() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Resposta inválida da API');
        todasAsSalas = normalizarItens(await res.json());
        emModoDemo = false;
        document.getElementById('aviso-demo').hidden = true;
    } catch (err) {
        // mantém as alterações já feitas na demonstração em vez de resetar a cada atualização
        todasAsSalas = emModoDemo ? todasAsSalas : normalizarItens(DADOS_DEMONSTRACAO);
        emModoDemo = true;
        document.getElementById('aviso-demo').hidden = false;
    }
    renderizarVistaAtual();
}

/* ---------------------------------------------------------
   Navegação entre a visão inicial e a visão de um galpão
   --------------------------------------------------------- */

function renderizarVistaAtual() {
    atualizarContadores(todasSalasFlat());

    if (vista === 'galpao') {
        const galpao = encontrarPorId(galpaoAtivoId);
        if (galpao && galpao.tipo === 'galpao') {
            renderizarGalpao(galpao);
            return;
        }
        // o galpão sumiu da lista (ex.: dados recarregados) — volta para o início
        vista = 'inicio';
        galpaoAtivoId = null;
    }

    renderizarInicio();
}

function abrirGalpao(id) {
    const galpao = encontrarPorId(id);
    if (!galpao || galpao.tipo !== 'galpao') return;
    vista = 'galpao';
    galpaoAtivoId = id;
    renderizarVistaAtual();
}

function voltarParaInicio() {
    vista = 'inicio';
    galpaoAtivoId = null;
    renderizarVistaAtual();
}

/* ---------------------------------------------------------
   Renderização — visão inicial (blocos e galpões)
   --------------------------------------------------------- */

function renderizarInicio() {
    document.getElementById('cabecalho-visao').hidden = true;

    const grid = document.getElementById('grid-salas');

    if (todasAsSalas.length === 0) {
        grid.innerHTML = '<p class="vazio">Nenhum ambiente cadastrado.</p>';
        return;
    }

    const blocos = [...new Set(todasAsSalas.map(s => s.bloco))];

    grid.innerHTML = blocos.map(bloco => `
        <div class="bloco-container">
            <div class="titulo-bloco">
                <h2>${escaparHtml(bloco)}</h2>
                <div class="regua" aria-hidden="true"></div>
            </div>
            <div class="planta-baixa">
                ${todasAsSalas
                    .filter(s => s.bloco === bloco)
                    .map(item => item.tipo === 'galpao' ? galpaoParaHtml(item) : salaParaHtml(item))
                    .join('')}
            </div>
        </div>
    `).join('');

    ativarCliques(grid);
}

/* ---------------------------------------------------------
   Renderização — visão de um galpão específico
   --------------------------------------------------------- */

function renderizarGalpao(galpao) {
    const cabecalho = document.getElementById('cabecalho-visao');
    cabecalho.hidden = false;
    document.getElementById('titulo-visao').textContent = galpao.nome;

    const grid = document.getElementById('grid-salas');
    const salas = galpao.salas || [];

    if (salas.length === 0) {
        grid.innerHTML = '<p class="vazio">Nenhuma sala cadastrada neste galpão ainda.</p>';
        return;
    }

    grid.innerHTML = `<div class="planta-baixa">${salas.map(salaParaHtml).join('')}</div>`;

    ativarCliques(grid);
}

function ativarCliques(container) {
    container.querySelectorAll('.sala-mapa').forEach(el => {
        el.addEventListener('click', () => {
            if (el.dataset.tipo === 'galpao') {
                abrirGalpao(el.dataset.id);
            } else {
                abrirModal(el.dataset.id);
            }
        });
    });
}

/* ---------------------------------------------------------
   Cartões
   --------------------------------------------------------- */

function salaParaHtml(sala) {
    const status = sala.estaOcupada ? 'ocupada' : 'livre';
    return `
        <button type="button" class="sala-mapa ${status}" data-id="${sala.id}" data-tipo="sala"
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

function galpaoParaHtml(galpao) {
    const salas = galpao.salas || [];
    const ocupadas = salas.filter(s => s.estaOcupada).length;
    const livres = salas.length - ocupadas;
    return `
        <button type="button" class="sala-mapa galpao" data-id="${galpao.id}" data-tipo="galpao"
                aria-label="Galpão ${escaparHtml(galpao.nome)}, ${salas.length} ambientes">
            <div class="sala-cabecalho">
                <span class="sala-nome">${escaparHtml(galpao.nome)}</span>
                ${iconeSeta()}
            </div>
            <div class="sala-rodape">
                <div class="galpao-contagem">
                    <span><span class="led led--livre"></span>${livres} livres</span>
                    <span><span class="led led--ocupada"></span>${ocupadas} ocupadas</span>
                </div>
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

function iconeSeta() {
    return `
        <svg class="galpao-seta" width="22" height="22" viewBox="0 0 16 16" fill="none">
            <path d="M6 3 L11 8 L6 13" stroke="var(--linha)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
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
    salaEmEdicao = encontrarPorId(id);
    if (!salaEmEdicao || salaEmEdicao.tipo === 'galpao') return;

    const vaiOcupar = !salaEmEdicao.estaOcupada;

    document.getElementById('modal-titulo').textContent =
        (vaiOcupar ? 'Registrar ocupação — ' : 'Liberar acesso — ') + salaEmEdicao.nome;

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
        renderizarVistaAtual();
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