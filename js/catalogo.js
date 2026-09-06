import "./Utils/bootstrap.js";
import { carregarFormulario } from "./Utils/utils.js";
import { CatalogoViewModel } from "./modulos/catalogo/CatalogoViewModel.js";
import { CatalogoView } from "./modulos/catalogo/CatalogoView.js";
import { PlataformaViewModel } from "./modulos/plataformas/PlataformasViewModel.js";
import { PlataformasView } from "./modulos/plataformas/PlataformasView.js";
import { StatusViewModel } from "./modulos/status/StatusViewModel.js";
import { StatusView } from "./modulos/status/StatusView.js";
import { TipoViewModel } from "./modulos/tipos/TipoViewModel.js";
import { TiposView } from "./modulos/tipos/TiposView.js";

export async function inicializarCatalogo() {
    const vm = new CatalogoViewModel();
    const catalogoView = new CatalogoView(vm);  
    const plataformaVM = new PlataformaViewModel();
    const plataformaView = new PlataformasView(plataformaVM);
    const statusVM = new StatusViewModel();
    const statusView = new StatusView(statusVM);
    const tipoVM = new TipoViewModel();
    const tipoView = new TiposView(tipoVM);
    const botaoAdicionar = document.getElementById("adicionarCatalogo");
    const botaoPlataforma = document.getElementById('adiciona-plataforma'); 
    const botaoStatus = document.getElementById('adiciona-status'); 
    const botaoTipo = document.getElementById('adiciona-tipo'); 
    const formCatalogoHTML = await carregarFormulario("/pages/partials/formCatalogo.html");
    //Pesquisa TMDB
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const btnSincronizar = document.getElementById("btnSincronizarTMDB");

    await plataformaView.renderCardPlataformas('lista-plataforma', 'Catalogo');
    await statusView.renderCardStatus('lista-status', 'Catalogo');
    await tipoView.renderCardTipos('lista-tipo', 'Catalogo');
    //await catalogoView.listarCatalogo();
    await catalogoView.carregarListaPessoal();
    
    //Contagem
    const resumo = vm.resumoGeral();
    catalogoView.formHTML = formCatalogoHTML
    catalogoView.renderContagemGeral("geral-progresso", "Progresso", resumo);
    catalogoView.renderContagemGeral("geral-total", "Total", resumo);
    catalogoView.renderContagemGeral("geral-pontuacao", "Pontuacao", resumo);
    catalogoView.renderContagemGeral("geral-assistidos", "Assistidos", resumo);
    catalogoView.renderContagemGeral("geral-episodios", "Episodios", resumo);
    catalogoView.renderContagemGeral("geral-dias", "Dias", resumo);
    catalogoView.renderContagemGeral("geral-horas", "Horas", resumo);
    catalogoView.renderContagemGeral("contagem-completado", "Completado", resumo);
    catalogoView.renderContagemGeral("contagem-assistindo", "Assistindo", resumo);
    catalogoView.renderContagemGeral("contagem-dropped", "Dropped", resumo);
    catalogoView.renderContagemGeral("contagem-emespera", "Em Espera", resumo);
    catalogoView.renderContagemGeral("contagem-planejado", "Planejado", resumo);
    //catalogoView.renderContagemGeral('contagem-anime','Anime', resumo)
    catalogoView.renderContagemGeral("contagem-desenho", "Desenho", resumo);
    catalogoView.renderContagemGeral("contagem-documentario", "Documentário", resumo);
    catalogoView.renderContagemGeral("contagem-filme", "Filme", resumo);
    catalogoView.renderContagemGeral("contagem-serie", "Serie", resumo);
    catalogoView.renderContagemGeral("contagem-show", "Show", resumo);
    catalogoView.renderContagemGeral("contagem-reality", "Reality", resumo);
    //catalogoView.renderContagemGeral('contagem-manga','Manga', resumo)

    //Estatísticas
    catalogoView.renderEstatistica("Serie", "estatistica-serie");
    catalogoView.renderEstatistica("Filme", "estatistica-filme");
    catalogoView.renderEstatistica("Desenho", "estatistica-desenho");

    //Gráficos
    catalogoView.renderGraficos();

    //Adicionados Recentemente
    catalogoView.renderRecentes("recentes");

    //Card por Status
    catalogoView.renderCardStatus("Assistindo", "lista-assistindo");
    catalogoView.renderCardStatus("Planejado", "lista-planejado");
    catalogoView.renderCardStatus("Em Espera", "lista-espera");
    catalogoView.renderCardStatus("Dropped", "lista-dropped");

    //Card Top por Tipo
    catalogoView.renderCardGeral("lista-geral");
    catalogoView.renderCardTipo("Filme", "lista-filmes");
    catalogoView.renderCardTipo("Serie", "lista-series");

    //Card Frequentes
    catalogoView.renderCardFrequentes("Serie", "frequentes-series");
    catalogoView.renderCardFrequentes("Filme", "frequentes-filmes");
    catalogoView.renderCardFrequentes("Desenho", "frequentes-desenho");

    //Adicionar Catalogo
    botaoAdicionar.addEventListener("click", async () => {
        await catalogoView.abrirModalCriarCatalogo();
    });

    //Adiciona plataforma
    botaoPlataforma.addEventListener("click", async (evento) => { 
        evento.preventDefault();   

        const descricaoplataforma = document.getElementById('descricao-plataforma').value
        const inputIdplataforma = document.getElementById('input-id-plataforma').value;

        if (descricaoplataforma === '') {
            alert('É necessário inserir uma plataforma!');
            return
        }
        const plataforma = {
            id: inputIdplataforma ? inputIdplataforma : null,
            descricao: descricaoplataforma,
            Tipo: 'Catalogo'
        }          
        await plataformaView.salvarPlataforma(plataforma);
        await plataformaView.renderCardPlataformas('lista-plataforma', 'Catalogo');

        document.getElementById('descricao-plataforma').value = ''
        document.getElementById('input-id-plataforma').value = ''
    });

  //Adiciona status
    botaoStatus.addEventListener("click", async (evento) => { 
        evento.preventDefault();   

        const descricaostatus = document.getElementById('descricao-status').value
        const inputIdstatus = document.getElementById('input-id-status').value;

        if (descricaostatus === '') {
            alert('É necessário inserir uma status!');
            return
        }
        const status = {
            id: inputIdstatus ? inputIdstatus : null,
            descricao: descricaostatus,
            Tipo: 'Catalogo'
        }          
        await statusView.salvarStatus(status);
        await statusView.renderCardStatus('lista-status', 'Catalogo');

        document.getElementById('descricao-status').value = ''
        document.getElementById('input-id-status').value = ''
    });

  //Adiciona tipo   
    botaoTipo.addEventListener("click", async (evento) => { 
      evento.preventDefault();   

      const descricaotipo = document.getElementById('descricao-tipo').value
      const inputIdtipo = document.getElementById('input-id-tipo').value;

      if (descricaotipo === '') {
          alert('É necessário inserir uma tipo!');
          return
      }
      const tipo = {
          id: inputIdtipo ? inputIdtipo : null,
          descricao: descricaotipo,
          Tipo: 'Catalogo'
      }          
      await tipoView.salvarTipo(tipo);
      await tipoView.renderCardTipos('lista-tipo', 'Catalogo');
      
      document.getElementById('descricao-tipo').value = ''
      document.getElementById('input-id-tipo').value = ''
    });

    //Pesquisa TMDB
    
     searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) catalogoView.renderizarCardsBusca(query,'results-grid');
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) catalogoView.renderizarCardsBusca(query,'results-grid');
        }
    });


        // Aguarda o DOM estar pronto caso o script carregue antes do elemento existir
    if (btnSincronizar) {
        btnSincronizar.addEventListener("click", async () => {
            await catalogoView.dispararAtualizacaoGeralMidias();
        });
    }
};

