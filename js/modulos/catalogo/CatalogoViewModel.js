import api from "../../servicos/metodoApi.js";
import apiTMDB from "../../integracoes/TMDB.js";
import Catalogo from "./catalogoModel.js";
import metodoData from "../../Utils/metodoData.js"
import { TemporadaViewModel } from './TemporadasViewModel.js';

export class CatalogoViewModel {
  constructor(endpoint = "catalogo") {
    this.temporadaVM = new TemporadaViewModel();
    this.endpoint = endpoint;
    this.catalogo = [];
  }

  async obterCatalogo() {
    const catalogoData = await api.buscarDados(this.endpoint);

    this.catalogo = catalogoData.map((titulo) => {
      const titulos = new Catalogo(
        titulo.id,
        titulo.titulo,
        titulo.capa,
        {
          id: titulo.tipoId,
          descricao: titulo.Tipo.descricao
        },
        {
          id: titulo.statusId,
          descricao: titulo.Status.descricao
        },
        {
          id: titulo.plataformaId,
          descricao: titulo.Plataforma.descricao
        },
        titulo.inicio,
        titulo.fim,
        titulo.episodios,
        titulo.assistidos,
        titulo.temporadas,
        titulo.score,
        titulo.vezes,
        titulo.adicao,
        titulo.id_tmdb,
        titulo.original_name,
        titulo.overview,
        titulo.poster_path,
        titulo.media_type,
        titulo.genres_ids,
        titulo.popularity,
        titulo.first_air_date,
        titulo.year,
        titulo.vote_average
      );
      return titulos;
    });
    return this.catalogo;
  };

  async obterTituloPorID(idTitulo) {
    const titulo = await api.buscarDadosPorId(idTitulo, this.endpoint);
    if (!titulo) return null;

    const catalogo = new Catalogo(
      titulo.id,
      titulo.titulo,
      titulo.capa,
      {
        id: titulo.tipoId,
        descricao: titulo.Tipo.descricao
      },
      {
        id: titulo.statusId,
        descricao: titulo.Status.descricao
      },
      {
        id: titulo.plataformaId,
        descricao: titulo.Plataforma.descricao
      },
      titulo.inicio,
      titulo.fim,
      titulo.episodios,
      titulo.assistidos,
      titulo.temporadas,
      titulo.score,
      titulo.vezes,
      titulo.adicao,
      titulo.id_tmdb,
      titulo.original_name,
      titulo.overview,
      titulo.poster_path,
      titulo.media_type,
      titulo.genres_ids,
      titulo.popularity,
      titulo.first_air_date,
      titulo.year,
      titulo.vote_average
    );

    return catalogo;
  };

  async obterCatalogoPorDescricao(descricao, limite = 4, pagina = 1) {
    const resposta = await api.buscarDadosPorDescricao(descricao, this.endpoint, limite, pagina);
    
    // Extrai os registros envelopados ou assume um array vazio
    const listaDados = resposta?.dados || [];

    const titulosMapeados = listaDados.map((titulo) => {
      return new Catalogo(
        titulo.id,
        titulo.titulo,
        titulo.capa,      
        { id: titulo.tipoId, descricao: titulo.Tipo?.descricao || '' },
        { id: titulo.statusId, descricao: titulo.Status?.descricao || '' },
        { id: titulo.plataformaId, descricao: titulo.Plataforma?.descricao || '' },
        titulo.inicio,
        titulo.fim,
        titulo.episodios,
        titulo.assistidos,
        titulo.temporadas,
        titulo.score,
        titulo.vezes,
        titulo.adicao,
        titulo.id_tmdb,
        titulo.original_name,
        titulo.overview,
        titulo.poster_path,
        titulo.media_type,
        titulo.genres_ids,
        titulo.popularity,
        titulo.first_air_date,
        titulo.year,
        titulo.vote_average
      );
    });

    // Retorna os dados envelopados junto com as informações de paginação vindas do Back
    return {
      dados: titulosMapeados,
      totalPaginas: resposta?.totalPaginas || 1,
      paginaAtual: resposta?.paginaAtual || 1
    };
  };

