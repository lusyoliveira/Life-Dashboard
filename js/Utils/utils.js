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
//    try {
//         const urlPosterOficial = urlImagem;

//         // Faz o download binário do poster pelo backend
//         const respostaImagem = await fetch(urlPosterOficial);
//         if (!respostaImagem.ok) throw new Error(`Falha ao baixar imagem do poster: HTTP ${respostaImagem.status}`);
        
//         const arrayBuffer = await respostaImagem.arrayBuffer();
//         const bufferImagem = Buffer.from(arrayBuffer);

//         return bufferImagem;

//     } catch (erro) {
//         console.error(`⚠️ Pôster não localizado no TMDB para: ${urlImagem}`);
//         return null;
//     }
//if (!urlImagem || urlImagem.includes("placeholder")) return null;

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Permite extrair os dados via Canvas
        
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // Retorna a string Base64 (image/jpeg ou image/png)
            const dataURL = canvas.toDataURL("image/jpeg");
            resolve(dataURL);
        };

        img.onerror = (erro) => {
            console.error("Erro ao carregar a imagem no Canvas:", erro);
            resolve(null);
        };

        img.src = urlImagem;
    });
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


