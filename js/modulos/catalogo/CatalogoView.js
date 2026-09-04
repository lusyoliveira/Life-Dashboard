import metodoData from "../../Utils/metodoData.js"
import { StatusViewModel } from "../status/StatusViewModel.js";
import { PlataformaViewModel } from "../plataformas/PlataformasViewModel.js";
import { TipoViewModel } from "../tipos/TipoViewModel.js";
import { popularSelect, limparFormulario, renderizarControlesPaginacao } from "../../Utils/utils.js";
import { graficoBarra } from "../../componentes/graficos/GraficosFactory.js";
import { criarDataTable } from "../../componentes/tabelas/DataTable.js";
import { colunaAcoes } from "../../componentes/tabelas/colunasAcoes.js";
import { abrirModalAcao } from "../../Utils/modal.js";
import Catalogo from "./catalogoModel.js";

export class CatalogoView {
    constructor(vm) {
        this.vm = vm;
        this.registrarEventosTabela();
        // Novas propriedades para controle da paginação da coleção
        this.paginaAtualColecao = 1;
        this.itensPorPaginaColecao = 4; // Ajuste este número para quantos cards 
    }   

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

        limparFormulario();

        await this.listarTipos("tipo-adicionar");
        await this.listarPlataforma("plataforma-adicionar");
        await this.listarStatus("status-adicionar");
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
        document.getElementById('tipo-adicionar').value = titulo.Tipo.id;
        document.getElementById('status-adicionar').value = titulo.Status.id;
        document.getElementById('plataforma-adicionar').value = titulo.Plataforma.id;
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
        const tipoId = form.querySelector('#tipo-adicionar').value;
        const statusId = form.querySelector('#status-adicionar').value;
        const plataformaId = form.querySelector('#plataforma-adicionar').value;
        const episodios = form.querySelector('#episodios-adicionar').value;
        const assistidos = form.querySelector('#assistidos-adicionar').value;
        const temporada = form.querySelector('#temporada-adicionar').value;
        const pontuacao = form.querySelector('#pontuacao-adicionar').value;
        const vezes = form.querySelector('#vezes-adicionar').value;
        const idtmdb = form.querySelector('#id-tmdb-adicionar').value;
        const originalName = form.querySelector('#original-name-adicionar').value;
        const overview = form.querySelector('#overview-adicionar').value;
        const posterPath = form.querySelector('#poster-path-adicionar').value;
        const mediaType = form.querySelector('#media-type-adicionar').value;
        const genresIds = form.querySelector('#genres-ids-adicionar').value;
        const popularity = form.querySelector('#popularity-adicionar').value;
        const firstAirDate = form.querySelector('#first-air-date-adicionar').value;
        const year = form.querySelector('#year-adicionar').value;
        const voteAverage = form.querySelector('#vote-average-adicionar').value;

