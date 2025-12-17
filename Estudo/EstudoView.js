import { calculaTempoData } from "../js/metodoData.js";

export class EstudoView {
    constructor(vm) {
        this.vm = vm;
    }

    async editarCurso(cursoId) {
        const curso = await this.vm.obterCursoPorID(cursoId)
        
        if (curso) {
            document.getElementById('id-adicionar').value = curso.id;
            document.getElementById('capa-adicionar').value = curso.Capa;
            document.getElementById('escola-adicionar').value = curso.Escola;
            document.getElementById('aulas-adicionar').value = curso.Aulas;
            document.getElementById('assistidos-adicionar').value = curso.Assistido;
            document.getElementById('horas-adicionar').value = curso.Horas;
            document.getElementById('curso-adicionar').value = curso.Name;
            document.getElementById('instrutor-adicionar').value = curso.Professor;
            document.getElementById('area-adicionar').value = curso.Assunto;
            document.getElementById('compra-adicionar').value = new Date(curso.Comprado).toISOString().slice(0, 16);
            document.getElementById('valor-adicionar').value = curso.Valor;
            document.getElementById('status-adicionar').value = curso.Status;
            document.getElementById('certificado-adicionar').value = curso.Certificado;
        } else {
            alert('Curso não encontrado!');
        }
    }
    async listarCursos(elementoId) {
        const tabela = document.getElementById(elementoId);
        tabela.innerHTML = '';
        const cursos = await this.vm.obterCursos();
        
        if (!tabela) return;     
    
        if ($.fn.DataTable.isDataTable('.datatable')) {
        $('.datatable').DataTable().clear().destroy(); 
        }
            cursos.forEach(curso => {
                const tr = document.createElement('tr');
                   
                const tdNomeCurso = document.createElement('td');
                tdNomeCurso.textContent = curso.Name;
    
                const tdProfessor = document.createElement('td');
                tdProfessor.textContent = curso.Professor;

                const tdEscola = document.createElement('td');
                tdEscola.classList.add('text-center');
                tdEscola.textContent = curso.Escola; 
    
                const tdAssunto = document.createElement('td');
                tdAssunto.classList.add('text-center');
                tdAssunto.textContent = curso.Assunto;
    
                const tdComprado = document.createElement('td');
                tdComprado.classList.add('text-center');    
                const dataUTC = new Date(curso.Comprado);                
                const dataLocal = new Date(dataUTC.getTime() + dataUTC.getTimezoneOffset() * 60000);
                tdComprado.textContent = dataLocal.toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
    
                const tdValor = document.createElement('td');
                tdValor.classList.add('text-center');
                tdValor.textContent = curso.Valor.toFixed(2);
    
                const tdStatus = document.createElement('td');
                tdStatus.classList.add('text-center');
                tdStatus.textContent = curso.Status;
    
                const tdCertificado = document.createElement('td');
                tdCertificado.classList.add('text-center');
                tdCertificado.textContent = curso.Certificado; 

                const tdBtnEditar = document.createElement("td");
                const tdBtnExcluir = document.createElement("td");

                const btnEditar = document.createElement("button");
                btnEditar.classList.add("btn", "btn-primary");
                btnEditar.onclick = () => this.editarCurso(curso.id);

                const iconeEditar = document.createElement("i");
                iconeEditar.classList.add("bi", "bi-pencil-fill");
                iconeEditar.setAttribute("id", "editar-curso");

                const btnExcluir = document.createElement("button");
                btnExcluir.classList.add("btn", "btn-danger");
                btnExcluir.onclick = async () => {
                    try {
                    await this.vm.excluirCurso(curso.id);
                    } catch (error) {
                    alert("Erro ao excluir agendamento!");
                    }
                };

                const iconeExcluir = document.createElement("i");
                iconeExcluir.classList.add("bi", "bi-trash");
                iconeExcluir.setAttribute("id", "excluir-curso");
                  
                btnEditar.appendChild(iconeEditar);
                btnExcluir.appendChild(iconeExcluir);
                tdBtnEditar.appendChild(btnEditar);
                tdBtnExcluir.appendChild(btnExcluir);
                tr.appendChild(tdNomeCurso);
                tr.appendChild(tdProfessor);
                tr.appendChild(tdEscola);
                tr.appendChild(tdAssunto);
                tr.appendChild(tdComprado);
                tr.appendChild(tdValor);
                tr.appendChild(tdStatus);
                tr.appendChild(tdCertificado);
                tr.appendChild(tdBtnEditar);
                tr.appendChild(tdBtnExcluir);
                tabela.appendChild(tr);
        });
        // Dispara DataTable
        document.dispatchEvent(new Event('Renderizado'));
    };

    renderCursando(elementoId) { 
        const cursando = this.vm.cursando(3);
        const elementoDestino = document.getElementById(elementoId);

        if (elementoDestino) {
            elementoDestino.innerHTML = "";
            
            if (cursando.length > 0) {
                cursando.forEach(curso => {
                    const divContainer = document.createElement('div');
                    divContainer.classList.add('col');

                    const divContainerCard = document.createElement('div');
                    divContainerCard.classList.add('card', 'shadow-sm');

                    const imgCapa = document.createElement('img');
                    imgCapa.classList.add('card-img-top');
                    imgCapa.src = curso.Capa;
                    imgCapa.alt = curso.Name;
                    imgCapa.height = 250;
                    imgCapa.width = '100%';

                    const divCardBody = document.createElement('div');
                    divCardBody.classList.add('card-body');
                    divCardBody.id = 'principal-assistindo';

                    const h5Titulo = document.createElement('h5');
                    h5Titulo.classList.add('card-title');
                    h5Titulo.textContent = curso.Name;

                    const divBadge = document.createElement('div');
                    divBadge.classList.add('d-flex', 'justify-content-between', 'align-items-center');

                    const spanBadge = document.createElement('span');
                    spanBadge.classList.add('badge', 'text-bg-info');
                    spanBadge.textContent = curso.Assunto;

                    const divProgresso = document.createElement('div');
                    divProgresso.classList.add('progress', 'mt-2');
                    divProgresso.setAttribute('role', 'progressbar');
                    divProgresso.setAttribute('aria-label', 'Progresso Assistindo');
                    divProgresso.setAttribute('aria-valuenow', curso.Progresso);
                    divProgresso.setAttribute('aria-valuemin', '0');
                    divProgresso.setAttribute('aria-valuemax', '100');

                    const divBarraProgresso = document.createElement('div');
                    divBarraProgresso.classList.add('progress-bar', 'bg-success');
                    divBarraProgresso.style.width = `${curso.Progresso * 100}%`;
                    divBarraProgresso.textContent = `${parseInt(curso.Progresso * 100)}%`;

                    divProgresso.appendChild(divBarraProgresso);
                    divCardBody.appendChild(h5Titulo);
                    divBadge.appendChild(spanBadge);
                    divCardBody.appendChild(divBadge);
                    divCardBody.appendChild(divProgresso);
                    divContainerCard.appendChild(imgCapa);
                    divContainerCard.appendChild(divCardBody);
                    divContainer.appendChild(divContainerCard);
                    elementoDestino.appendChild(divContainer);                
                });
            } else {
                const pMensagem = document.createElement('p');
                pMensagem.classList.add('mensagem-curso');
                pMensagem.textContent = 'Não há cursos em andamento no momento.';
                elementoDestino.appendChild(pMensagem);
            }          
        } 
    }
}