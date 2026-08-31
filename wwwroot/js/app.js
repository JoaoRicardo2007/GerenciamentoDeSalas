/* =========================================================
   SenaiControl — Lógica preservada, apenas ícones ajustados
   para o novo design (Linear/Vercel specs)
   ========================================================= */

const API_URL = '/api/salas';
const INTERVALO_ATUALIZACAO = 10000;

let todasAsSalas = [];
let salaEmEdicao = null;
let emModoDemo = false;

let nivel = 'inicio';
let setorAtivoId = null;
let galpaoAtivoId = null;

const DADOS_DEMONSTRACAO = [
    {
        id: 'setor-galpao', nome: 'Galpão', tipo: 'setor',
        itens: [
            {
                id: 'galpao-manutencao', nome: 'Manutenção', tipo: 'galpao',
                salas: [
                    { id: 'manutencao-a', nome: 'Sala A', estaOcupada: false, docenteAtual: null },
                    { id: 'manutencao-b', nome: 'Sala B', estaOcupada: true, docenteAtual: 'Marcos Silva' },
                    { id: 'manutencao-c', nome: 'Sala C', estaOcupada: false, docenteAtual: null },
                ]
            },
            {
                id: 'galpao-automotiva', nome: 'Automotiva', tipo: 'galpao',
                salas: [
                    { id: 'automotiva-b', nome: 'Sala B', estaOcupada: false, docenteAtual: null },
                    { id: 'automotiva-c', nome: 'Sala C', estaOcupada: true, docenteAtual: 'Ana Cardoso' },
                    { id: 'automotiva-lab', nome: 'Lab Automotiva', estaOcupada: false, docenteAtual: null },
                ]
            }
        ]
    },
    {
        id: 'setor-senailab', nome: 'SenaiLab', tipo: 'setor',
        itens: [
            { id: 'senailab-inovacao', nome: 'Lab Inovação', tipo: 'sala', estaOcupada: false, docenteAtual: null },
            { id: 'senailab-webconf', nome: 'WebConferência', tipo: 'sala', estaOcupada: true, docenteAtual: 'Renato Alves' },
        ]
    },
    {
        id: 'setor-bloco-a', nome: 'Bloco A', tipo: 'setor',
        andares: [
            {
                nome: 'Térreo',
                salas: [
                    { id: 'a-sala-1', nome: 'Sala 1', estaOcupada: false, docenteAtual: null },
                    { id: 'a-sala-2', nome: 'Lab Info', estaOcupada: true, docenteAtual: 'Marcos Silva' },
                ]
            }
        ]
    }
];

function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
}

function iniciarRelogio() {
    const el = document.getElementById('relogio');
    const atualizar = () => { el.textContent = new Date().toLocaleTimeString('pt-BR'); };
    atualizar();
    setInterval(atualizar, 1000);
}

function tipoPadrao(no) {
    if (no.tipo === 'setor' || no.tipo === 'galpao' || no.tipo === 'sala') return no.tipo;
    if (Array.isArray(no.itens) || Array.isArray(no.andares)) return 'setor';
    if (Array.isArray(no.salas)) return 'galpao';
    return 'sala';
}

function construirSetoresAPartirDeListaPlana(lista) {
    const blocos = [...new Set(lista.map(i => i.bloco))];
    return blocos.map(bloco => {
        const itensDoBloco = lista.filter(i => i.bloco === bloco).map(i => ({ ...i, tipo: 'sala' }));
        const pavimentos = [...new Set(itensDoBloco.map(i => i.pavimento).filter(Boolean))];

        const setor = { id: 'setor-' + slugificar(bloco), nome: bloco, tipo: 'setor' };
        if (pavimentos.length > 1) {
            setor.andares = pavimentos.map(pav => ({
                nome: pav,
                salas: itensDoBloco.filter(i => i.pavimento === pav)
            }));
        } else {
            setor.itens = itensDoBloco;
        }
        return setor;
    });
}

