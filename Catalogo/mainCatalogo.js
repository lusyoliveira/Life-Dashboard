import { CatalogoViewModel } from "./CatalogoViewModel.js";
import { CatalogoView } from "./CatalogoView.js";
import { formatarParaISO } from "../js/metodoData.js";
import Catalogo from "../Catalogo/catalogo.js";

document.addEventListener("DOMContentLoaded", async () => {
  const vm = new CatalogoViewModel();
  const catalogoView = new CatalogoView(vm);
  
  const formCatalogo = document.getElementById("catalogo-form");
  const btnCancelar = document.getElementById("cancelar-catalogo");

  //CRUD
  await catalogoView.listarCatalogo("linhas");

  formCatalogo.addEventListener("submit", async (e) => {
    e.preventDefault();
    
        const idInput = document.getElementById('id-adicionar').value;
        const descricao = document.getElementById('titulo-adicionar').value;
        const capa = document.getElementById('capa-adicionar').value;
        const dataInicio = document.getElementById('data-inicio').value;
        const dataFim = document.getElementById('data-fim').value;
        const tipo = document.getElementById('tipo-adicionar').value;
        const status = document.getElementById('status-adicionar').value;
        const plataforma = document.getElementById('plataforma-adicionar').value;
        const episodios = document.getElementById('episodios-adicionar').value;
        const assistidos = document.getElementById('assistidos-adicionar').value;
        const temporada = document.getElementById('temporada-adicionar').value;
        const pontuacao = document.getElementById('pontuacao-adicionar').value;
        const vezes = document.getElementById('vezes-adicionar').value;
        
        let adicaoOriginal = null;

        // Se for edição, buscar dados originais para preservar Adicao
        if (idInput) {
          const tituloExistente = await vm.obterTituloPorID(idInput);
          if (tituloExistente) {
            adicaoOriginal = tituloExistente.Adicao;
          }
        }

        const titulo = new Catalogo(
          idInput ? idInput : null,
          descricao,
          capa,
          tipo,
          status,
          plataforma,
          formatarParaISO(dataInicio),
          dataFim === '' ? '' : formatarParaISO(dataFim),
          Number(episodios),
          Number(assistidos),
          Number(temporada),
          Number(pontuacao),
          Number(vezes),        
          adicaoOriginal 
        );
          
    await vm.salvarTitulo(titulo);
    catalogoView.listarCatalogo("linhas");
    e.target.reset();
  });

  btnCancelar.addEventListener('click', () => {
    formCatalogo.reset();
  });

  //Contagem
  const resumo = vm.resumoGeral();
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
  catalogoView.renderContagemGeral("contagem-emespera", "Em-Espera", resumo);
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
  catalogoView.renderCardStatus("Em-Espera", "lista-espera");
  catalogoView.renderCardStatus("Dropped", "lista-dropped");

  //Card por Tipo
  catalogoView.renderCardGeral("lista-geral");
  catalogoView.renderCardTipo("Filme", "lista-filmes");
  catalogoView.renderCardTipo("Serie", "lista-series");
});
