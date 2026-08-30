const API_URL = '/api/salas';

async function carregarSalas() {
    try {
        const res = await fetch(API_URL);
        const salas = await res.json();
        renderizarSalas(salas);
    } catch (err) {
        console.error("Erro ao carregar salas:", err);
    }
}

function renderizarSalas(salas) {
    const grid = document.getElementById('grid-salas');
    grid.innerHTML = salas.map(sala => `
        <div class="card-sala ${sala.estaOcupada ? 'ocupada' : ''}">
            <h3>${sala.nome}</h3>
            <div class="info">
                <p><strong>Bloco:</strong> ${sala.bloco} | ${sala.pavimento}</p>
                <p><strong>Status:</strong> ${sala.estaOcupada ? 'OCUPADA' : 'LIVRE'}</p>
                ${sala.estaOcupada ? `<p><strong>Prof:</strong> ${sala.docenteAtual}</p>` : ''}
            </div>
            <button class="btn-acao ${sala.estaOcupada ? 'btn-liberar' : ''}" 
                    onclick="gerenciarStatus(${sala.id}, ${sala.estaOcupada})">
                ${sala.estaOcupada ? 'Liberar Sala' : 'Ocupar Sala'}
            </button>
        </div>
    `).join('');
}

async function gerenciarStatus(id, estaOcupada) {
    const senha = prompt("Digite a senha de acesso:");
    if (!senha) return;

    let docente = null;
    if (!estaOcupada) {
        docente = prompt("Nome do Docente:");
        if (!docente) return;
    }

    const payload = {
        senha: senha,
        docenteAtual: docente,
        ocupar: !estaOcupada
    };

    const res = await fetch(`${API_URL}/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert("Sucesso!");
        carregarSalas();
    } else {
        const erro = await res.json();
        alert("Erro: " + erro.message);
    }
}

// Inicialização
carregarSalas();
// Atualiza a cada 10 segundos para efeito de tempo real
setInterval(carregarSalas, 10000);