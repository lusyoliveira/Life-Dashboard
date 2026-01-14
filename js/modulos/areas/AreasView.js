export class AreasView {
  constructor(vm) {
    this.vm = vm;
  }
    async editarArea(idArea) {
        const area = await this.vm.obterAreaPorID(idArea);

        if (area._id) {
            document.getElementById('id-area').value = idArea
            document.getElementById('descricao-area').value = area.Descricao;
        } else {
            alert('Área não encontrada!');
        }
    };

    async renderCardAreas(elementoId) {
    const areas = await this.vm.obterArea();
    const elementoDestino = document.getElementById(elementoId);

        if (elementoDestino) {
            elementoDestino.innerHTML = "";
            
            areas.forEach(area => {
                const divTituloContainer = document.createElement('div');
                divTituloContainer.classList.add('d-flex', 'justify-content-between');

                const li = document.createElement('li');
                li.classList.add('d-flex', 'align-items-center');
                li.textContent = area.Descricao;
                
                const divBotoes = document.createElement('div');
                divBotoes.classList.add('d-flex', 'gap-2', 'align-items-center');

                const btnEditar = document.createElement('button')
                btnEditar.classList.add('btn')
                btnEditar.setAttribute('type', 'button')
                btnEditar.setAttribute('id', 'botao-editar')
                btnEditar.setAttribute('title', 'Editar área')
                btnEditar.onclick = async ()  => {
                    this.editarArea(area._id)
                    
                    imagemBotao.classList.remove('bi', 'bi-plus-lg');
                    imagemBotao.classList.add('bi', 'bi-floppy-fill');
                }
        
                const iconeEditar = document.createElement('i')
                iconeEditar.classList.add('bi', 'bi-pencil-fill')
                iconeEditar.setAttribute ('id', 'editar-tarefa')

                const btnExcluir = document.createElement('button')
                btnExcluir.classList.add('btn')
                btnExcluir.setAttribute('type', 'button')
                btnExcluir.setAttribute('id', 'excluir-editar')
                btnExcluir.setAttribute('title', 'Excluir área')
                btnExcluir.onclick = async ()  => {                      
                    await this.vm.excluirArea(area._id)
                }
        
                const iconeExcluir = document.createElement('i')
                iconeExcluir.classList.add('bi', 'bi-trash')
                iconeExcluir.setAttribute ('id', 'excluir-tarefa')

                btnEditar.appendChild(iconeEditar);
                btnExcluir.appendChild(iconeExcluir);                
                divBotoes.appendChild(btnEditar);
                divBotoes.appendChild(btnExcluir);
                divTituloContainer.appendChild(li);
                divTituloContainer.appendChild(divBotoes);
                elementoDestino.appendChild(divTituloContainer);                
            });  
        }
    }
}