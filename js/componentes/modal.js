const resposta = await fetch("modalTarefa.html");
const html = await resposta.text();

const modal = document.createElement('div')
modal.classList.add('modal');
modal.id = 'modal'
modal.innerHTML = html;
document.body.appendChild(modal);


function FecharModal() {   
    modal.style.display = "block";
}

function modal(body, titulo) {
    const modalDialog = document.createElement('div')
    modalDialog.classList.add('modal-dialog')

    const modalContent = document.createElement('div')
    modalContent.classList.add('modal-content')
    
    const modalHeader = document.createElement('div')
    modalHeader.classList.add('modal-header')

    const modalTitulo = document.createElement('h1')
    modalTitulo.classList.add('modal-title', 'fs-5')
    modalTitulo.id = 'titulo-modal'
    modalTitulo.textContent = titulo

    const btnFechar = document.createElement('button')
    btnFechar.classList.add('btn-close')
    btnFechar.onclick = () => this.FecharModal()
    
    const modalFooter = document.createElement('div')
    modalFooter.classList.add('modal-footer')

    const btnCancelar = document.createElement('button')
    btnCancelar.classList.add('btn', 'btn-secondary')
    btnCancelar.id = 'btn-cancelar'
    btnCancelar.onclick = () => this.FecharModal()

    const btnSalvar = document.createElement('button')
    btnSalvar.classList.add('btn', 'btn-primary')

    modalFooter.appendChild(btnCancelar)
    modalFooter.appendChild(btnSalvar)
    modalContent.appendChild(modalHeader)
    modalContent.appendChild(body)
    modalContent.appendChild(modalFooter)
    modalDialog.appendChild(modalContent)
}
    
function modalAdicionaTarefas() {
    const modalBody = document.createElement('div')
    modalBody.classList.add('modal-body')
    modalBody.innerHTML = `
        <form>
            <div class="mb-3">
                <label for="Titulo" class="col-form-label">Titulo:</label>
                <input type="text" class="form-control" id="Titulo">
            </div>
            
            <div class="row">
                <div class="col">
                    <label for="Data" class="col-form-label">Data:</label>
                    <input type="text" class="form-control" id="Data">
                </div>
                <div class="col">
                    <label for="Categoria" class="col-form-label">Categoria:</label>
                    <select type="text" class="form-select" id="Categoria">
                        <option value="1">Loja</option>
                        <option value="2">Casa</option>
                        <option value="3">Pessoal</option>
                        <option value="4">Educação</option>
                        <option value="5">Financeiro</option>
                        <option value="6">Data Importante</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <label for="Tipo" class="col-form-label">Tipo:</label>
                    <select type="text" class="form-select" id="Tipo">
                        <option value="1">Evento</option>
                        <option value="2">Compromisso</option>
                        <option value="3">Tarefa</option>
                    </select>
                </div>
                <div class="col">
                    <label for="Status" class="col-form-label">Status:</label>
                    <select type="text" class="form-select" id="Status">
                        <option value="1">Em Espera</option>
                        <option value="2">Fazendo</option>
                        <option value="3">Feito</option>
                        <option value="4">Pausado</option>
                        <option value="5">Cancelado</option>
                        <option value="6">Indeterminado</option>
                    </select>
                </div>
            </div>
            </form>
    `
    return modalBody
}