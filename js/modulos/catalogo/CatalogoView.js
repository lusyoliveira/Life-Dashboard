import { calculaTempoData } from "../../Utils/metodoData.js";
export class CatalogoView {
    constructor(vm) {
        this.vm = vm;
    }

    //Formulário
    async editarTitulo(idTitulo) {
       const titulo = await this.vm.obterTituloPorID(idTitulo)
        
       if (titulo) {
            document.getElementById('id-adicionar').value = idTitulo;
            document.getElementById('titulo-adicionar').value = titulo.Titulo;
            document.getElementById('capa-adicionar').value = titulo.Capa;
            document.getElementById('data-inicio').value = new Date(titulo.Inicio).toISOString().slice(0, 16);
            document.getElementById('data-fim').value = titulo.Fim === '' ? '' : new Date(titulo.Fim).toISOString().slice(0, 16);
            document.getElementById('tipo-adicionar').value = titulo.Tipo;
            document.getElementById('status-adicionar').value = titulo.Status;
            document.getElementById('plataforma-adicionar').value = titulo.Onde;
            document.getElementById('episodios-adicionar').value = titulo.Episodios;
            document.getElementById('assistidos-adicionar').value = titulo.Assistidos;
            document.getElementById('temporada-adicionar').value = titulo.Temporadas;
            document.getElementById('pontuacao-adicionar').value = titulo.Score;   
            document.getElementById('vezes-adicionar').value = titulo.Vezes;   
        } else {
            alert('Título não encontrado!');
        }
    }

    // TABELA
    async listarCatalogo(elementoId) {
        const tabela = document.getElementById(elementoId);
        tabela.innerHTML = "";
        const catalogo = await this.vm.obterCatalogo();
        
        if (!tabela) return;
        
        if ($.fn.DataTable.isDataTable('.datatable')) {
        $('.datatable').DataTable().clear().destroy(); 
        }

        catalogo.forEach(titulo => {
            const tr = document.createElement('tr');
    
            const tdTitulo = document.createElement('td');
            tdTitulo.textContent = titulo.Titulo;

            const tdTipo = document.createElement('td');
            tdTipo.classList.add('text-center');
            tdTipo.textContent = titulo.Tipo;

            const tdStatus = document.createElement('td');
            tdStatus.classList.add('text-center');
            tdStatus.textContent = titulo.Status;

            const tdOnde = document.createElement('td');
            tdOnde.classList.add('text-center');
            tdOnde.textContent = titulo.Onde;

            const tdInicio = document.createElement('td');
            const dataIniUTC = new Date(titulo.Inicio);                
            const dataIniLocal = new Date(dataIniUTC.getTime() + dataIniUTC.getTimezoneOffset() * 60000);
            tdInicio.textContent = dataIniLocal.toLocaleDateString("pt-BR");

            const tdFim = document.createElement('td');
            const dataFimUTC = new Date(titulo.Fim);                
            const dataFimLocal = new Date(dataFimUTC.getTime() + dataFimUTC.getTimezoneOffset() * 60000);
            tdFim.textContent = dataFimLocal.toLocaleDateString("pt-BR");

            const tdEpisodios = document.createElement('td');
            tdEpisodios.classList.add('text-center');
            tdEpisodios.textContent = titulo.Episodios;

            const tdAssistidos = document.createElement('td');
            tdAssistidos.classList.add('text-center');
            tdAssistidos.textContent = titulo.Assistidos;

            const tdTemporadas = document.createElement('td');
            tdTemporadas.classList.add('text-center');
            tdTemporadas.textContent = titulo.Temporadas;

            const tdScore = document.createElement('td');
            tdScore.classList.add('text-center');
            tdScore.textContent = titulo.Score;

            const tdVezes = document.createElement('td');
            tdVezes.classList.add('text-center');
            tdVezes.textContent = titulo.Vezes;

            const tdDias = document.createElement('td');
            tdDias.classList.add('text-center');
            tdDias.textContent = titulo.Dias;

            const tdBtnEditar = document.createElement('td')
            const tdBtnExcluir = document.createElement('td')

            const btnEditar = document.createElement('button')
            btnEditar.classList.add('btn', 'btn-primary')
            btnEditar.onclick = () => this.editarTitulo(titulo.id)

            const iconeEditar = document.createElement('i')
            iconeEditar.classList.add('bi', 'bi-pencil-fill')
            iconeEditar.setAttribute ('id', 'editar-agenda')

            const btnExcluir = document.createElement('button')
            btnExcluir.classList.add('btn', 'btn-danger')        
            btnExcluir.onclick = async () => {
                try {
                    await this.vm.excluirTitulo(titulo.id)
                } catch(error) {
                    alert('Erro ao excluir agendamento!')
                }
            }

            const iconeExcluir = document.createElement('i')
            iconeExcluir.classList.add('bi', 'bi-trash')
            iconeExcluir.setAttribute('id','excluir-agenda')

            btnEditar.appendChild(iconeEditar)
            btnExcluir.appendChild(iconeExcluir)
            tdBtnEditar.appendChild(btnEditar)
            tdBtnExcluir.appendChild(btnExcluir)
            tr.appendChild(tdTitulo);
            tr.appendChild(tdTipo);
            tr.appendChild(tdStatus);
            tr.appendChild(tdOnde);
            tr.appendChild(tdInicio);
            tr.appendChild(tdFim);
            tr.appendChild(tdEpisodios);
            tr.appendChild(tdAssistidos);
            tr.appendChild(tdTemporadas);
            tr.appendChild(tdScore);
            tr.appendChild(tdVezes);  
            tr.appendChild(tdDias);        
            tr.appendChild(tdBtnEditar)
            tr.appendChild(tdBtnExcluir)
            tabela.appendChild(tr);        
        });
        document.dispatchEvent(new Event('Renderizado'));
    }

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

