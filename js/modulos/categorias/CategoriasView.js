export class CategoriasView {
  constructor(vm) {
    this.vm = vm;
  }
    async editarCategoria(idCategoria) {
        const categoria = await this.vm.obterCategoriaPorID(idCategoria);

        if (categoria.id) {
            document.getElementById('input-id-categoria').value = idCategoria
            document.getElementById('descricao-categoria').value = categoria.Descricao;
        } else {
            alert('Categoria não encontrada!');
        }
    };

    async renderCardCategorias(elementoId,tipo) {
    const categorias = await this.vm.obterCategoria(tipo);
    const elementoDestino = document.getElementById(elementoId);
    const botaoCategoria = document.getElementById('adiciona-categoria'); 
    const imagemBotao = botaoCategoria.querySelector('i');    

        if (elementoDestino) {
            elementoDestino.innerHTML = "";
            
            categorias.forEach(categoria => {
                const divTituloContainer = document.createElement('div');
                divTituloContainer.classList.add('d-flex', 'justify-content-between');

                const labelId = document.createElement('label');
                labelId.setAttribute('hidden', 'true');
                labelId.setAttribute('id', 'id-categoria')
                labelId.textContent = categoria.id;

                const li = document.createElement('li');
                li.classList.add('d-flex', 'align-items-center');
                li.textContent = categoria.Descricao;
                
                const divBotoes = document.createElement('div');
                divBotoes.classList.add('d-flex', 'gap-2', 'align-items-center');

                const btnEditar = document.createElement('button')
                btnEditar.classList.add('btn')
                btnEditar.setAttribute('type', 'button')
                btnEditar.setAttribute('id', 'botao-editar-categoria')
                btnEditar.setAttribute('title', 'Editar categoria')
                btnEditar.onclick = async ()  => {
                    this.editarCategoria(categoria.id)

                    imagemBotao.classList.remove('bi', 'bi-plus-lg');
                    imagemBotao.classList.add('bi', 'bi-floppy-fill');
                }
        
                const iconeEditar = document.createElement('i')
                iconeEditar.classList.add('bi', 'bi-pencil-fill')
                iconeEditar.setAttribute ('id', 'editar-categoria')

                const btnExcluir = document.createElement('button')
                btnExcluir.classList.add('btn')
                btnExcluir.setAttribute('type', 'button')
                btnExcluir.setAttribute('id', 'botao-excluir-categoria')
                btnExcluir.setAttribute('title', 'Excluir categoria')
                btnExcluir.onclick = async ()  => {                      
                    await this.vm.excluirCategoria(categoria.id)
                    await this.renderCardCategorias(elementoId);
                }
        
                const iconeExcluir = document.createElement('i')
                iconeExcluir.classList.add('bi', 'bi-trash')
                iconeExcluir.setAttribute ('id', 'excluir-categoria')

                btnEditar.appendChild(iconeEditar);
                btnExcluir.appendChild(iconeExcluir);                
                divBotoes.appendChild(btnEditar);
                divBotoes.appendChild(btnExcluir);
                divTituloContainer.appendChild(labelId);
                divTituloContainer.appendChild(li);
                divTituloContainer.appendChild(divBotoes);                
                elementoDestino.appendChild(divTituloContainer);                
            });  
        }
    }
}