  async salvarTitulo(titulo) {

    const payload = {
      id: titulo.id,
      titulo: titulo.Titulo,
      capa: titulo.Capa,
      tipoId: titulo.Tipo,
      statusId: titulo.Status,
      plataformaId: titulo.Plataforma,
      inicio: titulo.Inicio,
      fim: titulo.Fim,
      episodios: titulo.Episodios,
      assistidos: titulo.Assistidos,
      temporadas: titulo.Temporadas,
      score: titulo.Score,
      vezes: titulo.Vezes,
      adicao: titulo.Adicao,
      dias: titulo.Dias,
      progresso: titulo.Progresso,
      id_tmdb: titulo.IdTMDB,
      original_name: titulo.Original_Name,
      overview: titulo.Overview,
      poster_path:  titulo.Capa,
      media_type: titulo.Media_Type,
      genres_ids: titulo.Genres_Ids,
      popularity: titulo.Popularity,
      first_air_date: titulo.First_Air_Date,
      year: titulo.Year,
      vote_average: titulo.Vote_Average,
      // Envio dos detalhes das temporadas/episódios capturados na View
      listaTemporadas: titulo.listaTemporadas || []
    };

    let tituloSalvo;
    if (titulo.id) {
      tituloSalvo = await api.atualizarDados(payload, this.endpoint);
    } else {
      tituloSalvo = await api.salvarDados(payload, this.endpoint);
    }

    const tituloId = tituloSalvo.id || titulo.id;
    if (titulo.listaTemporadas && titulo.listaTemporadas.length > 0) {
      for (const temp of titulo.listaTemporadas) {
          temp.tituloId = tituloId;
          await this.temporadaVM.salvarTemporada(temp);
      }
    }
  };

  async excluirTitulo(id) {
    await api.excluirDados(id, this.endpoint);
    return this.obterCatalogo();
  };

  // Método para buscar dados no TMDB e preencher os campos do formulário
  async obterDadosTMDB(nome, elementoId) {
    const elementoDestino = document.getElementById(elementoId);

    elementoDestino.innerHTML = '<p>Buscando no catálogo do TMDB...</p>';
    try {
      const catalogoTMDB = await apiTMDB.obterPrograma(nome);

      return catalogoTMDB
    } catch (error) {
      elementoDestino.innerHTML = '<p>Erro na conexão com o servidor.</p>';
    }
  };

  // Método para buscar dados no TMDB especificamento por título e tipo
  async obterDadosTMDBPorDescricao(nome, tipo) {
    try {
      const catalogoTMDB = await apiTMDB.obterProgramaPorDescricao(nome,tipo);

      return catalogoTMDB
    } catch (error) {
      alert('Erro ao buscar título na API!')
      throw error
    }
  };

  async obterDadosTMDBPorId(idTMDB) {
    try {
      const tituloTMDB = await apiTMDB.obterDetalhesPrograma(idTMDB);
      return tituloTMDB

    } catch (error) {
      alert('Erro ao buscar título na API!')
      throw error
    }
  }

