import { calculaTempoData, formatarDataBR } from "../../Utils/metodoData.js";
import { StatusViewModel } from "../status/StatusViewModel.js";
import { PlataformaViewModel } from "../plataformas/PlataformasViewModel.js";
import { TipoViewModel } from "../tipos/TipoViewModel.js";
import { popularSelect } from "../../Utils/utils.js";
import { graficoBarra } from "../../componentes/graficos/GraficosFactory.js";
import { criarDataTable } from "../../componentes/tabelas/DataTable.js";
import { colunaAcoes } from "../../componentes/tabelas/colunasAcoes.js";
import { abrirModalAcao } from "../../Utils/modal.js";

export class CatalogoView {
    constructor(vm) {
        this.vm = vm;
        this.registrarEventosTabela();
    }   

    async carregarFormulario() {
        if (this.formHTML) return; 

        const res = await fetch("/pages/partials/formCatalogo.html");
        this.formHTML = await res.text();
    };

    registrarEventosTabela() {
        const tabela = document.getElementById("tabelaCatalogo");
        if (!tabela) return;

        tabela.addEventListener("click", async (e) => {
            const btnEditar = e.target.closest(".btn-editar");
            const btnExcluir = e.target.closest(".btn-excluir");

            if (btnEditar) {
            await this.abrirModalEditarCatalogo(btnEditar.dataset.id);
            }

            if (btnExcluir) {
            await this.abrirModalExcluirCatalogo(btnExcluir.dataset.id);
            }
        });
    };

    async abrirModalExcluirCatalogo(id) {
        abrirModalAcao({
            titulo: "Excluir título",
            conteudoHTML: `<p>Deseja realmente excluir este título?</p>`,
            textoConfirmar: "Excluir",
            classeBotao: "btn-danger",

            onConfirmar: async () => {
            await this.vm.excluirTitulo(id);
            await this.listarCatalogo();
            }
        });
    };

    async abrirModalCriarCatalogo() {
        abrirModalAcao({
            titulo: "Adicionar título",
            conteudoHTML: this.formHTML,
            textoConfirmar: "Salvar",

            onConfirmar: async () => {
            const form = document.getElementById("formCatalogo");

            if (!form.checkValidity()) {
                form.reportValidity();
                return false;
            }

            await this.salvarFormularioCatalogo(form);
            await this.listarCatalogo();
            }
        });

        // prepara formulário vazio
        this.limparFormularioCatalogo();

        await this.listarTipos("tipo-adicionar");
        await this.listarPlataforma("plataforma-adicionar");
        await this.listarStatus("status-adicionar");
    };

    limparFormularioCatalogo() {
        const form = document.getElementById("formCatalogo");
        if (!form) return;

        form.reset();
        document.getElementById("id-adicionar").value = "";
    };

    async abrirModalEditarCatalogo(id) {
        const titulo = await this.vm.obterTituloPorID(id);

        abrirModalAcao({
            titulo: "Editar título",
            conteudoHTML: this.formHTML,
            textoConfirmar: "Salvar alterações",

            onConfirmar: async () => {
            const form = document.getElementById("formCatalogo");

            if (!form.checkValidity()) {
                form.reportValidity();
                return false;
            }

            await this.salvarFormularioCatalogo(form);
            await this.listarCatalogo();
            }
        });

        await this.listarTipos("tipo-adicionar");
        await this.listarPlataforma("plataforma-adicionar");
        await this.listarStatus("status-adicionar");

        document.getElementById("id-adicionar").value = titulo.id;
        document.getElementById('titulo-adicionar').value = titulo.Titulo;
        document.getElementById('capa-adicionar').value = titulo.Capa;
        document.getElementById('data-inicio').value = new Date(titulo.Inicio).toISOString().slice(0, 16);
        document.getElementById('data-fim').value = titulo.Fim === null ? null : new Date(titulo.Fim).toISOString().slice(0, 16);
        document.getElementById('tipo-adicionar').value = titulo.Tipo._id;
        document.getElementById('status-adicionar').value = titulo.Status._id;
        document.getElementById('plataforma-adicionar').value = titulo.Onde._id;
        document.getElementById('episodios-adicionar').value = titulo.Episodios;
        document.getElementById('assistidos-adicionar').value = titulo.Assistidos;
        document.getElementById('temporada-adicionar').value = titulo.Temporadas;
        document.getElementById('pontuacao-adicionar').value = titulo.Score;   
        document.getElementById('vezes-adicionar').value = titulo.Vezes;  
        };

