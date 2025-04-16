// Função para carregar dados do localStorage
function carregarDados(chave) {
    return JSON.parse(localStorage.getItem(chave)) || [];
}

// Função para salvar dados no localStorage
function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
}

// Função para gerar um ID único
function gerarId(chave) {
    const dados = carregarDados(chave);
    return dados.length ? Math.max(...dados.map(d => d.id)) + 1 : 1;
}

// Função para exibir mensagens visuais
function mostrarMensagem(mensagem, tipo = 'success') {
    const div = document.createElement('div');
    div.className = `alert alert-${tipo} mt-3`;
    div.textContent = mensagem;
    document.querySelector('main').prepend(div);
    setTimeout(() => div.remove(), 3000);
}

// Função para popular um <select> com dados
function popularSelect(selectId, dados, campo) {
    const select = document.getElementById(selectId);
    if (!select) return;
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
        e.preventDefault();

        const estreia = document.getElementById('estreia').value;
        if (new Date(estreia) < new Date().setHours(0, 0, 0, 0)) {
            mostrarMensagem('A data de estreia não pode ser no passado.', 'danger');
            return;
        }

        const duracao = parseInt(document.getElementById('duracao').value);
        if (duracao <= 0 || duracao > 300) {
            mostrarMensagem('Duração deve ser entre 1 e 300 minutos.', 'danger');
            return;
        }

        const filme = {
            id: gerarId('filmes'),
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            genero: document.getElementById('genero').value,
            classificacao: document.getElementById('classificacao').value,
            duracao: duracao,
            estreia: estreia
        };

        const filmes = carregarDados('filmes');
        filmes.push(filme);
        salvarDados('filmes', filmes);

        mostrarMensagem('Filme cadastrado com sucesso!');
        formFilmes.reset();
    });
}

// Lógica do cadastro de salas
if (window.location.pathname.includes('cadastro-salas.html')) {
    const formSalas = document.getElementById('form-salas');

    formSalas.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const capacidade = parseInt(document.getElementById('capacidade').value);

        const salas = carregarDados('salas');
        if (salas.some(s => s.nome === nome)) {
            mostrarMensagem('Já existe uma sala com esse nome.', 'danger');
            return;
        }

        if (capacidade <= 0 || capacidade > 500) {
            mostrarMensagem('Capacidade deve ser entre 1 e 500.', 'danger');
            return;
        }

        const sala = {
            id: gerarId('salas'),
            nome: nome,
            capacidade: capacidade,
            tipo: document.getElementById('tipo').value
        };

        salas.push(sala);
        salvarDados('salas', salas);

        mostrarMensagem('Sala cadastrada com sucesso!');
        formSalas.reset();
    });
}

// Lógica do cadastro de sessões
if (window.location.pathname.includes('cadastro-sessoes.html')) {
    const filmes = carregarDados('filmes');
    const salas = carregarDados('salas');
    popularSelect('filme', filmes, 'titulo');
    popularSelect('sala', salas, 'nome');

    const formSessoes = document.getElementById('form-sessoes');
    formSessoes.addEventListener('submit', (e) => {
        e.preventDefault();

        const dataHora = new Date(document.getElementById('dataHora').value);
        if (dataHora < new Date()) {
            mostrarMensagem('A data e hora não podem ser no passado.', 'danger');
            return;
        }

        const preco = parseFloat(document.getElementById('preco').value);
        if (preco <= 0) {
            mostrarMensagem('O preço deve ser maior que zero.', 'danger');
            return;
        }

        const salaId = document.getElementById('sala').value;
        const sessoes = carregarDados('sessoes');
        const conflito = sessoes.some(s => s.sala == salaId && Math.abs(new Date(s.dataHora) - dataHora) < 3 * 60 * 60 * 1000);
        if (conflito) {
            mostrarMensagem('A sala já está reservada para esse horário.', 'danger');
            return;
        }

        const sala = salas.find(s => s.id == salaId);
        const sessao = {
            id: gerarId('sessoes'),
            filme: document.getElementById('filme').value,
            sala: salaId,
            dataHora: document.getElementById('dataHora').value,
            preco: preco,
            idioma: document.getElementById('idioma').value,
            formato: sala ? sala.tipo : '2D'
        };

        sessoes.push(sessao);
        salvarDados('sessoes', sessoes);

        mostrarMensagem('Sessão cadastrada com sucesso!');
        formSessoes.reset();
    });
}

