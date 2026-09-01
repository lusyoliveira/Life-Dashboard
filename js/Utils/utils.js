export async function carregarFormulario(caminho) {
    const res = await fetch(caminho);
    return await res.text();
};

export function limparFormulario(formId, camposExtras = []) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.reset();

    camposExtras.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.value = "";
    });
};

export function popularSelect(dados, elemento) {
    const selectElement = document.getElementById(elemento);

    selectElement.options.length = 0; // Limpa o select

    
    dados.forEach(dado => {
        let novaOpcao = new Option(
            dado.Descricao, 
            dado.id         ); 
        selectElement.add(novaOpcao);
    });
};

function carregarPagina(pagina) {
     fetch(pagina)
         .then(response => response.text())
         .then(data => {
             document.getElementById("conteudo").innerHTML = data;
         })
         .catch(error => console.error("Erro ao carregar a página:", error));
};

function abrirMenu() {
    document.getElementById("menuLateral").style.width = "250px";
};

function fecharMenu() {
    document.getElementById("menuLateral").style.width = "0";
};

export async function converterUrlParaBase64(urlImagem) {
    if (!urlImagem || urlImagem.includes("placeholder")) return null;
    
    try {
        // Faz a requisição para buscar os dados binários da imagem no TMDB
        const resposta = await fetch(urlImagem);
        const blob = await resposta.blob();
        
        // Usa o FileReader para ler o Blob e transformar em String Base64
        return new Promise((resolve, reject) => {
            const leitor = new FileReader();
            leitor.onloadend = () => resolve(leitor.result); // Retorna a string Base64 completa
            leitor.onerror = reject;
            leitor.readAsDataURL(blob);
        });
    } catch (erro) {
        console.error("Erro ao converter imagem para binário:", erro);
        return null;
    }
}
 // Cria os botões visuais e adiciona os eventos de clique
export function renderizarControlesPaginacao(containerAlvo, totalPaginas, viewContext) {
    // 1. Remove qualquer barra de paginação antiga de dentro do grid para não duplicar
    const paginacaoAntiga = containerAlvo.querySelector('.paginacao-container');
    if (paginacaoAntiga) {
        paginacaoAntiga.remove();
    }

    if (totalPaginas <= 1) return; // Não desenha se tudo couber em uma única página

    const barraPaginacao = document.createElement('div');
    barraPaginacao.className = 'paginacao-container d-flex justify-content-center align-items-center gap-3 mt-4 w-100';

    // Botão Voltar
    const btnAnterior = document.createElement('button');
    btnAnterior.className = 'btn btn-sm btn-outline-primary';
    btnAnterior.textContent = '◀ Anterior';
    btnAnterior.disabled = viewContext.paginaAtualColecao === 1; // Acessa o contexto recebido
    btnAnterior.addEventListener('click', () => {
        viewContext.paginaAtualColecao--;
        viewContext.carregarListaPessoal(); // Executa o método da View correspondente
    });

    // Indicador numérico (Ex: Página 1 de 5)
    const indicadorPagina = document.createElement('span');
    indicadorPagina.className = 'fw-bold text-muted mx-2';
    indicadorPagina.textContent = `Página ${viewContext.paginaAtualColecao} de ${totalPaginas}`;

    // Botão Avançar
    const btnProximo = document.createElement('button');
    btnProximo.className = 'btn btn-sm btn-outline-primary';
    btnProximo.textContent = 'Próximo ▶';
    btnProximo.disabled = viewContext.paginaAtualColecao === totalPaginas;
    btnProximo.addEventListener('click', () => {
        viewContext.paginaAtualColecao++;
        viewContext.carregarListaPessoal();
    });

    barraPaginacao.appendChild(btnAnterior);
    barraPaginacao.appendChild(indicadorPagina);
    barraPaginacao.appendChild(btnProximo);
    
    // 2. Insere a barra diretamente no final do container de dados
    containerAlvo.appendChild(barraPaginacao);
};

