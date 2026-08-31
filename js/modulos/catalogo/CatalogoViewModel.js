import api from "../../servicos/metodoApi.js";
import apiTMDB from "../../integracoes/tmDB/metodoTMDB.js";
import Catalogo from "./catalogoModel.js";
import metodoData from "../../Utils/metodoData.js"
    import { ConfiguracaoViewModel } from "../configuracoes/ConfiguracaoViewModel.js";

export class CatalogoViewModel {
  constructor(endpoint = "catalogo") {
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
      titulo.adicao
    );
    return titulos;
  });  
  return this.catalogo;
}

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
      titulo.adicao
    );

    return catalogo;
  }

  async salvarTitulo(titulo) {
    //   const payload = {
    //   ...titulo,
    //   Dias: titulo.Dias,
    //   Progresso: titulo.Progresso
    // };

    // payload.Adicao = titulo.Adicao instanceof Date 
    // ? titulo.Adicao 
    // : new Date(titulo.Adicao); 
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
      progresso: titulo.Progresso
    };
    
   
    if (titulo.id) {
      //payload.Adicao = new Date(titulo.Adicao);
      await api.atualizarDados(payload, this.endpoint);
    } else {
      //payload.Adicao = new Date();
      await api.salvarDados(payload, this.endpoint);
    }

    return this.obterCatalogo();
  };

  async excluirTitulo(id) {
    await api.excluirDados(id, this.endpoint);
    return this.obterCatalogo();
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

  //pesquisa TMDB
   async buscarMidias(nome, elementoId) {
    const elementoDestino = document.getElementById(elementoId);
     
     elementoDestino.innerHTML = '<p>Buscando no catálogo do TMDB...</p>';
     try {          
            const cfvm = new ConfiguracaoViewModel('configuracoes');
            const dadosConfig = (await cfvm.obterConfiguracoes())[0];
            const catalogoTMDB = await apiTMDB.obterPrograma(nome, dadosConfig);
   
            return catalogoTMDB
        } catch (error) {
             elementoDestino.innerHTML = '<p>Erro na conexão com o servidor.</p>';
        }
    }
  
}


