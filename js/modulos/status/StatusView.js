export class StatusView {
  constructor(vm) {
    this.vm = vm;
  }
    async editarStatus(idStatus) {
        const status = await this.vm.obterStatusPorID(idStatus);

        if (status.id) {
            document.getElementById('input-id-status').value = idStatus
            document.getElementById('descricao-status').value = status.Descricao;
        } else {
            alert('Área não encontrada!');
        }
    };

    async renderCardStatus(elementoId,tipo) {
        const status = await this.vm.obterStatus(tipo);
        const elementoDestino = document.getElementById(elementoId);
        const botaoStatus = document.getElementById('adiciona-status'); 
        const imagemBotao = botaoStatus.querySelector('i');    

        if (elementoDestino) {
            elementoDestino.innerHTML = "";
            
            status.forEach(status => {
                const divTituloContainer = document.createElement('div');
                divTituloContainer.classList.add('d-flex', 'justify-content-between');

                const labelId = document.createElement('label');
                labelId.setAttribute('hidden', 'true');
                labelId.setAttribute('id', 'id-status')
                labelId.textContent = status.id;

                const li = document.createElement('li');
                li.classList.add('d-flex', 'align-items-center');
                li.textContent = status.Descricao;
                
                const divBotoes = document.createElement('div');
                divBotoes.classList.add('d-flex', 'gap-2', 'align-items-center');

                const btnEditar = document.createElement('button')
                btnEditar.classList.add('btn')
                btnEditar.setAttribute('type', 'button')
                btnEditar.setAttribute('id', 'botao-editar-status')
                btnEditar.setAttribute('title', 'Editar status')
                btnEditar.onclick = async ()  => {
                    this.editarStatus(status.id)

                    imagemBotao.classList.remove('bi', 'bi-plus-lg');
                    imagemBotao.classList.add('bi', 'bi-floppy-fill');
                }
        
                const iconeEditar = document.createElement('i')
                iconeEditar.classList.add('bi', 'bi-pencil-fill')
                iconeEditar.setAttribute ('id', 'editar-status')

                const btnExcluir = document.createElement('button')
                btnExcluir.classList.add('btn')
                btnExcluir.setAttribute('type', 'button')
                btnExcluir.setAttribute('id', 'botao-excluir-status')
                btnExcluir.setAttribute('title', 'Excluir status')
                btnExcluir.onclick = async ()  => {                      
                    await this.vm.excluirStatus(status.id)
                    await this.renderCardStatus(elementoId);
                }
        
                const iconeExcluir = document.createElement('i')
                iconeExcluir.classList.add('bi', 'bi-trash')
                iconeExcluir.setAttribute ('id', 'excluir-status')

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