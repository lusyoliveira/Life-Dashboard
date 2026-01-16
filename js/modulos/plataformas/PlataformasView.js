export class PlataformasView {
  constructor(vm) {
    this.vm = vm;
  }
    async editarPlataforma(idPlataforma) {
        const plataforma = await this.vm.obterPlataformaPorID(idPlataforma);

        if (plataforma.id) {
            document.getElementById('input-id-plataformas').value = idPlataforma
            document.getElementById('descricao-plataformas').value = plataforma.Descricao;
        } else {
            alert('Plataforma não encontrada!');
        }
    };

    async renderCardPlataformas(elementoId, tipo) {
    const plataformas = await this.vm.obterPlataforma(tipo);
    const elementoDestino = document.getElementById(elementoId);
    const botaoPlataforma = document.getElementById('adiciona-plataforma'); 
    const imagemBotao = botaoPlataforma.querySelector('i');    

        if (elementoDestino) {
            elementoDestino.innerHTML = "";
            
            plataformas.forEach(plataforma => {
                const divTituloContainer = document.createElement('div');
                divTituloContainer.classList.add('d-flex', 'justify-content-between');

                const labelId = document.createElement('label');
                labelId.setAttribute('hidden', 'true');
                labelId.setAttribute('id', 'id-plataforma')
                labelId.textContent = plataforma.id;

                const li = document.createElement('li');
                li.classList.add('d-flex', 'align-items-center');
                li.textContent = plataforma.Descricao;
                
                const divBotoes = document.createElement('div');
                divBotoes.classList.add('d-flex', 'gap-2', 'align-items-center');

                const btnEditar = document.createElement('button')
                btnEditar.classList.add('btn')
                btnEditar.setAttribute('type', 'button')
                btnEditar.setAttribute('id', 'botao-editar-plataforma')
                btnEditar.setAttribute('title', 'Editar plataforma')
                btnEditar.onclick = async ()  => {
                    this.editarPlataforma(plataforma.id)

                    imagemBotao.classList.remove('bi', 'bi-plus-lg');
                    imagemBotao.classList.add('bi', 'bi-floppy-fill');
                }
        
                const iconeEditar = document.createElement('i')
                iconeEditar.classList.add('bi', 'bi-pencil-fill')
                iconeEditar.setAttribute ('id', 'editar-plataforma')

                const btnExcluir = document.createElement('button')
                btnExcluir.classList.add('btn')
                btnExcluir.setAttribute('type', 'button')
                btnExcluir.setAttribute('id', 'botao-excluir-plataforma')
                btnExcluir.setAttribute('title', 'Excluir plataforma')
                btnExcluir.onclick = async ()  => {                      
                    await this.vm.excluirPlataforma(plataforma.id)
                    await this.renderCardPlataformas(elementoId);
                }
        
                const iconeExcluir = document.createElement('i')
                iconeExcluir.classList.add('bi', 'bi-trash')
                iconeExcluir.setAttribute ('id', 'excluir-plataforma')

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