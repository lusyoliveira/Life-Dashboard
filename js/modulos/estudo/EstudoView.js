import { StatusViewModel } from "../status/StatusViewModel.js";
import { AreaViewModel } from "../areas/AreasViewModel.js";
import { PlataformaViewModel } from "../plataformas/PlataformasViewModel.js";
import { popularSelect, limparFormulario } from "../../Utils/utils.js";
import { criarDataTable } from "../../componentes/tabelas/DataTable.js";
import { colunaAcoes } from "../../componentes/tabelas/colunasAcoes.js";
import { formatarDataBR, formatarParaISO } from "../../Utils/metodoData.js";
import { abrirModalAcao } from "../../Utils/modal.js";
import Curso from "./estudoModel.js";

export class EstudoView {
    constructor(vm) {
        this.vm = vm;
        this.registrarEventosTabela();
    }

    registrarEventosTabela() {
        const tabela = document.getElementById("tabelaCursos");
        if (!tabela) return;

        tabela.addEventListener("click", async (e) => {
            const btnEditar = e.target.closest(".btn-editar");
            const btnExcluir = e.target.closest(".btn-excluir");

            if (btnEditar) {
            await this.abrirModalEditarCursos(btnEditar.dataset.id);
            }

            if (btnExcluir) {
            await this.abrirModalExcluirCursos(btnExcluir.dataset.id);
            }
        });
    };

    async abrirModalExcluirCursos(id) {
        abrirModalAcao({
            titulo: "Excluir curso",
            conteudoHTML: `<p>Deseja realmente excluir este curso?</p>`,
            textoConfirmar: "Excluir",
            classeBotao: "btn-danger",

            onConfirmar: async () => {
            await this.vm.excluirCurso(id);
            await this.listarCursos();
            }
        });
    };
    
    async abrirModalCriarCursos() {
        abrirModalAcao({
            titulo: "Adicionar curso",
            conteudoHTML: this.formHTML,
            textoConfirmar: "Salvar",

            onConfirmar: async () => {
            const form = document.getElementById("formCurso");

            if (!form.checkValidity()) {
                form.reportValidity();
                return false;
            }

            await this.salvarFormularioCursos(form);
            await this.listarCursos();
            }
        });

        limparFormulario();

        await this.listarArea("area-adicionar");
        await this.listarPlataforma("escola-adicionar");
        await this.listarStatus("status-adicionar");
    };

    async abrirModalEditarCursos(id) {
        const curso = await this.vm.obterCursoPorID(id);

        abrirModalAcao({
            titulo: "Editar curso",
            conteudoHTML: this.formHTML,
            textoConfirmar: "Salvar alterações",

            onConfirmar: async () => {
            const form = document.getElementById("formCurso");

            if (!form.checkValidity()) {
                form.reportValidity();
                return false;
            }

            await this.salvarFormularioCursos(form);
            await this.listarCursos();
            }
        });

        await this.listarArea("area-adicionar");
        await this.listarPlataforma("escola-adicionar");
        await this.listarStatus("status-adicionar");

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
    };

    async salvarFormularioCursos(form) {
        const idInput = form.querySelector('#id-adicionar').value;     
        const capa = form.querySelector('#capa-adicionar').value;
        const tituloCurso = form.querySelector('#curso-adicionar').value;        
        const escola = form.querySelector('#escola-adicionar').value;
        const instrutor = form.querySelector('#instrutor-adicionar').value;
        const area = form.querySelector('#area-adicionar').value;
        const dataCompra = form.querySelector('#compra-adicionar').value;
        const aulas = form.querySelector('#assistidos-adicionar').value;
        const assistido = form.querySelector('#aulas-adicionar').value;
        const horas = form.querySelector('#horas-adicionar').value;
        const valor = form.querySelector('#valor-adicionar').value;
        const status = form.querySelector('#status-adicionar').value;
        const certificado = form.querySelector('#certificado-adicionar').value;

        const curso = new Curso(
            idInput ? idInput : null,
            capa,
            escola,
            Number(aulas),
            Number(assistido),
            Number(horas),
            tituloCurso,
            instrutor,
            area,
            formatarParaISO(dataCompra),
            Number(valor),
            status,
            certificado
        );
    
        await this.vm.salvarCurso(curso);
        await this.listarCursos();
    };
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