    async salvarFormularioCatalogo(form) {
        const idInput = form.querySelector('#id-adicionar')?.value || null;

        const descricao = form.querySelector('#titulo-adicionar').value;
        const capa = form.querySelector('#capa-adicionar').value;
        const dataInicio = form.querySelector('#data-inicio').value;
        const dataFim = form.querySelector('#data-fim').value;
        const tipo = form.querySelector('#tipo-adicionar').value;
        const status = form.querySelector('#status-adicionar').value;
        const plataforma = form.querySelector('#plataforma-adicionar').value;
        const episodios = form.querySelector('#episodios-adicionar').value;
        const assistidos = form.querySelector('#assistidos-adicionar').value;
        const temporada = form.querySelector('#temporada-adicionar').value;
        const pontuacao = form.querySelector('#pontuacao-adicionar').value;
        const vezes = form.querySelector('#vezes-adicionar').value;

        let adicaoOriginal = null;

        // edição → preservar Adicao
        if (idInput) {
            const tituloExistente = await this.vm.obterTituloPorID(idInput);
            if (tituloExistente) {
            adicaoOriginal = tituloExistente.Adicao;
            }
        }

        const titulo = new Catalogo(
            idInput,
            descricao,
            capa,
            tipo,
            status,
            plataforma,
            formatarParaISO(dataInicio),
            dataFim ? formatarParaISO(dataFim) : null,
            Number(episodios),
            Number(assistidos),
            Number(temporada),
            Number(pontuacao),
            Number(vezes),
            adicaoOriginal
        );

        await this.vm.salvarTitulo(titulo);
        }

    // TABELA
    async listarCatalogo() {
        const dados = await this.vm.obterCatalogo();

        criarDataTable({
        tabelaId: "tabelaCatalogo",
        dados,
        colunas: [
            { title: "Título", data: "Titulo" },
            { title: "Tipo", data: "Tipo.descricao" },
            { title: "Status", data: "Status.descricao" },
            { title: "Plataforma", data: "Onde.descricao" },
            {
                title: "Início",
                data: "Inicio",
                render: (data) => formatarDataBR(data)
            },
            {
                title: "Fim",
                data: "Fim",
                render: (data) => formatarDataBR(data)
            },
            { title: "Episódios", data: "Episodios" },
            { title: "Assistidos", data: "Assistidos" },
            { title: "Temporadas", data: "Temporadas" },
            { title: "Score", data: "Score" },
            { title: "Vezes", data: "Vezes" },
            { title: "Dias", data: "Dias" },
            colunaAcoes({ campoId: "id" })

            ]
        });
    };

