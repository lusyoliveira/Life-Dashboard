const contentArea = document.getElementById('content-area');

// 1. Alterado: Agora mapeamos direto a função que importa o arquivo
const pageModules = {
    '/pages/home.html': {
        importar: () => import('/js/main.js'),
        init: 'inicializarHome'
    },
    '/pages/agenda.html': {
        importar: () => import('/js/agenda.js'),
        init: 'inicializarAgenda'
    },
    '/pages/transacoes.html': {
        importar: () => import('/js/transacao.js'),
        init: 'inicializarTransacao'
    },
    '/pages/catalogo.html': {
        importar: () => import('/js/catalogo.js'),
        init: 'inicializarCatalogo'
    },
    '/pages/financeiro.html': {
        importar: () => import('/js/financeiro.js'),
        init: 'inicializarFinanceiro'
    },
    '/pages/estudo.html': {
        importar: () => import('/js/estudo.js'),
        init: 'inicializarEstudo'
    },
    '/pages/configuracoes.html': {
        importar: () => import('/js/configuracao.js'),
        init: 'inicializarConfiguracao'
    },
    '/pages/login.html': {
        importar: () => import('/js/login.js'),
        init: 'inicializarLogin'
    }
};

async function carregarModulo(url) {
    const moduloConfig = pageModules[url];

    if (!moduloConfig) {
        return;
    }

    // 2. Alterado: Executa a função mapeada acima
    const modulo = await moduloConfig.importar();

    const inicializar = modulo[moduloConfig.init];

    if (typeof inicializar !== 'function') {
        console.error(
            `Função ${moduloConfig.init} não encontrada no módulo.`
        );
        return;
    }

    await inicializar();
};


async function navigateTo(url, addHistory = true) {

    try {

        if (url === '/' || url === '/index.html') {
            url = '/pages/home.html';
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Página não encontrada: ${url}`);
        }

        const html = await response.text();

        contentArea.innerHTML = html;

        if (addHistory) {
            window.history.pushState({}, '', url);
        }

        await carregarModulo(url);

    } catch (error) {

        console.error(error);

        contentArea.innerHTML = `
            <div class="alert alert-danger">
                <h4>Erro ao carregar página</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
}


document.addEventListener('click', event => {

    const link = event.target.closest('[data-link]');

    if (!link) {
        return;
    }

    event.preventDefault();

    const url = link.getAttribute('href');

    if (!url || url === '#') {
        return;
    }

    navigateTo(url);
});


window.addEventListener('popstate', () => {

    let url = window.location.pathname;

    if (url === '/' || url === '/index.html') {
        url = '/pages/home.html';
    }

    navigateTo(url, false);
});


document.addEventListener('DOMContentLoaded', () => {

    let url = window.location.pathname;

    if (url === '/' || url === '/index.html') {
        url = '/pages/home.html';
    }

    navigateTo(url, false);
});

function normalizarRota(url) {

    if (url === '/' || url === '/index.html') {
        return '/pages/home.html';
    }

    return url;
}