  // Método dedicado para preencher metadados de itens pendentes
  async atualizarCatalogoEmLote(progressoCallback = null) {
    try {
      // 1. Busca TODOS os itens cadastrados no seu sistema
      const dadosCatalogo = await this.obterCatalogo(); // Obtém todos os títulos do catálogo     
      const todosOsItens = dadosCatalogo ? (Array.isArray(dadosCatalogo) ? dadosCatalogo : [dadosCatalogo]) : [];

      if (todosOsItens.length === 0) {
        console.warn("Nenhum item encontrado no banco de dados para processamento.");
        return { processados: 0, erros: 0 };
      }

      // Filtra APENAS os itens onde o ID_TMDB é nulo, indefinido ou vazio
      const itensPendentes = todosOsItens.filter(item => !item.IdTMDB || item.IdTMDB === "" || item.IdTMDB === "null");

      if (itensPendentes.length === 0) {
        if (progressoCallback) progressoCallback("✅ Todos os títulos já possuem ID do TMDB vinculado!");
        return { processados: 0, erros: 0 };
      }

      let processadosContador = 0;
      let errosContador = 0;

      // Divide a lista filtrada em lotes paralelos de 20 em 20 itens
      const tamanhoDoLote = 20;
      const lotes = [];
      for (let i = 0; i < itensPendentes.length; i += tamanhoDoLote) {
        lotes.push(itensPendentes.slice(i, i + tamanhoDoLote));
      }

      console.log(`🎬 Iniciando reconciliação. Há ${itensPendentes.length} títulos pendentes de ID do TMDB.`);

      for (const [index, lote] of lotes.entries()) {
        if (progressoCallback) {
          progressoCallback(`Analisando bloco de pendentes ${index + 1} de ${lotes.length}...`);
        }

        const promessasLote = lote.map(async (item) => {
          if (!item.Titulo) return;

          // Limpa termos de temporada ("9ª Temporada", etc.) para a busca por texto não falhar
          let tituloLimpo = item.Titulo
            .replace(/\d+ª\s*temporada/i, '')
            .replace(/temporada\s*\d+/i, '')
            .replace(/season\s*\d+/i, '')
            .replace(/s\d+/i, '')
            .replace(/\d+ª\s*temp/i, '')
            .replace(/(Parte 3)\s*\d+/i, '')
            .replace(/1ª á 4ª Temporada\s*\d+/i, '')
            .replace(/1ª á 3ª Temporada\s*\d+/i, '')
            .replace(/11ª e 12ª Temporada\s*\d+/i, '')
            .trim();

          if (!tituloLimpo) tituloLimpo = item.Titulo;

          const stringTipo = typeof item.Tipo === 'object' ? item.Tipo.descricao : item.Tipo;
          const deparTipo = (stringTipo === 'Filme' || stringTipo === '6' || item.Media_Type === 'movie') ? 'movie' : 'tv';

          try {

            const respostaBusca = await apiTMDB.obterProgramaPorDescricao(tituloLimpo,deparTipo)
            const resultadoBusca = await respostaBusca.json();

            if (!resultadoBusca.results || resultadoBusca.results.length === 0) {
              console.warn(`⚠️ Nenhuma correspondência encontrada no TMDB para o título: "${item.Titulo}" (Buscado como: "${tituloLimpo}")`);
              return;
            }

            // Lendo o primeiro item da lista de resultados da pesquisa textual
            const dadosTMDB = resultadoBusca.results[0];
            const urlPosterCorreta = dadosTMDB.poster_path 
              ? "https://image.tmdb.org/t/p/w500" + dadosTMDB.poster_path
              : item.Poster_Path;

            item.IdTMDB = dadosTMDB.id.toString();
            item.Original_Name = dadosTMDB.original_title || dadosTMDB.original_name || item.Original_Name;
            item.Overview = dadosTMDB.overview || item.Overview;
            item.Poster_Path = urlPosterCorreta;
            item.Popularity = dadosTMDB.popularity || item.Popularity;
            item.First_Air_Date = dadosTMDB.release_date || dadosTMDB.first_air_date || item.First_Air_Date;
            item.Vote_Average = dadosTMDB.vote_average || item.Vote_Average;
            item.Media_Type = dadosTMDB.media_type || item.Media_Type;
            item.Genres_Ids = dadosTMDB.genre_ids || item.Genres_Ids;

            if (dadosTMDB.release_date || dadosTMDB.first_air_date) {
              item.Year = new Date(dadosTMDB.release_date || dadosTMDB.first_air_date).getFullYear();
            }

            const payloadItem = new Catalogo(
              item.id,
              item.Titulo,
              item.Capa,
              item.Tipo?.id || item.Tipo,
              item.Status?.id || item.Status,
              item.Plataforma?.id || item.Plataforma,
              item.Inicio,
              item.Fim,
              item.Episodios,
              item.Assistidos,
              item.Temporadas,
              item.Score,
              item.Vezes,
              item.Adicao,
              item.IdTMDB, 
              item.Original_Name,
              item.Overview,
              item.Poster_Path,
              item.Media_Type,
              item.Genres_Ids,
              item.Popularity,
              item.First_Air_Date,
              item.Year,
              item.Vote_Average
            );

            await this.salvarTitulo(payloadItem);
            processadosContador++;
          } catch (erro) {
            console.error(`❌ Falha ao tentar reconciliar o título "${item.Titulo}":`, erro.message);
            errosContador++;
          }
        });

        await Promise.all(promessasLote);
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      return { processados: processadosContador, erros: errosContador };

    } catch (error) {
      console.error("Erro geral durante o processamento em lote:", error);
      throw error;
    }
  };

  filtrarPorStatus(status) {
    return this.catalogo.filter((t) => t.Status.descricao === status);
  };

  filtrarPorTipo(tipo) {
    return this.catalogo.filter((t) => t.Tipo.descricao === tipo);
  };

  topPorScore(tipo, qtd = 4) {
    return [...this.catalogo]
      .filter((t) => t.Tipo.descricao === tipo)
      .sort((a, b) => b.Score - a.Score)
      .slice(0, qtd);
  };

  topGeral(qtd = 4) {
    return [...this.catalogo].sort((a, b) => b.Score - a.Score).slice(0, qtd);
  };

  recentesPorStatus(status, qtd = 4) {
    return this.catalogo
      .filter((t) => t.Status.descricao === status)
      .sort((a, b) => {
        const ta = a?.Adicao instanceof Date && !isNaN(a.Adicao) ? a.Adicao.getTime() : 0;
        const tb = b?.Adicao instanceof Date && !isNaN(b.Adicao) ? b.Adicao.getTime() : 0;
        return tb - ta;
      })
      .slice(0, qtd);
  };

  assistindo(status, qtd = 4) {
    return this.catalogo
      .filter(titulo => status.includes(titulo.Status.descricao))
      .slice(0, qtd);
  };

  recentes(qtd = 4) {
    return [...this.catalogo]
      .sort((a, b) => {
        const ta = a?.Adicao instanceof Date && !isNaN(a.Adicao) ? a.Adicao.getTime() : 0;
        const tb = b?.Adicao instanceof Date && !isNaN(b.Adicao) ? b.Adicao.getTime() : 0;
        return tb - ta;
      })
      .slice(0, qtd);
  };

  estatisticasPorTipo(tipo) {
    const lista = this.filtrarPorTipo(tipo);

    return {
      total: lista.length,
      dias: lista.reduce((acc, t) => acc + (t.Dias || 0), 0),
      totalEpisodios: lista.reduce((acc, t) => acc + Number(t.Episodios || 0), 0),
      reassistidos: lista.reduce((acc, t) => acc + (t.Vezes || 0), 0),
      assistindo: lista.filter((t) => t.Status.descricao === "Assistindo").length,
      completado: lista.filter((t) => t.Status.descricao === "Completado").length,
      dropped: lista.filter((t) => t.Status.descricao === "Dropped").length,
      planejado: lista.filter((t) => t.Status.descricao === "Planejado").length,
      emEspera: lista.filter((t) => t.Status.descricao === "Em Espera").length,
      mediaPontuacao: lista.length
        ? (
          lista.reduce((acc, t) => acc + (t.Score || 0), 0) / lista.length
        ).toFixed(1)
        : 0,
    };
  };

  resumoGeral() {
    const totalDias = this.catalogo.reduce((acc, t) => acc + Number(t.Dias || 0), 0);
    const Horas = totalDias * 24;
    const totalHoras = metodoData.formatarHorasParaHMS(Horas);
    const totalEpisodios = this.catalogo.reduce((acc, t) => acc + Number(t.Episodios || 0), 0);
    const totalAssistidos = this.catalogo.reduce((acc, t) => acc + Number(t.Assistidos || 0), 0);
    const somaPontuacoes = this.catalogo.reduce((acc, t) => acc + Number(t.Score || 0), 0);

    return {
      Total: this.catalogo.length,
      totalDias,
      totalHoras,
      totalEpisodios,
      totalAssistidos,
      reassistidos: this.catalogo.reduce((acc, t) => acc + Number(t.Vezes || 0), 0),
      assistindo: this.catalogo.filter((t) => t.Status.descricao === "Assistindo").length,
      completado: this.catalogo.filter((t) => t.Status.descricao === "Completado").length,
      dropped: this.catalogo.filter((t) => t.Status.descricao === "Dropped").length,
      planejado: this.catalogo.filter((t) => t.Status.descricao === "Planejado").length,
      emEspera: this.catalogo.filter((t) => t.Status.descricao === "Em Espera").length,
      serie: this.catalogo.filter((t) => t.Tipo.descricao === "Serie").length,
      filme: this.catalogo.filter((t) => t.Tipo.descricao === "Filme").length,
      show: this.catalogo.filter((t) => t.Tipo.descricao === "Show").length,
      desenho: this.catalogo.filter((t) => t.Tipo.descricao === "Desenho").length,
      documentario: this.catalogo.filter((t) => t.Tipo.descricao === "Documentário").length,
      reality: this.catalogo.filter((t) => t.Tipo.descricao === "Reality").length,
      mediaPontuacao: this.catalogo.length
        ? Number((somaPontuacoes / this.catalogo.length).toFixed(1))
        : 0,
    };
  };

  fequentes(tipo, qtd = 4) {
    return [...this.catalogo]
      .filter((t) => t.Tipo.descricao === tipo && t.Vezes > 1)
      .sort((a, b) => b.Vezes - a.Vezes)
      .slice(0, qtd);
  };

  dadosGraficoTipo() {
    const tipos = [
      "Serie",
      "Filme",
      "Documentário",
      "Reality",
      "Desenho",
      "Show",
      "Anime",
    ];
    const valores = tipos.map((tipo) => this.filtrarPorTipo(tipo).length);
    return { labels: tipos, data: valores };
  }

  dadosGraficoStatus() {
    const status = [
      "Assistindo",
      "Completado",
      "Dropped",
      "Planejado",
      "Em Espera",
    ];
    const valores = status.map((s) => this.filtrarPorStatus(s).length);
    return { labels: status, data: valores };
  }

  dadosGraficoPlataforma() {
    const plataformas = [
      "Netflix",
      "Amazon Prime",
      "Crunchroll",
      "YouTube",
      "HBO Max",
      "Download",
      "TV",
      "Pluto TV",
      "Download",
      "Cinema",
      "Paramount",
    ];
    const valores = plataformas.map(
      (p) => this.catalogo.filter((t) => t.Plataforma.descricao === p).length
    );
    return { labels: plataformas, data: valores };
  };


}