    // GRÁFICOS
    renderGrafico(canvasId, dados, titulo) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: dados.labels,
                datasets: [{  label: dados.labels,
                                data: dados.data,
                                backgroundColor: [
                                    "#36A2EB",
                                    "#4CAF50", 
                                    "#FF6384", 
                                    "#FFCE56", 
                                    "#9966FF", 
                                    "#ff9f4033",
                                    "#c9cbcf33"  
                                ],
                                borderRadius: 8
                            }]
            },
            
            options: {
                plugins: { title: { display: true, text: titulo }, 
                            legend: { display: false, position: "Left"} 
                        }                
            }            
        });
    }

    renderGraficos() {
        this.renderGrafico("graficoTipo", this.vm.dadosGraficoTipo(), "Títulos por Tipo");
        this.renderGrafico("graficoStatus", this.vm.dadosGraficoStatus(), "Títulos por Status");
        this.renderGrafico("graficoPlataforma", this.vm.dadosGraficoPlataforma(), "Títulos por Plataforma");
    }

    // RECENTES
    renderRecentes(elementoId) {
        const recentes = this.vm.recentes(3);       
        const elementoDestino = document.getElementById(elementoId);

        if (!elementoDestino) return;
            elementoDestino.innerHTML = "";
                recentes.forEach(titulo => {
                const divCardContainer = document.createElement('div');
                    divCardContainer.classList.add('card', 'card-cover', 'h-100', 'overflow-hidden', 'text-bg-dark', 'rounded-4', 'shadow-lg', 'm-1');
                    divCardContainer.style.backgroundImage = `url(${titulo.Capa})`;
                    divCardContainer.style.backgroundSize = 'cover';
                    divCardContainer.style.backgroundPosition = 'center';

                    const divCardBody = document.createElement('div');
                    divCardBody.classList.add('d-flex', 'flex-column', 'h-100', 'p-5', 'pb-3', 'text-white', 'text-shadow-1');

                    const h4Titulo = document.createElement('h4');
                    h4Titulo.classList.add('pt-5', 'mt-5', 'mb-2', 'display-7', 'lh-1', 'fw-bold');
                    h4Titulo.textContent = titulo.Titulo;

                    const ulInfo = document.createElement('ul');
                    ulInfo.classList.add('d-flex', 'justify-content-between', 'align-items-lg-center', 'gap-3', 'list-unstyled', 'mt-auto');
                    const liProgresso = document.createElement('li');
                    liProgresso.classList.add('w-75');

                    const divProgresso = document.createElement('div');
                    divProgresso.classList.add('progress');
                    divProgresso.setAttribute('role', 'progressbar');
                    divProgresso.setAttribute('aria-label', 'Example with label');
                    divProgresso.setAttribute('aria-valuenow', titulo.Status === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100);
                    divProgresso.setAttribute('aria-valuemin', '0');
                    divProgresso.setAttribute('aria-valuemax', '100');

                    const divBarraProgresso = document.createElement('div');
                    divBarraProgresso.classList.add('progress-bar');
                    divBarraProgresso.style.width = `${titulo.Status === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100}%`;
                    divBarraProgresso.textContent = `${titulo.Status === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100}%`;
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
                    divCardBody.appendChild(h4Titulo);
                    divCardBody.appendChild(ulInfo);
                    divCardContainer.appendChild(divCardBody);
                    elementoDestino.appendChild(divCardContainer);
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
                    divProgresso.setAttribute('aria-valuenow', titulo.Status === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100);
                    divProgresso.setAttribute('aria-valuemin', '0');
                    divProgresso.setAttribute('aria-valuemax', '100');
        
                    const divBarraProgresso = document.createElement('div');
                    divBarraProgresso.classList.add('progress-bar');
                    divBarraProgresso.style.width = `${titulo.Status === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100}%`;
                    divBarraProgresso.textContent =  `${titulo.Status === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100}%`;
        
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
        } else if (tipoContagem === 'Em-Espera') {
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
                    spanBadgeTipo.textContent = titulo.Tipo;

                    const spanBadgeStatus = document.createElement('span');
                    spanBadgeStatus.classList.add('badge', 'text-bg-primary');
                    spanBadgeStatus.textContent = titulo.Status;

                    const divProgresso = document.createElement('div');
                    divProgresso.classList.add('progress', 'mt-2');
                    divProgresso.setAttribute('role', 'progressbar');
                    divProgresso.setAttribute('aria-label', 'Progresso Assistindo');
                    divProgresso.setAttribute('aria-valuenow', titulo.Status === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100);
                    divProgresso.setAttribute('aria-valuemin', '0');
                    divProgresso.setAttribute('aria-valuemax', '100');

                    const divBarraProgresso = document.createElement('div');
                    divBarraProgresso.classList.add('progress-bar', 'bg-success');
                    divBarraProgresso.style.width = `${titulo.Status === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100}%`;
                    divBarraProgresso.textContent = `${titulo.Status === 'Planejado' ? 0 : (titulo.Assistidos/titulo.Episodios).toFixed(1)*100}%`;

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
}
