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
        this.editarColecao();
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
            
            const possuiTabela = document.getElementById("tabelaCatalogo");
            const possuiGridCards = document.getElementById("saved-grid");
            if (possuiTabela) {
                await this.listarCatalogo();
            } else if (possuiGridCards) {
                await this.listarColecao();
            }
            }
        });

        limparFormulario();

        await this.listarTipos("tipo-adicionar");
        await this.listarPlataforma("plataforma-adicionar");
        await this.listarStatus("status-adicionar");

        // Atualiza o título da modal com base no ID do TMDB, se disponível
        this.atualizarTituloPorIDTMDB();

        if(idTitulo) {
            this.atualizarTituloPorIDTMDB(idTitulo);
        } else {
            this.vem.obterDadosTMDB
        }
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
                
                // Atualiza a tela de forma adaptável baseado no componente ativo no DOM
                const possuiTabela = document.getElementById("tabelaCatalogo");
                const possuiGridCards = document.getElementById("saved-grid");

                if (possuiTabela) {
                    await this.listarCatalogo();
                } else if (possuiGridCards) {
                    await this.listarColecao();
                }
            }
        });

        // Carrega as tabelas auxiliares nos selects da modal
        await this.listarTipos("tipo-adicionar");
        await this.listarPlataforma("plataforma-adicionar");
        await this.listarStatus("status-adicionar");

        // Preenchimento da Aba 1 (Dados Gerais)
        document.getElementById("id-adicionar").value = titulo.id;
        document.getElementById('titulo-adicionar').value = titulo.Titulo;
        document.getElementById('capa-adicionar').value = titulo.Capa;
        document.getElementById('data-inicio').value = titulo.Inicio ? new Date(titulo.Inicio).toISOString().slice(0, 16) : '';
        document.getElementById('data-fim').value = titulo.Fim ? new Date(titulo.Fim).toISOString().slice(0, 16) : '';
        document.getElementById('tipo-adicionar').value = titulo.Tipo.id;
        document.getElementById('status-adicionar').value = titulo.Status.id;
        document.getElementById('plataforma-adicionar').value = titulo.Plataforma.id;
        document.getElementById('episodios-adicionar').value = titulo.Episodios;
        document.getElementById('assistidos-adicionar').value = titulo.Assistidos;
        document.getElementById('temporada-adicionar').value = titulo.Temporadas;
        document.getElementById('pontuacao-adicionar').value = titulo.Score;   
        document.getElementById('vezes-adicionar').value = titulo.Vezes;  

        // Preenchimento dos metadados ocultos de controle
        if(document.getElementById('id-tmdb-adicionar')) document.getElementById('id-tmdb-adicionar').value = titulo.IdTMDB || '';
        if(document.getElementById('original-name-adicionar')) document.getElementById('original-name-adicionar').value = titulo.Original_Name || '';
        if(document.getElementById('media-type-adicionar')) document.getElementById('media-type-adicionar').value = titulo.Media_Type || '';
        if(document.getElementById('genres-ids-adicionar')) document.getElementById('genres-ids-adicionar').value = titulo.Genres_Ids || '';
        if(document.getElementById('popularity-adicionar')) document.getElementById('popularity-adicionar').value = titulo.Popularity || '';
        if(document.getElementById('first-air-date-adicionar')) document.getElementById('first-air-date-adicionar').value = titulo.First_Air_Date || '';
        if(document.getElementById('year-adicionar')) document.getElementById('year-adicionar').value = titulo.Year || '';
        if(document.getElementById('vote-average-adicionar')) document.getElementById('vote-average-adicionar').value = titulo.Vote_Average || '';

        // Preenchimento da Aba 2 (Metadados TMDB) e Elementos de Preview
        if(document.getElementById('overview-adicionar')) document.getElementById('overview-adicionar').value = titulo.Overview || '';
        
        // Só atribui o valor se o campo realmente existir no HTML
        const txtAreaPoster = document.getElementById('poster-path-adicionar');
        if (txtAreaPoster) {
            txtAreaPoster.value = titulo.Poster_Path || '';
        }
        
        // Trata os labels informativos da interface do TMDB
        if(document.getElementById('tmdb-lbl-vote')) document.getElementById('tmdb-lbl-vote').textContent = titulo.Vote_Average || 'N/A';
        if(document.getElementById('tmdb-lbl-pop')) document.getElementById('tmdb-lbl-pop').textContent = titulo.Popularity ? Number(titulo.Popularity).toFixed(1) : 'N/A';
        if(document.getElementById('tmdb-lbl-year')) document.getElementById('tmdb-lbl-year').textContent = titulo.Year || 'N/A';

        // Renderiza o pôster no preview gráfico
        const previewImg = document.getElementById('tmdb-preview-poster');
        if (previewImg && titulo.Poster_Path) {
            const stringPoster = String(titulo.Poster_Path).trim();
            if (stringPoster && stringPoster !== "" && !stringPoster.includes("[object")) {
                previewImg.src = stringPoster.startsWith("data:image") || stringPoster.startsWith("http")
                    ? stringPoster
                    : "data:image/jpeg;base64," + stringPoster;
            } else {
                previewImg.src = "https://placeholder.com";
            }
        }

        // Atualiza o título da modal com base no ID do TMDB, se disponível
        const descTitulo =  document.getElementById('titulo-adicionar').value
        this.atualizarTituloPorIDTMDB(descTitulo);
    };

    // Método para salvar o formulário de criação/edição de título
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
        const originalName = form.querySelector('#titulo-adicionar').value;
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

    // Método para listar a coleção de títulos e renderizar em cards
    async listarColecao() {
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
            
            const indiceInicio = (this.paginaAtualColecao - 1) * this.itensPorPaginaColecao;
            const indiceFim = indiceInicio + this.itensPorPaginaColecao;
            const itensPaginados = listaOrdenada.slice(indiceInicio, indiceFim);

            itensPaginados.forEach(item => {
                const card = document.createElement('div');
                // Adicionado 'user-select-none' e estilo de cursor para indicar que o card é clicável
                card.className = 'card h-100 shadow-sm';
                card.style.cursor = 'pointer';
                // INJEÇÃO CRÍTICA: Vincula o ID do banco de dados ao card
                card.setAttribute('data-id', item.id);

                const dataInicio = item.Inicio ? metodoData.formatarDataBR(item.Inicio) : 'Não iniciada';
                const dataFim = item.Fim ? metodoData.formatarDataBR(item.Fim) : 'Não finalizada';
                const textoNota = item.Score ? item.Score : 'Sem nota';

                // Tratamento dinâmico para renderizar a Capa Base64 ou URL da web
                let fonteImagem = item.Capa || "https://placeholder.com";
                const stringPoster = item.Poster_Path ? String(item.Poster_Path).trim() : "";

                if (stringPoster && stringPoster !== "" && !stringPoster.includes("[object")) {
                    if (stringPoster.startsWith("data:image") || stringPoster.startsWith("http")) {
                        fonteImagem = stringPoster;
                    } else {
                        fonteImagem = "data:image/jpeg;base64," + stringPoster;
                    }
                }

                card.innerHTML = 
                    '<img class="card-img-top" src="' + fonteImagem + '" alt="' + item.Titulo + '" style="height: 320px;">' +
                    '<div class="card-body d-flex flex-column justify-content-between">' +
                        '<div>' +
                            '<h5 class="card-title text-truncate">' + item.Titulo + '</h5>' +
                            '<p class="card-text small text-muted mb-2">' +
                                '<strong>Tipo:</strong> ' + (item.Tipo?.descricao || 'Não informado') + '<br>' +
                                '<strong>Onde:</strong> ' + (item.Plataforma?.descricao || 'Não informado') +
                            '</p>' +
                        '</div>' +
                        '<div class="border-top pt-2 mt-2 small text-muted">' +
                            '📅 ' + dataInicio + ' até ' + dataFim +
                        '</div>' +
                    '</div>' +
                    '<div class="card-footer bg-transparent border-top-0">' +
                        '<span class="badge bg-primary w-100 py-2">⭐ Nota: ' + textoNota + '</span>' +
                    '</div>';

                // Encapsula o card em uma coluna estruturada do Bootstrap Grid
                const coluna = document.createElement('div');
                coluna.className = 'col-md-3 col-sm-6 mb-4';
                coluna.appendChild(card);

                savedGrid.appendChild(coluna);
            });

            const totalPaginas = Math.ceil(listaOrdenada.length / this.itensPorPaginaColecao);
            renderizarControlesPaginacao(savedGrid, totalPaginas, this);
        } catch (error) {
            savedGrid.innerHTML = '<p>Erro ao carregar sua lista.</p>';
            console.error(error);
        }
    };

    // Método para listar o catálogo e renderizar na tabela
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

    // Renderiza o painel de estatistica na página de catálogo, com base no tipo de mídia (Filme, Serie, Desenho)
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

    // Renderiza os gráficos de barra para Tipo, Status e Plataforma
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
    };

    // Renderiza os títulos adicionados recentemente na página de catálogo
    renderRecentes(elementoId)  {
        const recentes = this.vm.recentes(5);       
        const elementoDestino = document.getElementById(elementoId);

        if (!elementoDestino) return;
        elementoDestino.innerHTML = "";
        
        recentes.forEach(titulo => {
            const divCard = document.createElement('div');
            divCard.classList.add('col','card', 'p-1', 'm-2');

            const imgCapa = document.createElement('img');
            
            let fonteImagem = titulo.Capa; 
            let stringPoster = "";

            // TRATAMENTO CRÍTICO PARA PARSE DE BLOB/BUFFER DO SEQUELIZE
            if (titulo.Poster_Path) {
                // Cenário A: Se o Sequelize devolveu um objeto contendo a Array de dados ({type: 'Buffer', data: [...]})
                if (typeof titulo.Poster_Path === 'object' && titulo.Poster_Path.data) {
                    const numeros = titulo.Poster_Path.data;
                    stringPoster = String.fromCharCode.apply(null, new Uint8Array(numeros));
                } 
                // Cenário B: Se ele veio como uma instância direta de Uint8Array
                else if (titulo.Poster_Path instanceof Uint8Array || titulo.Poster_Path.constructor?.name === "Uint8Array") {
                    stringPoster = String.fromCharCode.apply(null, new Uint8Array(titulo.Poster_Path));
                }
                // Cenário C: Se já for uma String comum de texto
                else if (typeof titulo.Poster_Path === 'string') {
                    stringPoster = titulo.Poster_Path.trim();
                }
            }

            // Agora que garantimos que 'stringPoster' é um texto puro, fazemos a montagem da imagem
            if (stringPoster && stringPoster !== "" && !stringPoster.includes("[object")) {
                if (stringPoster.startsWith("data:image") || stringPoster.startsWith("http")) {
                    fonteImagem = stringPoster;
                } else {
                    // Se for o texto Base64 cru (como o seu /9j/4AAQ...), adiciona o prefixo
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
    
    // Renderiza os títulos recentes por status na página de catálogo
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
    };
    
    // Renderiza os títulos recentes por tipo na página de catálogo
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

    // Renderiza os títulos recentes de forma geral na página de catálogo
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
    };

    // Renderiza a contagem geral de títulos, episódios, assistidos, dias, horas e pontuação média na página de catálogo
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
    };

    // Renderiza os títulos assistindo na página home
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

    // Renderiza os títulos mais frequentes na página do catalogo
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

    //Lista os status disponíveis no select da página de catálogo
    async listarStatus(elementoId) { 
        const statusVM = new StatusViewModel();  
        const status =  await statusVM.obterStatus('Catalogo')
        
        popularSelect(status,elementoId)
    };

    //Lista os tipos disponíveis no select da página de catálogo
    async listarTipos(elementoId) {    
        const tiposVM = new TipoViewModel();
        const tipos =  await tiposVM.obterTipos('Catalogo')
        
        popularSelect(tipos,elementoId)
    };

    //Lista as plataformas disponíveis no select da página de catálogo
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
            const items = await this.vm.obterDadosTMDB(termobusca, elementoId);
            
            // Limpa o estado de carregamento
            elementoDestino.innerHTML = '';
            
            if (!items || items.length === 0) {
                elementoDestino.innerHTML = '<p>Nenhuma mídia encontrada no TMDB.</p>';
                return;
            }
            
            // Cria a div com as classes de grid do Bootstrap
            const divLinha = document.createElement('div');
            divLinha.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4';
            
            items.forEach(item => { 
                // 1. Cria a coluna do grid
                const divColuna = document.createElement('div');
                divColuna.className = 'col';

                // 2. Cria a estrutura do card
                const elementoCard = document.createElement('div');
                elementoCard.className = 'card h-100';
                
                const capa = item.image ? item.image : "https://placeholder.com";
                const tituloLimpo = item.title.replace(/"/g, '&quot;').replace(/'/g, "\\'");
                
                elementoCard.innerHTML = `
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

                // 3. Adiciona os elementos de ação dinâmicos do select (antigo bloco !isEstatico)
                const containerAcao = elementoCard.querySelector(`.action-container-${item.id}`);
                
                const selectStatus = document.createElement('select');
                selectStatus.id = "status-adicionar";
                selectStatus.className = 'status-select form-select form-select-sm mb-2';
                selectStatus.required = true;
                
                this.listarStatus("status-adicionar");


                // Escutador do select que invoca o método alternarFormulario da classe
                selectStatus.addEventListener('change', (e) => {

                    const payload = {
                        statusId: document.getElementById('status-adicionar').value,
                        episodios: item.episodes || 0,
                        temporada: item.season || 0,
                        idtmdb: item.id,
                        originalName: item.originalName,
                        overview: item.overview,
                        posterPath: item.posterPath,
                        mediaType: item.mediaType,
                        genresIds: item.genresIds,
                        popularity: item.popularity,
                        firstAirDate: item.firstAirDate,
                        year: new Date(item.releaseDate || item.firstAirDate).getFullYear(),
                        voteAverage: item.voteAverage || 0
                    }

                    this.alternarFormulario(e.target.value, containerAcao, payload);
                });

                containerAcao.appendChild(selectStatus);

                // 4. Aninha os elementos: card dentro da coluna, coluna dentro da linha
                divColuna.appendChild(elementoCard);
                divLinha.appendChild(divColuna);
            });

            // 5. Injeta a linha completa preenchida no container de destino
            elementoDestino.appendChild(divLinha);

        } catch (error) {
            elementoDestino.innerHTML = '<p>Erro na conexão com o servidor.</p>';
            console.error(error);
        }
    };

    alternarFormulario( val, containerAlvo, payload) {
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
                <label for="plataforma-adicionar" class="form-label small mb-1 fw-bold">Plataforma</label>
                <select class="form-select" id="plataforma-adicionar" required></select>
            </div>
            <div class="row g-2 mb-2">
                <div class="col-8">
                    <label class="form-label small mb-1 fw-bold">Minha Nota</label>
                    <select id="pontuacao-adicionar" class="form-select form-select-sm">
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
                    <label for="tipo-adicionar" class="form-label small fw-bold">Tipo</label>
                    <select class="form-select form-select-sm" id="tipo-adicionar" required></select>
                </div>
            </div>
            <div class="row g-2 mb-2">                
                <div class="col-4">
                    <label class="form-label small mb-1 fw-bold">Episódios Assistidos</label>
                    <input type="number" id="assistidos-adicionar" class="form-control form-control-sm" value="0" min="0" required>
                </div>
            </div>

            <div class="row g-2 mb-3">
                <div class="col-6">
                    <label class="form-label small mb-1 fw-bold">Início</label>
                    <input type="date" id="data-inicio" class="form-control form-control-sm">
                </div>
                <div class="col-6">
                    <label class="form-label small mb-1 fw-bold">Fim</label>
                    <input type="date" id="data-fim" class="form-control form-control-sm">
                </div>
            </div>
            <div class="mb-2">
                <input type="hidden" id="status-adicionar" value="${payload.statusId}">
                <input type="hidden" id="temporada-adicionar" value="${payload.temporada}">
                <input type="hidden" id="episodios-adicionar" value="${payload.episodios}">
                <input type="hidden" id="idtmdb-adicionar" value="${payload.idtmdb}">
                <input type="hidden" id="originalName-adicionar" value="${payload.originalName}">
                <input type="hidden" id="overview-adicionar" value="${payload.overview}">
                <input type="hidden" id="posterPath-adicionar" value="${payload.posterPath}">
                <input type="hidden" id="mediaType-adicionar" value="${payload.mediaType}">
                <input type="hidden" id="genresIds-adicionar" value="${payload.genresIds}">
                <input type="hidden" id="popularity-adicionar" value="${payload.popularity}">
                <input type="hidden" id="firstAirDate-adicionar" value="${payload.firstAirDate}">
                <input type="hidden" id="year-adicionar" value="${payload.year}">                
            </div>
        `;

        this.listarTipos("tipo-adicionar");
        this.listarPlataforma("plataforma-adicionar");

        // Instancia o botão de confirmação com escopo léxico puro
        const btnSalvar = document.createElement('button');
        btnSalvar.className = 'btn btn-success btn-sm w-100 btn-salvar-dinamico';
        btnSalvar.textContent = 'Confirmar e Salvar';
        
        btnSalvar.addEventListener('click', async () => {
             await this.salvarFormularioCatalogo(formAntigo);
        });

        divForm.appendChild(btnSalvar);
        containerAlvo.appendChild(divForm);
    }
    // Exemplo de método para incluir na sua CatalogoView
    async dispararAtualizacaoGeralMidias() {
        abrirModalAcao({
        titulo: "Atualizar Catálogo via TMDB",
        conteudoHTML: `
        <p>Deseja sincronizar e atualizar as informações os títulos do seu banco de dados com o TMDB agora?</p>
        <div id="status-sincronizacao-lote" class="text-muted small fw-bold"></div>
        `,
        textoConfirmar: "Iniciar Atualização",
        classeBotao: "btn-primary",

            onConfirmar: async () => {
                const containerStatus = document.getElementById("status-sincronizacao-lote");
                
                try {
                if (containerStatus) containerStatus.innerHTML = "⏳ Pesquisando títulos no TMDB e vinculando identificadores...";

                const resultado = await this.vm.atualizarCatalogoTMDB((mensagem) => {
                    if (containerStatus) containerStatus.innerHTML = `⏳ ${mensagem}`;
                });

                if (containerStatus) {
                    containerStatus.innerHTML = `✅ Concluído! ${resultado.processados} itens vinculados e atualizados. Falhas: ${resultado.erros}`;
                }
                
                // Atualiza a interface de forma segura verificando qual elemento existe no DOM
                const possuiTabela = document.getElementById("tabelaCatalogo");
                const possuiGridCards = document.getElementById("saved-grid");

                if (possuiTabela) {
                    await this.listarCatalogo();
                } else if (possuiGridCards) {
                    await this.listarColecao();
                }
                
                } catch (erro) {
                if (containerStatus) containerStatus.innerHTML = `❌ Ocorreu um erro crítico: ${erro.message}`;
                return false;
                }
            }
        });
    };

    //Método simplificado que reutiliza nativamente a lógica unificada da ViewModel
    atualizarTituloPorIDTMDB(idTitulo) {
        const btnBuscar = document.getElementById("btn-buscar-tmdb-manual");
        if (!btnBuscar) return;

        btnBuscar.addEventListener("click", async () => {
            const idManualDigitado = document.getElementById("id-tmdb-adicionar")?.value.trim();

            if (!idManualDigitado && idTitulo) {
                // Se o campo de ID manual estiver vazio na modal de edição, captura o título do form para tentar por nome
                const nomeInput = document.getElementById('titulo-adicionar').value;
                const selectTipo = document.getElementById("tipo-adicionar");
                const textoTipo = selectTipo.options[selectTipo.selectedIndex]?.text || '';
                
                btnBuscar.disabled = true;
                btnBuscar.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Vinculando...`;
                
                try {
                    await this.vm.atualizarCatalogoTMDB(null, idTitulo, nomeInput, textoTipo);
                    alert(`✅ Metadados sincronizados por texto com sucesso!`);
                } catch(e) {
                    alert(`❌ Erro ao sincronizar: ${e.message}`);
                } finally {
                    btnBuscar.disabled = false;
                    btnBuscar.innerHTML = `<i class="bi bi-arrow-clockwise"></i> Buscar e Vincular`;
                }
                return;
            }

            btnBuscar.disabled = true;
            btnBuscar.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Vinculando...`;

            try {
                // Dispara o barramento da ViewModel passando o id do banco
                await this.vm.atualizarCatalogoTMDB(null, idTitulo);
                alert(`✅ Título sincronizado com sucesso baseado no ID fornecido!`);
                if(document.getElementById("id-tmdb-adicionar")) document.getElementById("id-tmdb-adicionar").value = "";
            } catch (erro) {
                alert(`❌ Falha ao vincular mídias: ${erro.message}`);
            } finally {
                btnBuscar.disabled = false;
                btnBuscar.innerHTML = `<i class="bi bi-arrow-clockwise"></i> Buscar e Vincular`;
            }
        });
    };

    //Captura o clique em qualquer lugar do card e abre a modal de edição
    editarColecao() {
        const gridSalvo = document.getElementById("saved-grid");
        if (!gridSalvo) return;

        gridSalvo.addEventListener("click", async (e) => {
            // Procura se o clique aconteceu dentro de um elemento que possui o atributo 'data-id'
            const cardAlvo = e.target.closest("[data-id]");
            if (!cardAlvo) return;

            const idTitulo = cardAlvo.dataset.id;           
            // Dispara o mesmo método de edição que a tabela usa
            await this.abrirModalEditarCatalogo(idTitulo);
        });
    }
}