function slugificar(texto) {
    return String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function normalizarItens(lista) {
    return (lista || []).map(no => {
        const tipo = tipoPadrao(no);
        if (tipo === 'setor') {
            return {
                ...no, tipo,
                itens: no.itens ? normalizarItens(no.itens) : undefined,
                andares: no.andares ? no.andares.map(a => ({ ...a, salas: normalizarItens(a.salas) })) : undefined,
            };
        }
        if (tipo === 'galpao') {
            return { ...no, tipo, salas: normalizarItens(no.salas || []) };
        }
        return { ...no, tipo: 'sala' };
    });
}

function encontrarPorId(id, lista = todasAsSalas) {
    for (const no of lista) {
        if (String(no.id) === String(id)) return no;
        if (no.itens) { const achado = encontrarPorId(id, no.itens); if (achado) return achado; }
        if (no.salas) { const achado = encontrarPorId(id, no.salas); if (achado) return achado; }
        if (no.andares) {
            for (const andar of no.andares) {
                const achado = encontrarPorId(id, andar.salas);
                if (achado) return achado;
            }
        }
    }
    return null;
}

function todasSalasFlat(lista = todasAsSalas) {
    let resultado = [];
    for (const no of lista) {
        if (no.itens) resultado = resultado.concat(todasSalasFlat(no.itens));
        else if (no.salas) resultado = resultado.concat(todasSalasFlat(no.salas));
        else if (no.andares) no.andares.forEach(a => { resultado = resultado.concat(a.salas); });
        else resultado.push(no);
    }
    return resultado;
}

async function carregarSalas() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('API Offline');
        const dados = await res.json();
        const jaEhHierarquica = Array.isArray(dados) && dados.some(
            i => i && (i.tipo === 'setor' || Array.isArray(i.itens) || Array.isArray(i.andares) || Array.isArray(i.salas))
        );
        todasAsSalas = normalizarItens(jaEhHierarquica ? dados : construirSetoresAPartirDeListaPlana(dados));
        emModoDemo = false;
        document.getElementById('aviso-demo').hidden = true;
    } catch (err) {
        todasAsSalas = emModoDemo ? todasAsSalas : normalizarItens(DADOS_DEMONSTRACAO);
        emModoDemo = true;
        document.getElementById('aviso-demo').hidden = false;
    }
    renderizarVistaAtual();
}

function renderizarVistaAtual() {
    atualizarContadores(todasSalasFlat());

    if (nivel === 'galpao') {
        const setor = encontrarPorId(setorAtivoId);
        const galpao = encontrarPorId(galpaoAtivoId);
        if (setor && galpao && galpao.tipo === 'galpao') return renderizarGalpao(setor, galpao);
        nivel = 'setor'; galpaoAtivoId = null;
    }

    if (nivel === 'setor') {
        const setor = encontrarPorId(setorAtivoId);
        if (setor && setor.tipo === 'setor') return renderizarSetor(setor);
        nivel = 'inicio'; setorAtivoId = null;
    }

    renderizarInicio();
}

function abrirSetor(id) {
    const setor = encontrarPorId(id);
    if (!setor || setor.tipo !== 'setor') return;
    nivel = 'setor'; setorAtivoId = id; galpaoAtivoId = null;
    renderizarVistaAtual();
}

function abrirGalpaoDoSetor(id) {
    const galpao = encontrarPorId(id);
    if (!galpao || galpao.tipo !== 'galpao') return;
    nivel = 'galpao'; galpaoAtivoId = id;
    renderizarVistaAtual();
}

function voltar() {
    if (nivel === 'galpao') { nivel = 'setor'; galpaoAtivoId = null; } 
    else if (nivel === 'setor') { nivel = 'inicio'; setorAtivoId = null; }
    renderizarVistaAtual();
}

function renderizarInicio() {
    document.getElementById('cabecalho-visao').hidden = true;
    const grid = document.getElementById('grid-salas');
    if (todasAsSalas.length === 0) {
        grid.innerHTML = '<p class="vazio">Nenhum ambiente cadastrado.</p>';
        return;
    }
    grid.innerHTML = `<div class="planta-baixa">${todasAsSalas.map(no => {
        if (no.tipo === 'setor') return setorParaHtml(no);
        if (no.tipo === 'galpao') return galpaoParaHtml(no);
        return salaParaHtml(no);
    }).join('')}</div>`;
    ativarCliques(grid);
}

function renderizarSetor(setor) {
    const cabecalho = document.getElementById('cabecalho-visao');
    cabecalho.hidden = false;
    document.getElementById('titulo-visao').textContent = setor.nome;
    document.getElementById('btn-voltar-texto').textContent = 'Início';

    const grid = document.getElementById('grid-salas');
    if (Array.isArray(setor.andares)) {
        grid.innerHTML = setor.andares.map(andar => `
            <div class="bloco-container">
                <header class="titulo-bloco">
                    <h2>${escaparHtml(andar.nome)}</h2>
                </header>
                <div class="planta-baixa">
                    ${(andar.salas || []).map(salaParaHtml).join('')}
                </div>
            </div>
        `).join('');
        ativarCliques(grid);
        return;
    }

    const itens = setor.itens || [];
    if (itens.length === 0) {
        grid.innerHTML = '<p class="vazio">Nenhum ambiente cadastrado.</p>';
        return;
    }
    grid.innerHTML = `<div class="planta-baixa">${itens.map(item => item.tipo === 'galpao' ? galpaoParaHtml(item) : salaParaHtml(item)).join('')}</div>`;
    ativarCliques(grid);
}

function renderizarGalpao(setor, galpao) {
    const cabecalho = document.getElementById('cabecalho-visao');
    cabecalho.hidden = false;
    document.getElementById('titulo-visao').textContent = galpao.nome;
    document.getElementById('btn-voltar-texto').textContent = setor.nome;

    const grid = document.getElementById('grid-salas');
    const salas = galpao.salas || [];
    if (salas.length === 0) {
        grid.innerHTML = '<p class="vazio">Nenhuma sala cadastrada.</p>';
        return;
    }
    grid.innerHTML = `<div class="planta-baixa">${salas.map(salaParaHtml).join('')}</div>`;
    ativarCliques(grid);
}

