import { StatusViewModel } from "../status/StatusViewModel.js";
import { AreaViewModel } from "../areas/AreasViewModel.js";
import { PlataformaViewModel } from "../plataformas/PlataformasViewModel.js";
import { popularSelect } from "../../Utils/utils.js";
import { criarDataTable } from "../../componentes/tabelas/DataTable.js";
import { colunaAcoes } from "../../componentes/tabelas/colunasAcoes.js";
import { formatarDataBR } from "../../Utils/metodoData.js";

export class EstudoView {
    constructor(vm) {
        this.vm = vm;
        this.registrarEventosTabela();
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
    };
    registrarEventosTabela() {
        const tabela = document.getElementById("tabelaCatalogo");
        if (!tabela) return;

        tabela.addEventListener("click", async (e) => {
        const btnEditar = e.target.closest(".btn-editar");
        const btnExcluir = e.target.closest(".btn-excluir");

        if (btnEditar) {
            const id = btnEditar.dataset.id;
            this.editarCurso(id);
        }

        if (btnExcluir) {
            const id = btnExcluir.dataset.id;

            if (!confirm("Deseja realmente excluir este cursos?")) return;

            try {
            await this.vm.excluirCurso(id);
            await this.listarCursos();
            } catch (error) {
            alert("Erro ao excluir curso!");
            }
        }
        });
    };
    // TABELA
    async listarCursos() {
        const dados = await this.vm.obterCursos();

        criarDataTable({
        tabelaId: "tabelaCursos",
        dados,
        colunas: [
            { title: "Curso", data: "Name" },
            { title: "Instrutor", data: "Professor" },
            { title: "Escola", data: "Escola.descricao" },
            { title: "Área", data: "Assunto.descricao" },
            {
                title: "Comprado",
                data: "Comprado",
                render: (data) => formatarDataBR(data)
            },
            { title: "Valor", data: "Valor" },
            { title: "Status", data: "Status.descricao" },
            { title: "Certificado", data: "Certificado" },
            colunaAcoes({ campoId: "id" })

            ]
        });
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
    };

    async listarStatus(elementoId) { 
        const statusVM = new StatusViewModel();  
        const status =  await statusVM.obterStatus('Geral')
        
        popularSelect(status,elementoId)
    };

    async listarArea(elementoId) {    
        const areaVM = new AreaViewModel();
        const area =  await areaVM.obterArea()
        
        popularSelect(area,elementoId)
    };

    async listarPlataforma(elementoId) {
        const plataformaVM = new PlataformaViewModel();
        const plataforma = await plataformaVM.obterPlataforma('Cursos');

        popularSelect(plataforma, elementoId);
    };
    
}