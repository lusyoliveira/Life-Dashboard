
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
