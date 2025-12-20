export class TarefasView {
    constructor(vm) {
        this.vm = vm;
    }

    async editarTarefa(idTarefa) {
        const tarefa = await this.vm.obterTarefaPorID(idTarefa);
     
        if (tarefa._id) {
            document.getElementById('id-tarefa').value = idTarefa
            document.getElementById('descricao-tarefa').value = tarefa.Tarefa;
        } else {
            alert('Tarefa não encontrada!');
        }
    };

    async listarTarefas(elementoId) {
        const liTarefa = document.getElementById(elementoId) //('lista-tarefa');
        const tarefas = await this.vm.obterTarefas();
        const botaoTarefa = document.getElementById('adiciona-tarefa');
        const imagemBotao = botaoTarefa.querySelector('i');      

        if (!liTarefa) return;

        liTarefa.innerHTML = "";

        if (tarefas.length >= 1) {
            tarefas.forEach(tarefa => {
                const labelTarefa = document.createElement('label');
                labelTarefa.classList.add('list-group-item', 'd-flex', 'flex-column');

                const divTarefa = document.createElement('div');
                divTarefa.classList.add('d-flex', 'gap-3', 'align-items-center');

                const checkTarefa = document.createElement('input');
                if (tarefa.Feito) {                
                checkTarefa.setAttribute('checked', 'checked')
                } 
                checkTarefa.classList.add('form-check-input', 'flex-shrink-0');
                checkTarefa.type = 'checkbox';
                checkTarefa.id = tarefa._id 
                checkTarefa.value = '';
                checkTarefa.style = 'font-size: 1.375em';

                const spanTarefa = document.createElement('span');
                spanTarefa.classList.add('pt-1', 'form-checked-content');
                
                const strongTarefa = document.createElement('strong');
                strongTarefa.innerText = tarefa.Tarefa;
        
                //Estiliza nome do item
                checkTarefa.addEventListener('change', async () => {
                    
                    const tarefaAtualizada = {
                        ...tarefa,
                        Adicionado: new Date(tarefa.Adicionado).toLocaleDateString("pt-BR"),
                        Feito: checkTarefa.checked
                    };

                    if (checkTarefa.checked) { 
                        strongTarefa.style.textDecoration = "line-through";
                    } else {
                        strongTarefa.style.textDecoration = "none";
                    }
                    await this.vm.marcarTarefa(tarefaAtualizada);
                    this.listarTarefas('lista-tarefa');
                });
        
                const divBotoes = document.createElement('div');
                divBotoes.classList.add('d-flex', 'gap-2', 'align-items-center');

                const btnEditar = document.createElement('button')
                btnEditar.classList.add('btn')
                btnEditar.setAttribute('type', 'button')
                btnEditar.setAttribute('id', 'botao-editar')
                btnEditar.setAttribute('title', 'Editar Tarefa')
                btnEditar.onclick = async ()  => {
                    this.editarTarefa(tarefa._id)
                    
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
                btnExcluir.setAttribute('title', 'Excluir Tarefa')
                btnExcluir.onclick = async ()  => {                      
                    await this.vm.excluirTarefa(tarefa._id)
                }
        
                const iconeExcluir = document.createElement('i')
                iconeExcluir.classList.add('bi', 'bi-trash')
                iconeExcluir.setAttribute ('id', 'excluir-tarefa')
                
                const smallTarefa = document.createElement('small');
                smallTarefa.classList.add('d-block', 'text-body-secondary');
                smallTarefa.innerText = `Adicionado em ${tarefa.Adicionado}`;
        
                btnEditar.appendChild(iconeEditar);
                btnExcluir.appendChild(iconeExcluir);
                spanTarefa.appendChild(strongTarefa); 
                divTarefa.appendChild(checkTarefa);
                divTarefa.appendChild(spanTarefa);
                labelTarefa.appendChild(divTarefa);
                divBotoes.appendChild(smallTarefa);
                divBotoes.appendChild(btnEditar);
                divBotoes.appendChild(btnExcluir);
                labelTarefa.appendChild(divBotoes);
                liTarefa.appendChild(labelTarefa);    
            })
        } else {
            const pMensagem = document.createElement('p');
            pMensagem.classList.add('mensagem-tarefa');
            pMensagem.textContent = ' Não há tarefas pendentes.';
            liTarefa.appendChild(pMensagem);
        }
    };
}