    // ESTATÍSTICA
    renderEstatistica(tipo, elementoId) {
        const stats = this.vm.estatisticasPorTipo(tipo);
        const elementoDestino = document.getElementById(elementoId);
        
        if (elementoDestino) {
            elementoDestino.innerHTML = "";
                elementoDestino.innerHTML += 
                `
                    <div class="card">
                        <div class="card-header">
                                Estatísticas de ${tipo}
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <p class="card-title">Dias: ${stats.dias}</p>
                                <p class="card-text">Pontuação Média: ${stats.mediaPontuacao}</p>
                            </div>
                            <div class="progress-stacked">
                                <div class="progress" role="progressbar" aria-label="Completado" aria-valuenow="${(stats.completado/100)*stats.total}" aria-valuemin="0" aria-valuemax="100" style="width: ${(stats.completado/100)*stats.total}%">
                                    <div class="progress-bar"></div>
                                </div>
                                <div class="progress" role="progressbar" aria-label="Assistido" aria-valuenow="${(stats.assistindo/100)*stats.total}" aria-valuemin="0" aria-valuemax="100" style="width: ${(stats.assistindo/100)*stats.total}%">
                                    <div class="progress-bar bg-success"></div>
                                </div>
                                <div class="progress" role="progressbar" aria-label="Dropped" aria-valuenow="${(stats.dropped/100)*stats.total}" aria-valuemin="0" aria-valuemax="100" style="width: ${(stats.dropped/100)*stats.total}%">
                                    <div class="progress-bar bg-danger"></div>
                                </div>
                                <div class="progress" role="progressbar" aria-label="EmEspera" aria-valuenow="${(stats.emEspera/100)*stats.total}" aria-valuemin="0" aria-valuemax="100" style="width: ${(stats.emEspera/100)*stats.total}%">
                                    <div class="progress-bar bg-warning"></div>
                                </div>
                                <div class="progress" role="progressbar" aria-label="Planejado" aria-valuenow="${(stats.planejado/100)*stats.total}" aria-valuemin="0" aria-valuemax="100" style="width: ${(stats.planejado/100)*stats.total}%">
                                    <div class="progress-bar bg-info"></div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-start mt-2">
                                <ul class="list-unstyled mb-0"> 
                                    <li>
                                        <a class="dropdown-item d-flex align-items-center gap-2 py-1" href="#"> 
                                            <span class="d-inline-block bg-success rounded-circle p-1"></span>
                                            Assistindo: ${stats.assistindo}
                                        </a>
                                    </li> 
                                    <li>
                                        <a class="dropdown-item d-flex align-items-center gap-2 py-1" href="#">
                                            <span class="d-inline-block bg-primary rounded-circle p-1"></span>
                                            Completo: ${stats.completado}
                                        </a>
                                    </li> 
                                    <li>
                                        <a class="dropdown-item d-flex align-items-center gap-2 py-1" href="#"> 
                                        <span class="d-inline-block bg-danger rounded-circle p-1"></span>
                                            Dropped: ${stats.dropped}
                                        </a>
                                    </li> 
                                    <li>
                                        <a class="dropdown-item d-flex align-items-center gap-2 py-1" href="#"> 
                                        <span class="d-inline-block bg-warning rounded-circle p-1"></span>
                                            Em Espera: ${stats.emEspera}
                                        </a>
                                    </li>  
                                    <li>
                                        <a class="dropdown-item d-flex align-items-center gap-2 py-1" href="#"> 
                                        <span class="d-inline-block bg-info rounded-circle p-1"></span>
                                            Planejado: ${stats.planejado}
                                        </a>
                                    </li> 
                                </ul>

                                <ul class="list-unstyled mb-0"> 
                                    <li>
                                        Total: ${stats.total}
                                    </li> 
                                    <li>
                                        Reassitindos: ${stats.reassistidos}
                                    </li> 
                                    <li>
                                        Episódios: ${stats.totalEpisodios}
                                    </li> 
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
        }        
    }

    renderGraficos() {
        graficoBarra(
            "graficoTipo",
            this.vm.dadosGraficoTipo(),
            "Títulos por Tipo"
        );

        graficoBarra(
            "graficoStatus",
            this.vm.dadosGraficoStatus(),
            "Títulos por Status"
        );

        graficoBarra(
            "graficoPlataforma",
            this.vm.dadosGraficoPlataforma(),
            "Títulos por Plataforma"
        );
    }
   
 // RECENTES
    renderRecentes(elementoId)  {
        const recentes = this.vm.recentes(3);       
        const elementoDestino = document.getElementById(elementoId);

        if (!elementoDestino) return;
        elementoDestino.innerHTML = "";
        recentes.forEach(titulo => {
            const divCard = document.createElement('div');
            divCard.classList.add('card', 'p-1', 'm-2');

            const imgCapa = document.createElement('img');
            imgCapa.src = titulo.Capa;
            imgCapa.classList.add('card-img-top');
            imgCapa.width = 320;
            imgCapa.height = 450;

            const divCardBody = document.createElement('div');
            divCardBody.classList.add('card-body');

            const h5Titulo = document.createElement('h5');
            h5Titulo.classList.add('card-title');
            h5Titulo.textContent = titulo.Titulo;

            const ulInfo = document.createElement('ul');
            ulInfo.classList.add('d-flex', 'justify-content-between', 'align-items-lg-center', 'gap-3', 'list-unstyled', 'mt-auto');
            const liProgresso = document.createElement('li');
            liProgresso.classList.add('w-75');

            const divProgresso = document.createElement('div');
            divProgresso.classList.add('progress');
            divProgresso.setAttribute('role', 'progressbar');
            divProgresso.setAttribute('aria-label', 'Example with label');
            divProgresso.setAttribute('aria-valuenow', titulo.Status.descricao === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100);
            divProgresso.setAttribute('aria-valuemin', '0');
            divProgresso.setAttribute('aria-valuemax', '100');

            const divBarraProgresso = document.createElement('div');
            divBarraProgresso.classList.add('progress-bar');
            divBarraProgresso.style.width = `${titulo.Status.descricao === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100}%`;
            divBarraProgresso.textContent = `${titulo.Status.descricao === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100}%`;
            divProgresso.appendChild(divBarraProgresso);
            liProgresso.appendChild(divProgresso);

            const liDataAdicao = document.createElement('li');
            liDataAdicao.classList.add('d-flex', 'gap-3', 'align-items-center');

            const iIcon = document.createElement('i');
            iIcon.classList.add('bi', 'bi-calendar3');

            const smallDataAdicao = document.createElement('small');
            const dataUTC = new Date(titulo.Adicao);                
            const dataLocal = new Date(dataUTC.getTime() + dataUTC.getTimezoneOffset() * 60000);
                        
            smallDataAdicao.textContent = dataLocal.toLocaleDateString("pt-BR");
            liDataAdicao.appendChild(iIcon);
            liDataAdicao.appendChild(smallDataAdicao);
            ulInfo.appendChild(liProgresso);
            ulInfo.appendChild(liDataAdicao);
            divCardBody.appendChild(h5Titulo);
            divCardBody.appendChild(ulInfo);
            divCard.appendChild(imgCapa);
            divCard.appendChild(divCardBody);
            elementoDestino.appendChild(divCard);

        });
    }
  
    

    renderCardStatus(status,elementoId) {
        const catalogoStatus = this.vm.recentesPorStatus(status,4);
        const elementoDestino = document.getElementById(elementoId);    

        if (elementoDestino) {
                elementoDestino.innerHTML = "";
                catalogoStatus.forEach(titulo => {
                    const li = document.createElement('li');
                    li.classList.add('list-group-item', 'd-flex', 'gap-2', 'p-0');
        
                    const imgCapa = document.createElement('img');
                    imgCapa.src = titulo.Capa
                    imgCapa.alt = titulo.Titulo;
                    imgCapa.width = 60;
                    imgCapa.height = 80;
                    imgCapa.classList.add('flex-shrink-0');
        
                    const divInfo = document.createElement('div');
                    divInfo.classList.add('d-flex', 'gap-2', 'w-100', 'justify-content-between', 'align-items-center');
        
                    const divTitulo = document.createElement('div');
                    divTitulo.classList.add('d-flex', 'flex-column', 'gap-1');
        
                    const h6Titulo = document.createElement('h6');
                    h6Titulo.classList.add('mb-0');
                    h6Titulo.textContent = titulo.Titulo;
        
                    const divProgresso = document.createElement('div');
                    divProgresso.classList.add('progress');
                    divProgresso.setAttribute('role', 'progressbar');
                    divProgresso.setAttribute('aria-label', 'Progresso');
                    divProgresso.setAttribute('aria-valuenow', titulo.Status.descricao === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100);
                    divProgresso.setAttribute('aria-valuemin', '0');
                    divProgresso.setAttribute('aria-valuemax', '100');
        
                    const divBarraProgresso = document.createElement('div');
                    divBarraProgresso.classList.add('progress-bar');
                    divBarraProgresso.style.width = `${titulo.Status.descricao === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100}%`;
                    divBarraProgresso.textContent =  `${titulo.Status.descricao === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100}%`;
        
                    const smallDataAdicao = document.createElement('small');
                    smallDataAdicao.classList.add('opacity-50', 'text-nowrap');  
                    const dataUTC = new Date(titulo.Adicao);                
                    const dataLocal = new Date(dataUTC.getTime() + dataUTC.getTimezoneOffset() * 60000);
                    smallDataAdicao.textContent = calculaTempoData(dataLocal);
        
                    divTitulo.appendChild(h6Titulo);
                    divProgresso.appendChild(divBarraProgresso);
                    divInfo.appendChild(divTitulo);
                    divTitulo.appendChild(divProgresso);
                    li.appendChild(imgCapa);
                    li.appendChild(divInfo);
                    li.appendChild(smallDataAdicao);
                    elementoDestino.appendChild(li);
                    
                });
            }
        }

    renderCardTipo(tipo,elementoId) {
        const catalogoTipo = this.vm.topPorScore(tipo,4);
        const elementoDestino = document.getElementById(elementoId);
        

         if (elementoDestino) {
            elementoDestino.innerHTML = "";
            catalogoTipo.forEach(titulo => {
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'd-flex', 'align-items-center', 'gap-2', 'p-0');

                const imgCapa = document.createElement('img');
                imgCapa.src = titulo.Capa;
                imgCapa.alt = titulo.Titulo;
                imgCapa.width = 60;
                imgCapa.height = 80;
                imgCapa.classList.add('flex-shrink-0');

                const divTituloContainer = document.createElement('div');
                divTituloContainer.classList.add('ms-2', 'me-auto');

                const divTitulo = document.createElement('div');
                divTitulo.classList.add('fw-bold');
                divTitulo.textContent = titulo.Titulo;

                const spanScore = document.createElement('span');
                spanScore.classList.add('badge', 'text-bg-primary', 'rounded-pill');
                spanScore.textContent = titulo.Score;

                divTituloContainer.appendChild(divTitulo);
                li.appendChild(imgCapa);
                li.appendChild(divTituloContainer);
                li.appendChild(spanScore);
                elementoDestino.appendChild(li);
                
            });
        }
    }

    renderCardGeral(elementoId) {
        const catalogoTipo = this.vm.topGeral(4);
        const elementoDestino = document.getElementById(elementoId);
        

         if (elementoDestino) {
            elementoDestino.innerHTML = "";
            catalogoTipo.forEach(titulo => {
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'd-flex', 'align-items-center', 'gap-2', 'p-0');

                const imgCapa = document.createElement('img');
                imgCapa.src = titulo.Capa;
                imgCapa.alt = titulo.Titulo;
                imgCapa.width = 60;
                imgCapa.height = 80;
                imgCapa.classList.add('flex-shrink-0');

                const divTituloContainer = document.createElement('div');
                divTituloContainer.classList.add('ms-2', 'me-auto');

                const divTitulo = document.createElement('div');
                divTitulo.classList.add('fw-bold');
                divTitulo.textContent = titulo.Titulo;

                const spanScore = document.createElement('span');
                spanScore.classList.add('badge', 'text-bg-primary', 'rounded-pill');
                spanScore.textContent = titulo.Score;

                divTituloContainer.appendChild(divTitulo);
                li.appendChild(imgCapa);
                li.appendChild(divTituloContainer);
                li.appendChild(spanScore);
                elementoDestino.appendChild(li);
                
            });
        }
    }   
    
    renderContagemGeral(elementoId, tipoContagem,resumo) {
        const catalogo = resumo || this.vm.resumoGeral();
        const elementoDestino = document.getElementById(elementoId);
        const porcentagem = catalogo.totalAssistidos/catalogo.totalEpisodios*100;   
       
        let contagem = 0;      
       
         if (tipoContagem === 'Progresso') {
            contagem = catalogo.totalAssistidos

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = `${contagem} de ${catalogo.totalEpisodios}`;
            elementoDestino.appendChild(h6Card);

            // Exibe a barra de progresso
            const divProgressoContainer = document.createElement('div');
            divProgressoContainer.classList.add('progress');
            divProgressoContainer.setAttribute('role', 'progressbar');
            divProgressoContainer.setAttribute('aria-label', 'Success example');
            divProgressoContainer.setAttribute('aria-valuenow', porcentagem.toFixed(1));
            divProgressoContainer.setAttribute('aria-valuemin', '0');
            divProgressoContainer.setAttribute('aria-valuemax', '100');

            const divProgressoBarra = document.createElement('div');
            divProgressoBarra.classList.add('progress-bar', 'text-bg-success');
            divProgressoBarra.style.width = `${porcentagem.toFixed(1)}%`;
            divProgressoBarra.textContent = `${porcentagem.toFixed(1)}%`;
            divProgressoContainer.appendChild(divProgressoBarra);
            elementoDestino.appendChild(divProgressoContainer);

        } else if (tipoContagem === 'Total') {
            contagem = catalogo.Total

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);

        } else if (tipoContagem === 'Pontuacao') {
            contagem = catalogo.mediaPontuacao

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);

        } else if (tipoContagem === 'Assistidos') {
            contagem = catalogo.totalAssistidos

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);

        } else if (tipoContagem === 'Episodios') {
            contagem = catalogo.totalEpisodios

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);

        } else if (tipoContagem === 'Dias') {
            contagem = catalogo.totalDias

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);
            
        }else if (tipoContagem === 'Horas') {
            contagem = catalogo.totalHoras

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);
            
        } else if (tipoContagem === 'Completado') {
            contagem = catalogo.completado

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);
        } else if (tipoContagem === 'Em Espera') {
            contagem = catalogo.emEspera

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);
        } else if (tipoContagem === 'Dropped') {
            contagem = catalogo.dropped

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);
        } else if (tipoContagem === 'Planejado') {
            contagem = catalogo.planejado

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);
        } else if (tipoContagem === 'Assistindo') {
            contagem = catalogo.assistindo

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);
        } else if (tipoContagem === 'Desenho') {
            contagem = catalogo.desenho

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);
        } else if (tipoContagem === 'Filme') {
            contagem = catalogo.filme

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);
        } else if (tipoContagem === 'Serie') {
            contagem = catalogo.serie

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);
        } else if (tipoContagem === 'Show') {
            contagem = catalogo.show

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);
        } else if (tipoContagem === 'Reality') {
            contagem = catalogo.reality

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);
        } else if (tipoContagem === 'Documentário') {
            contagem = catalogo.documentario

            const h6Card = document.createElement('h6');
            h6Card.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
            h6Card.textContent = contagem;
            elementoDestino.appendChild(h6Card);
        }            
    }

    async  renderAssistindo(statusFiltro, elementoDestinoId) {
        const catalogoStatus = this.vm.assistindo(statusFiltro,4);
        const elementoDestino = document.getElementById(elementoDestinoId);     

        if (elementoDestino) {
            elementoDestino.innerHTML = "";

            if (!catalogoStatus.length == 0) {
                catalogoStatus.forEach(titulo => {
                    const divContainer = document.createElement('div');
                    divContainer.classList.add('col');

                    const divContainerCard = document.createElement('div');
                    divContainerCard.classList.add('card', 'shadow-sm');

                    const imgCapa = document.createElement('img');
                    imgCapa.classList.add('card-img-top');
                    imgCapa.src = titulo.Capa;
                    imgCapa.alt = titulo.Titulo;
                    imgCapa.height = 250;
                    imgCapa.width = '100%';

                    const divCardBody = document.createElement('div');
                    divCardBody.classList.add('card-body');
                    divCardBody.id = 'principal-assistindo';

                    const h5Titulo = document.createElement('h5');
                    h5Titulo.classList.add('card-title');
                    h5Titulo.textContent = titulo.Titulo;

                    const divBadge = document.createElement('div');
                    divBadge.classList.add('d-flex', 'justify-content-between', 'align-items-center');

                    const spanBadgeTipo = document.createElement('span');
                    spanBadgeTipo.classList.add('badge', 'text-bg-info');
                    spanBadgeTipo.textContent = titulo.Tipo.descricao;

                    const spanBadgeStatus = document.createElement('span');
                    spanBadgeStatus.classList.add('badge', 'text-bg-primary');
                    spanBadgeStatus.textContent = titulo.Status.descricao;

                    const divProgresso = document.createElement('div');
                    divProgresso.classList.add('progress', 'mt-2');
                    divProgresso.setAttribute('role', 'progressbar');
                    divProgresso.setAttribute('aria-label', 'Progresso Assistindo');
                    divProgresso.setAttribute('aria-valuenow', titulo.Status.descricao === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100);
                    divProgresso.setAttribute('aria-valuemin', '0');
                    divProgresso.setAttribute('aria-valuemax', '100');

                    const divBarraProgresso = document.createElement('div');
                    divBarraProgresso.classList.add('progress-bar', 'bg-success');
                    divBarraProgresso.style.width = `${titulo.Status.descricao === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100}%`;
                    divBarraProgresso.textContent = `${titulo.Status.descricao === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100}%`;

                    divProgresso.appendChild(divBarraProgresso);
                    divCardBody.appendChild(h5Titulo);
                    divBadge.appendChild(spanBadgeTipo);
                    divBadge.appendChild(spanBadgeStatus);
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
                pMensagem.textContent = 'Não há títulos em andamento no momento.';
                elementoDestino.appendChild(pMensagem);
            } 
        }
    };

    async listarStatus(elementoId) { 
        const statusVM = new StatusViewModel();  
        const status =  await statusVM.obterStatus('Catalogo')
        
        popularSelect(status,elementoId)
    };

    async listarTipos(elementoId) {    
        const tiposVM = new TipoViewModel();
        const tipos =  await tiposVM.obterTipos('Catalogo')
        
        popularSelect(tipos,elementoId)
    };

    async listarPlataforma(elementoId) {
        const plataformaVM = new PlataformaViewModel();
        const plataforma = await plataformaVM.obterPlataforma('Catalogo');

        popularSelect(plataforma, elementoId);
    };
}