function ativarCliques(container) {
    container.querySelectorAll('.sala-mapa').forEach(el => {
        el.addEventListener('click', () => {
            const id = el.dataset.id;
            if (el.dataset.tipo === 'setor') abrirSetor(id);
            else if (el.dataset.tipo === 'galpao') abrirGalpaoDoSetor(id);
            else abrirModal(id);
        });
    });
}

function salaParaHtml(sala) {
    const status = sala.estaOcupada ? 'ocupada' : 'livre';
    return `
        <button type="button" class="sala-mapa ${status}" data-id="${sala.id}" data-tipo="sala">
            <div class="sala-cabecalho">
                <span class="sala-nome">${escaparHtml(sala.nome)}</span>
                ${iconePorta()}
            </div>
            <div class="sala-rodape">
                <span class="sala-status">
                    <span class="led led--${status}"></span>
                    ${sala.estaOcupada ? 'Ocupada' : 'Livre'}
                </span>
                ${sala.estaOcupada && sala.docenteAtual ? `<span class="sala-docente">${escaparHtml(sala.docenteAtual)}</span>` : ''}
            </div>
        </button>
    `;
}

function galpaoParaHtml(galpao) {
    const salas = galpao.salas || [];
    const ocupadas = salas.filter(s => s.estaOcupada).length;
    const livres = salas.length - ocupadas;
    return `
        <button type="button" class="sala-mapa galpao" data-id="${galpao.id}" data-tipo="galpao">
            <div class="sala-cabecalho">
                <span class="sala-nome">${escaparHtml(galpao.nome)}</span>
                ${iconeSeta()}
            </div>
            <div class="sala-rodape">
                <div class="galpao-contagem">
                    <span><span class="led led--livre"></span>${livres}</span>
                    <span><span class="led led--ocupada"></span>${ocupadas}</span>
                </div>
            </div>
        </button>
    `;
}

function setorParaHtml(setor) {
    const salas = todasSalasFlat([setor]);
    const ocupadas = salas.filter(s => s.estaOcupada).length;
    const livres = salas.length - ocupadas;
    return `
        <button type="button" class="sala-mapa galpao setor" data-id="${setor.id}" data-tipo="setor">
            <div class="sala-cabecalho">
                <span class="sala-nome">${escaparHtml(setor.nome)}</span>
                ${iconeSeta()}
            </div>
            <div class="sala-rodape">
                <div class="galpao-contagem">
                    <span><span class="led led--livre"></span>${livres}</span>
                    <span><span class="led led--ocupada"></span>${ocupadas}</span>
                </div>
            </div>
        </button>
    `;
}

// Ícones minimalistas (Feather icons style)
function iconePorta() {
    return `
        <svg class="sala-porta" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
    `;
}

function iconeSeta() {
    return `
        <svg class="galpao-seta" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    `;
}

function atualizarContadores(salas) {
    document.getElementById('contagem-livre').textContent = salas.filter(s => !s.estaOcupada).length;
    document.getElementById('contagem-ocupada').textContent = salas.filter(s => s.estaOcupada).length;
}

function abrirModal(id) {
    salaEmEdicao = encontrarPorId(id);
    if (!salaEmEdicao || salaEmEdicao.tipo !== 'sala') return;

    const vaiOcupar = !salaEmEdicao.estaOcupada;

    document.getElementById('modal-titulo').textContent = (vaiOcupar ? 'Registrar ocupação' : 'Liberar acesso');
    document.getElementById('modal-sub').textContent = vaiOcupar
        ? salaEmEdicao.nome
        : `Atualmente com ${salaEmEdicao.docenteAtual || 'N/I'}`;

    document.getElementById('campo-docente').hidden = !vaiOcupar;
    document.getElementById('input-docente').value = '';
    document.getElementById('input-senha').value = '';
    document.getElementById('modal-confirmar').textContent = vaiOcupar ? 'Confirmar Ocupação' : 'Liberar Sala';
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

    if (!senha) return mostrarErroModal('Autenticação necessária.');
    if (vaiOcupar && !docente) return mostrarErroModal('Informe o docente.');

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
    botao.textContent = 'Aguarde...';

    try {
        const res = await fetch(`${API_URL}/${salaEmEdicao.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const erro = await res.json().catch(() => ({}));
            mostrarErroModal(erro.message || `Falha na autenticação (Erro ${res.status}).`);
            return;
        }
        fecharModal();
        carregarSalas();
    } catch (err) {
        mostrarErroModal('Erro de conexão com o servidor.');
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

iniciarRelogio();
carregarSalas();
setInterval(carregarSalas, INTERVALO_ATUALIZACAO);