export class TiposView {
  constructor(vm) {
    this.vm = vm;
  }
    async editarTipo(idTipo) {
        const tipo = await this.vm.obterTipoPorID(idTipo);

        if (tipo.id) {
            document.getElementById('input-id-tipos').value = idTipo
            document.getElementById('descricao-tipos').value = tipo.Descricao;
        } else {
            alert('Área não encontrada!');
        }
    };

    async renderCardTipos(elementoId,tipo) {
    const tipos = await this.vm.obterTipos(tipo);
    const elementoDestino = document.getElementById(elementoId);
    const botaoTipo = document.getElementById('adiciona-tipo'); 
    const imagemBotao = botaoTipo.querySelector('i');    
   
        if (elementoDestino) {
            elementoDestino.innerHTML = "";
            
            tipos.forEach(tipo => {
                const divTituloContainer = document.createElement('div');
                divTituloContainer.classList.add('d-flex', 'justify-content-between');

                const labelId = document.createElement('label');
                labelId.setAttribute('hidden', 'true');
                labelId.setAttribute('id', 'id-tipo')
                labelId.textContent = tipo.id;

                const li = document.createElement('li');
                li.classList.add('d-flex', 'align-items-center');
                li.textContent = tipo.Descricao;
                
                const divBotoes = document.createElement('div');
                divBotoes.classList.add('d-flex', 'gap-2', 'align-items-center');

                const btnEditar = document.createElement('button')
                btnEditar.classList.add('btn')
                btnEditar.setAttribute('type', 'button')
                btnEditar.setAttribute('id', 'botao-editar-tipo')
                btnEditar.setAttribute('title', 'Editar tipo')
                btnEditar.onclick = async ()  => {
                    this.editarTipo(tipo.id)

                    imagemBotao.classList.remove('bi', 'bi-plus-lg');
                    imagemBotao.classList.add('bi', 'bi-floppy-fill');
                }
        
                const iconeEditar = document.createElement('i')
                iconeEditar.classList.add('bi', 'bi-pencil-fill')
                iconeEditar.setAttribute ('id', 'editar-tipo')

                const btnExcluir = document.createElement('button')
                btnExcluir.classList.add('btn')
                btnExcluir.setAttribute('type', 'button')
                btnExcluir.setAttribute('id', 'botao-excluir-tipo')
                btnExcluir.setAttribute('title', 'Excluir tipo')
                btnExcluir.onclick = async ()  => {                      
                    await this.vm.excluirTipo(tipo.id)
                    await this.renderCardTipos(elementoId);
                }
        
                const iconeExcluir = document.createElement('i')
                iconeExcluir.classList.add('bi', 'bi-trash')
                iconeExcluir.setAttribute ('id', 'excluir-tipo')

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