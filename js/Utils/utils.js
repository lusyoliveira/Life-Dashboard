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

export function bufferParaBase64(poster) {
    if (!poster) return null;

    let bytes = null;

    if (
        typeof poster === 'object' &&
        poster.data &&
        Array.isArray(poster.data)
    ) {
        bytes = new Uint8Array(poster.data);
    } else if (poster instanceof Uint8Array) {
        bytes = poster;
    } else {
        return typeof poster === 'string'
            ? poster
            : null;
    }

    let binary = '';

    const tamanhoBloco = 8192;

    for (let i = 0; i < bytes.length; i += tamanhoBloco) {
        const bloco = bytes.subarray(
            i,
            Math.min(i + tamanhoBloco, bytes.length)
        );

        binary += String.fromCharCode(...bloco);
    }

    return btoa(binary);
};