// Lógica da listagem de sessões
if (window.location.pathname.includes('sessoes.html')) {
    function listarSessoes() {
        const sessoes = carregarDados('sessoes');
        const filmes = carregarDados('filmes');
        const salas = carregarDados('salas');
        const lista = document.getElementById('lista-sessoes');

        lista.innerHTML = '';

        const sessoesFuturas = sessoes.filter(s => new Date(s.dataHora) >= new Date())
            .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));

        if (sessoesFuturas.length === 0) {
            lista.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma sessão disponível.</td></tr>';
            return;
        }

        sessoesFuturas.forEach(sessao => {
            const filme = filmes.find(f => f.id == sessao.filme);
            const sala = salas.find(s => s.id == sessao.sala);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${filme ? filme.titulo : 'Filme não encontrado'}</td>
                <td>${sala ? sala.nome : 'Sala não encontrada'}</td>
                <td>${new Date(sessao.dataHora).toLocaleString('pt-BR')}</td>
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
    document.addEventListener('DOMContentLoaded', () => {
        const filmes = carregarDados('filmes');
        const salas = carregarDados('salas');
        const sessoes = carregarDados('sessoes');
        const selectSessao = document.getElementById('sessao');

        if (selectSessao) {
            selectSessao.innerHTML = '<option value="">Selecione uma sessão</option>';

            const sessoesFuturas = sessoes.filter(s => new Date(s.dataHora) >= new Date());
            sessoesFuturas.forEach(sessao => {
                const filme = filmes.find(f => f.id == sessao.filme);
                const sala = salas.find(s => s.id == sessao.sala);

                if (filme && sala) {
                    const option = document.createElement('option');
                    option.value = sessao.id;
                    option.textContent = `${filme.titulo} - ${sala.nome} - ${new Date(sessao.dataHora).toLocaleString('pt-BR')}`;
                    selectSessao.appendChild(option);
                }
            });

            const urlParams = new URLSearchParams(window.location.search);
            const sessaoId = urlParams.get('sessao');
            if (sessaoId) {
                selectSessao.value = sessaoId;
            }
        }

        const formIngressos = document.getElementById('form-ingressos');
        if (formIngressos) {
            formIngressos.addEventListener('submit', (e) => {
                e.preventDefault();

                const sessaoId = document.getElementById('sessao').value;
                const cpf = document.getElementById('cpf').value;
                const assento = document.getElementById('assento').value;

                if (!/^\d{11}$/.test(cpf)) {
                    mostrarMensagem('CPF inválido. Deve conter 11 dígitos numéricos.', 'danger');
                    return;
                }

                if (!/^[A-Z]\d+$/.test(assento)) {
                    mostrarMensagem('Assento inválido. Use o formato letra+número (ex.: A10).', 'danger');
                    return;
                }

                const ingressos = carregarDados('ingressos');
                const sessoes = carregarDados('sessoes');
                const salas = carregarDados('salas');
                const sessao = sessoes.find(s => s.id == sessaoId);
                const sala = salas.find(s => s.id == sessao.sala);
                const ingressosVendidos = ingressos.filter(i => i.sessao == sessaoId);

                if (ingressosVendidos.some(i => i.assento === assento)) {
                    mostrarMensagem('Este assento já foi vendido.', 'danger');
                    return;
                }

                if (ingressosVendidos.length >= sala.capacidade) {
                    mostrarMensagem('A sala está lotada.', 'danger');
                    return;
                }

                const ingresso = {
                    id: gerarId('ingressos'),
                    sessao: sessaoId,
                    nomeCliente: document.getElementById('nomeCliente').value,
                    cpf: cpf,
                    assento: assento,
                    pagamento: document.getElementById('pagamento').value
                };

                ingressos.push(ingresso);
                salvarDados('ingressos', ingressos);

                mostrarMensagem('Venda confirmada com sucesso!');
                formIngressos.reset();
                window.location.href = 'sessoes.html';
            });
        }
    });
}