        let adicaoOriginal = new Date();

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
            tipoId,
            statusId,
            plataformaId,
            metodoData.formatarParaISO(dataInicio),
            dataFim ? metodoData.formatarParaISO(dataFim) : null,
            Number(episodios),
            Number(assistidos),
            Number(temporada),
            Number(pontuacao),
            Number(vezes),
            adicaoOriginal,
            idtmdb,
            originalName,
            overview,
            posterPath,
            mediaType,
            genresIds,
            popularity,
            firstAirDate,
            year,
            voteAverage
        );
        
        await this.vm.salvarTitulo(titulo);
    };

    async listarCatalogo() {
        const dados = await this.vm.obterCatalogo();
        const listaOrdenada = dados.sort(
          (a, b) => new Date(a.Adicao).getTime() - new Date(b.Adicao).getTime()
      );       

        criarDataTable({
        tabelaId: "tabelaCatalogo",
        dados: listaOrdenada,
        colunas: [
            { title: "Título", data: "Titulo" },
            { title: "Tipo", 
                data: "Tipo",
                render: (data) => data.descricao
             },
            { title: "Status", data: "Status",
                render: (data) => data.descricao
             },
            { title: "Plataforma", data: "Plataforma",
                render: (data) => data.descricao
             },
            {
                title: "Início",
                data: "Inicio",
                render: (data) => metodoData.formatarDataBR(data)
            },
            {
                title: "Fim",
                data: "Fim",
                render: (data) => metodoData.formatarDataBR(data)
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
        const recentes = this.vm.recentes(5);       
        const elementoDestino = document.getElementById(elementoId);

        if (!elementoDestino) return;
        elementoDestino.innerHTML = "";
        
        recentes.forEach(titulo => {
            const divCard = document.createElement('div');
            divCard.classList.add('col','card', 'p-1', 'm-2');

            const imgCapa = document.createElement('img');
            
            // 🌟 TRATAMENTO BLINDADO CONTRA ERROS DE TIPO (CORS, NULL E UNDEFINED)
           let fonteImagem = titulo.Capa || "https://placeholder.com"; 

            const stringPoster = titulo.Poster_Path ? String(titulo.Poster_Path).trim() : "";

            // 🌟 PROTEÇÃO ADICIONADA: Ignora strings que gravaram o texto "[object Object]" por erro
            if (stringPoster && stringPoster !== "" && !stringPoster.includes("[object")) {
                if (stringPoster.startsWith("data:image")) {
                    fonteImagem = stringPoster;
                } else if (stringPoster.startsWith("http://") || stringPoster.startsWith("https://")) {
                    fonteImagem = stringPoster;
                } else {
                    fonteImagem = "data:image/jpeg;base64," + stringPoster;
                }
            }

            imgCapa.src = fonteImagem;
            imgCapa.classList.add('card-img-top');
            imgCapa.width = 300;
            imgCapa.height = 350;

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
    };
    

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
                    smallDataAdicao.textContent = metodoData.calculaTempoData(dataLocal);
        
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
    };

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

    renderCardFrequentes(tipo,elementoId) {
        const catalogoTipo = this.vm.fequentes(tipo,4);
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
                spanScore.textContent = titulo.Vezes;

                divTituloContainer.appendChild(divTitulo);
                li.appendChild(imgCapa);
                li.appendChild(divTituloContainer);
                li.appendChild(spanScore);
                elementoDestino.appendChild(li);
                
            });
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
    
    async renderizarCardsBusca(termobusca, elementoId) {
        const elementoDestino = document.getElementById(elementoId);
        
        if (!elementoDestino) {
            console.warn(`Aviso: O elemento "${elementoId}" ainda não está pronto no DOM.`);
            return; 
        }

        // Define o estado visual de carregamento
        elementoDestino.innerHTML = '<p>Buscando no catálogo do TMDB...</p>';

        try {
            const items = await this.vm.buscarMidias(termobusca, elementoId);
            
            // Limpa o estado de carregamento
            elementoDestino.innerHTML = '';
            
            if (!items || items.length === 0) {
                elementoDestino.innerHTML = '<p>Nenhuma mídia encontrada no TMDB.</p>';
                return;
            }
            
            // CRUCIAL: Cria uma div com a classe row do Bootstrap para gerenciar a grade de cards
            const divLinha = document.createElement('div');
            divLinha.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4';
            // ^ Explicando as classes acima:
            // row-cols-1: 1 card por linha em telas muito pequenas (celular)
            // row-cols-sm-2: 2 cards por linha em telas pequenas
            // row-cols-md-3: 3 cards por linha em telas médias
            // row-cols-lg-4: 4 cards por linha em telas grandes (computador)
            // g-4: Adiciona um espaçamento (gap) agradável entre as linhas e colunas

            items.forEach(item => { 
                // 1. Cria a coluna que vai limitar o tamanho do card
                const divColuna = document.createElement('div');
                divColuna.className = 'col';

                // 2. Cria o card usando o método que você já reestruturou com Bootstrap
                const elementoCard = this.criarCardMidia(item, false);

                // 3. Coloca o card dentro da coluna, e a coluna dentro da linha
                divColuna.appendChild(elementoCard);
                divLinha.appendChild(divColuna);
            });

            // 4. Injeta a linha completa preenchida de colunas na tela
            elementoDestino.appendChild(divLinha);

        } catch (error) {
            elementoDestino.innerHTML = '<p>Erro na conexão com o servidor.</p>';
            console.error(error);
        }
    };

        criarCardMidia(item, isEstatico) {
        const card = document.createElement('div');
        card.className = 'card h-100';
        const capa = item.image ? item.image : "https://placeholder.com";
        const tituloLimpo = item.title.replace(/"/g, '&quot;').replace(/'/g, "\\'");
        
        card.innerHTML = `
            <img class="card-img-top" src="${capa}" alt="${tituloLimpo}">
            <div class="card-body d-flex flex-column justify-content-between">
                <div>
                    <div class="d-flex justify-content-between align-items-end mb-2">
                        <span class="badge bg-secondary text-capitalize">${item.type}</span>
                        <strong class="text-warning">⭐ ${item.score || 'N/A'}</strong>
                    </div>
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text small text-muted text-truncate-3">${item.synopsis || 'Sem sinopse disponível.'}</p>
                </div>
                
                <!-- Div âncora criada para gerenciar os elementos dinâmicos de ação -->
                <div class="action-container-${item.id} mt-3"></div>
            </div>
        `;

        const containerAcao = card.querySelector(`.action-container-${item.id}`);

        if (!isEstatico) {
            const selectStatus = document.createElement('select');
            selectStatus.id = `status-${item.id}`;
            selectStatus.className = 'status-select form-select form-select-sm mb-2';
            selectStatus.innerHTML = `
                <option value="">-- Mudar Status --</option>
                <option value="watching">Assistindo</option>
                <option value="completed">Completado</option>
                <option value="plan_to_watch">Planejado</option>
                <option value="dropped">Abandonado</option>
                <option value="on_hold">Em Espera</option>
            `;

            // O escutador dinâmico repassa o próprio container alvo como parâmetro
            selectStatus.addEventListener('change', (e) => {
                this.alternarFormulario(item.id, e.target.value, containerAcao, tituloLimpo, item.type, capa);
            });

            containerAcao.appendChild(selectStatus);
        } else {
            containerAcao.innerHTML = `<p style="margin:5px 0 0 0; font-size:12px; color:#666;">📍 Plataforma: ${item.platform || 'N/I'}</p>`;
        }

        return card;
    }

    alternarFormulario(id, val, containerAlvo, titulo, tipo, capa) {
        // Localiza e limpa qualquer tracker anterior que já esteja aberto neste card
        const formAntigo = containerAlvo.querySelector(`.form-tracker-dinamico`);
        if (formAntigo) {
            formAntigo.remove();
        }

        // Se o usuário selecionou a opção vazia de volta, cancela a criação
        if (val === "") return;

        // Cria o fragmento que agrupa todos os novos campos do formulário
        const divForm = document.createElement('div');
        divForm.className = 'form-tracker-dinamico mt-2 border-top pt-2';

        divForm.innerHTML = `
            <div class="mb-2">
                <label class="form-label small mb-1 fw-bold">Plataforma</label>
                <select id="plat-${id}" class="form-select form-select-sm">
                    <option value="Netflix">Netflix</option>
                    <option value="Crunchyroll">Crunchyroll</option>
                    <option value="Disney+">Disney+</option>
                    <option value="Prime Video">Prime Video</option>
                    <option value="Max">Max</option>
                    <option value="Stremio">Stremio/Torrent</option>
                </select>
            </div>
            <div class="row g-2 mb-2">
                <div class="col-8">
                    <label class="form-label small mb-1 fw-bold">Minha Nota</label>
                    <select id="rate-${id}" class="form-select form-select-sm">
                        <option value="10">⭐ (10) Obra-Prima</option>
                        <option value="9">⭐ (9) Excelente</option>
                        <option value="8">⭐ (8) Muito Bom</option>
                        <option value="7">⭐ (7) Bom</option>
                        <option value="6">⭐ (6) OK</option>
                        <option value="5">⭐ (5) Mediano</option>
                        <option value="4">⭐ (4) Ruim</option>
                        <option value="3">⭐ (3) Muito Ruim</option>
                        <option value="2">⭐ (2) Horrível</option>
                        <option value="1">⭐ (1) Tragédia</option>
                    </select>
                </div>
                <div class="col-4">
                    <label class="form-label small mb-1 fw-bold">Episódios</label>
                    <input type="number" id="ep-${id}" class="form-control form-control-sm" value="0" min="0">
                </div>
            </div>
            <div class="form-check mb-2">
                <input type="checkbox" id="rew-${id}" class="form-check-input">
                <label for="rew-${id}" class="form-check-label small">Estou revendo</label>
            </div>
            <div class="row g-2 mb-3">
                <div class="col-6">
                    <label class="form-label small mb-1 fw-bold">Início</label>
                    <input type="date" id="start-${id}" class="form-control form-control-sm">
                </div>
                <div class="col-6">
                    <label class="form-label small mb-1 fw-bold">Fim</label>
                    <input type="date" id="end-${id}" class="form-control form-control-sm">
                </div>
            </div>
        `;

        // Instancia o botão de confirmação com escopo léxico puro
        const btnSalvar = document.createElement('button');
        btnSalvar.className = 'btn btn-success btn-sm w-100 btn-salvar-dinamico';
        btnSalvar.textContent = 'Confirmar e Salvar';
        
        btnSalvar.addEventListener('click', async () => {
            if (typeof window.salvarItemCompleto === 'function') {
                await window.salvarItemCompleto(id, titulo, tipo, capa);
            } else {
                console.error("Erro: A função global 'salvarItemCompleto' não foi encontrada.");
            }
        });

        divForm.appendChild(btnSalvar);
        containerAlvo.appendChild(divForm);
    }


    async carregarListaPessoal() {
        const savedGrid = document.getElementById('saved-grid');
        if (!savedGrid) return;
        
        savedGrid.innerHTML = '<p>Carregando sua lista...</p>';

        try {
            const dados = await this.vm.obterCatalogo();
            const listaOrdenada = dados.sort(
                (b,a) => new Date(a.Adicao).getTime() - new Date(b.Adicao).getTime()
            ); 

            if (!listaOrdenada || listaOrdenada.length === 0) {
                savedGrid.innerHTML = '<p>Sua lista está vazia. Volte para a busca e adicione mídias!</p>';
                return;
            }

            savedGrid.innerHTML = '';
            
            // LÓGICA DE PAGINAÇÃO: Calcula quais itens pertencem à página ativa
            const indiceInicio = (this.paginaAtualColecao - 1) * this.itensPorPaginaColecao;
            const indiceFim = indiceInicio + this.itensPorPaginaColecao;
            const itensPaginados = listaOrdenada.slice(indiceInicio, indiceFim);

            // Renderiza apenas os cards da página atual
            itensPaginados.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';

                const dataInicio = item.Inicio ? metodoData.formatarDataBR(item.Inicio) : 'Não iniciada';
                const dataFim = item.Fim ? metodoData.formatarDataBR(item.Fim) : 'Não finalizada';
                const textoNota = item.Score ? item.Score : 'Sem nota';

                card.innerHTML = 
                    '<img class="card-img-top" src="' + item.Capa + '" alt="' + item.Titulo + '">' +
                    '<div class="card-body">' +
                        '<h5 class="card-title">' + item.Titulo + '</h5>' +
                        '<p class="card-text">' + item.Titulo + '</p>' +
                        '<strong>Tipo:</strong> ' + item.Tipo.descricao + '<br>' +
                        '<strong>Onde:</strong> ' + item.Plataforma.descricao + '<br>' +
                        '<strong>Início:</strong> ' + dataInicio + '<br>' +
                        '<strong>Fim:</strong> ' + dataFim + '' +
                    '</div>' +
                    '<div class="card-footer">' +
                        '<small class="text-muted">' +
                            'Minha Nota: ' + textoNota +
                        '</small>' +
                    '</div>';

                savedGrid.appendChild(card);
            });

            // Adiciona a barra de paginação logo abaixo dos cards
            const totalPaginas = Math.ceil(listaOrdenada.length / this.itensPorPaginaColecao);
            //this.renderizarControlesPaginacao(savedGrid, totalPaginas);
            renderizarControlesPaginacao(savedGrid, totalPaginas, this);
        } catch (error) {
            savedGrid.innerHTML = '<p>Erro ao carregar sua lista.</p>';
            console.error(error);
        }
    };

    // Exemplo de método para incluir na sua CatalogoView
    async dispararAtualizacaoGeralMídias() {
    abrirModalAcao({
        titulo: "Atualizar Catálogo via TMDB",
        conteudoHTML: `
        <p>Deseja sincronizar e atualizar as informações dos 200 títulos do seu banco de dados com o TMDB agora?</p>
        <div id="status-sincronizacao-lote" class="text-muted small fw-bold"></div>
        `,
        textoConfirmar: "Iniciar Atualização",
        classeBotao: "btn-primary",

            onConfirmar: async () => {
                const containerStatus = document.getElementById("status-sincronizacao-lote");
                
                try {
                if (containerStatus) containerStatus.innerHTML = "⏳ Pesquisando títulos no TMDB e vinculando identificadores...";

                const resultado = await this.vm.atualizarTodoCatalogoViaTMDB2((mensagem) => {
                    if (containerStatus) containerStatus.innerHTML = `⏳ ${mensagem}`;
                });

                if (containerStatus) {
                    containerStatus.innerHTML = `✅ Concluído! ${resultado.processados} itens vinculados e atualizados. Falhas: ${resultado.erros}`;
                }
                
                // 🌟 CORREÇÃO: Atualiza a interface de forma segura verificando qual elemento existe no DOM
                const possuiTabela = document.getElementById("tabelaCatalogo");
                const possuiGridCards = document.getElementById("saved-grid");

                if (possuiTabela) {
                    await this.listarCatalogo();
                } else if (possuiGridCards) {
                    await this.carregarListaPessoal();
                }
                
                } catch (erro) {
                if (containerStatus) containerStatus.innerHTML = `❌ Ocorreu um erro crítico: ${erro.message}`;
                return false;
                }
            }
        });
    };

}
