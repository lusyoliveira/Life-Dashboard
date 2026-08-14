const contentArea = document.getElementById('content-area');

const pageModules = {
    '/pages/home.html': {
        script: '/js/main.js',
        init: 'inicializarHome'
    },

    '/pages/agenda.html': {
        script: '/js/agenda.js',
        init: 'inicializarAgenda'
    },

    '/pages/transacoes.html': {
        script: '/js/transacoes.js',
        init: 'inicializarTransacoes'
    },

    '/pages/catalogo.html': {
        script: '/js/catalogo.js',
        init: 'inicializarCatalogo'
    },

    '/pages/financeiro.html': {
        script: '/js/financeiro.js',
        init: 'inicializarFinanceiro'
    },

    '/pages/estudo.html': {
        script: '/js/estudo.js',
        init: 'inicializarEstudo'
    },

    '/pages/configuracao.html': {
        script: '/js/configuracao.js',
        init: 'inicializarConfiguracao'
    },

    '/pages/login.html': {
        script: '/js/login.js',
        init: 'inicializarLogin'
    }
};


async function carregarModulo(url) {

    const moduloConfig = pageModules[url];

    if (!moduloConfig) {
        return;
    }

    const modulo = await import(moduloConfig.script);

    const inicializar = modulo[moduloConfig.init];

    if (typeof inicializar !== 'function') {
        console.error(
            `Função ${moduloConfig.init} não encontrada em ${moduloConfig.script}`
        );
        return;
    }

    await inicializar();
}


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