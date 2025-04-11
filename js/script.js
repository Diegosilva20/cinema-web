// Função para carregar dados do localStorage
function carregarDados(chave) {
    return JSON.parse(localStorage.getItem(chave)) || [];
}

// Função para salvar dados no localStorage
function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
}

// Função para gerar um ID único
function gerarId() {
    return Date.now();
}

// Função para popular um <select> com dados
function popularSelect(selectId, dados, campo) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Selecione</option>';
    dados.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item[campo];
        select.appendChild(option);
    });
}

// Lógica do cadastro de filmes
if (window.location.pathname.includes('cadastro-filmes.html')) {
    const formFilmes = document.getElementById('form-filmes');
    
    formFilmes.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Captura os valores do formulário
        const filme = {
            id: gerarId(),
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            genero: document.getElementById('genero').value,
            classificacao: document.getElementById('classificacao').value,
            duracao: document.getElementById('duracao').value,
            estreia: document.getElementById('estreia').value
        };

        // Carrega os filmes existentes e adiciona o novo
        const filmes = carregarDados('filmes');
        filmes.push(filme);
        salvarDados('filmes', filmes);

        // Feedback ao usuário e limpa o formulário
        alert('Filme cadastrado com sucesso!');
        formFilmes.reset();
    });
}

// Lógica do cadastro de salas
if (window.location.pathname.includes('cadastro-salas.html')) {
    const formSalas = document.getElementById('form-salas');

    formSalas.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Captura os valores do formulário
        const sala = {
            id: gerarId(),
            nome: document.getElementById('nome').value,
            capacidade: document.getElementById('capacidade').value,
            tipo: document.getElementById('tipo').value
        };

        // Carrega as salas existentes e adiciona a nova
        const salas = carregarDados('salas');
        salas.push(sala);
        salvarDados('salas', salas);

        // Feedback ao usuário e limpa o formulário
        alert('Sala cadastrada com sucesso!');
        formSalas.reset();
    });
}

// Lógica do cadastro de sessões
if (window.location.pathname.includes('cadastro-sessoes.html')) {
    // Carrega filmes e salas ao abrir a página
    const filmes = carregarDados('filmes');
    const salas = carregarDados('salas');
    popularSelect('filme', filmes, 'titulo');
    popularSelect('sala', salas, 'nome');

    const formSessoes = document.getElementById('form-sessoes');
    formSessoes.addEventListener('submit', (e) => {
        e.preventDefault();

        const sessao = {
            id: gerarId(),
            filme: document.getElementById('filme').value,
            sala: document.getElementById('sala').value,
            dataHora: document.getElementById('dataHora').value,
            preco: document.getElementById('preco').value,
            idioma: document.getElementById('idioma').value,
            formato: document.getElementById('formato').value
        };

        const sessoes = carregarDados('sessoes');
        sessoes.push(sessao);
        salvarDados('sessoes', sessoes);

        alert('Sessão cadastrada com sucesso!');
        formSessoes.reset();
    });
}

if (window.location.pathname.includes('sessoes.html')) {
    function listarSessoes() {
        const sessoes = carregarDados('sessoes');
        const filmes = carregarDados('filmes');
        const salas = carregarDados('salas');
        const lista = document.getElementById('lista-sessoes');

        lista.innerHTML = '';

        if (sessoes.length === 0) {
            lista.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma sessão disponível.</td></tr>';
            return;
        }

        sessoes.forEach(sessao => {
            const filme = filmes.find(f => f.id == sessao.filme);
            const sala = salas.find(s => s.id == sessao.sala);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${filme ? filme.titulo : 'Filme não encontrado'}</td>
                <td>${sala ? sala.nome : 'Sala não encontrada'}</td>
                <td>${new Date(sessao.dataHora).toLocaleString()}</td>
                <td>R$${parseFloat(sessao.preco).toFixed(2)}</td>
                <td><a href="venda-ingressos.html?sessao=${sessao.id}" class="btn btn-primary btn-sm">Comprar</a></td>
            `;
            lista.appendChild(tr);
        });
    }

    listarSessoes();
}

// Lógica da venda de ingressos
if (window.location.pathname.includes('venda-ingressos.html')) {
    const filmes = carregarDados('filmes');
    const salas = carregarDados('salas');
    const sessoes = carregarDados('sessoes');
    const selectSessao = document.getElementById('sessao');

    // Popula o <select> com sessões
    selectSessao.innerHTML = '<option value="">Selecione uma sessão</option>';
    sessoes.forEach(sessao => {
        const filme = filmes.find(f => f.id == sessao.filme);
        const sala = salas.find(s => s.id == sessao.sala);
        const option = document.createElement('option');
        option.value = sessao.id;
        option.textContent = `${filme ? filme.titulo : 'Filme não encontrado'} - ${sala ? sala.nome : 'Sala não encontrada'} - ${new Date(sessao.dataHora).toLocaleString()}`;
        selectSessao.appendChild(option);
    });

    // Pré-seleciona a sessão da URL, se houver
    const urlParams = new URLSearchParams(window.location.search);
    const sessaoId = urlParams.get('sessao');
    if (sessaoId) {
        selectSessao.value = sessaoId;
    }

    // Lógica de envio do formulário
    const formIngressos = document.getElementById('form-ingressos');
    formIngressos.addEventListener('submit', (e) => {
        e.preventDefault();

        const ingresso = {
            id: gerarId(),
            sessao: document.getElementById('sessao').value,
            nomeCliente: document.getElementById('nomeCliente').value,
            cpf: document.getElementById('cpf').value,
            assento: document.getElementById('assento').value,
            pagamento: document.getElementById('pagamento').value
        };

        const ingressos = carregarDados('ingressos');
        ingressos.push(ingresso);
        salvarDados('ingressos', ingressos);

        alert('Venda confirmada com sucesso!');
        formIngressos.reset();

        // Redireciona de volta para a listagem após a venda
        window.location.href = 'sessoes.html';
    });
}