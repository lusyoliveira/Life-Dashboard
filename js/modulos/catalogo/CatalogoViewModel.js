import api from "../../servicos/metodoApi.js";
import Catalogo from "./catalogoModel.js";
import CatalogoTipo from "./catalogoTipoModel.js";
import CatalogoStatus from "./catalogoStatusModel.js";
import CatalogoPlataforma from "./catalogoPlataformaModel.js";

export class CatalogoViewModel {
  constructor(endpoint = "catalogo") {
    this.endpoint = endpoint;
    this.catalogo = [];
    this.plataformas = [];
    this.tipos = [];
    this.status = [];
  }

   async obterCatalogo() {
    const catalogoData = await api.buscarDados(this.endpoint);

    this.catalogo = catalogoData.map((titulo) => {
      const titulos = new Catalogo(
        titulo._id,
        titulo.Titulo,
        titulo.Capa,
        titulo.Tipo,
        titulo.Status,
        titulo.Onde,
        titulo.Inicio,
        titulo.Fim,
        titulo.Episodios,
        titulo.Assistidos,
        titulo.Temporadas,
        titulo.Score,
        titulo.Vezes,
        titulo.Adicao
      );
 
    return titulos;
  });  
  return this.catalogo;
}

  async obterTituloPorID(idTitulo) {
    const titulo = await api.buscarDadosPorId(idTitulo, this.endpoint);
    if (!titulo) return null;

    const catalogo = new Catalogo(
      titulo._id,
      titulo.Titulo,
      titulo.Capa,
      titulo.Tipo,
      titulo.Status,
      titulo.Onde,
      titulo.Inicio,
      titulo.Fim,
      titulo.Episodios,
      titulo.Assistidos,
      titulo.Temporadas,
      titulo.Score,
      titulo.Vezes,
      titulo.Adicao
    );

    return catalogo;
  }

  async salvarTitulo(titulo) {
    const payload = {
      ...titulo,
      Dias: titulo.Dias,
      Progresso: titulo.Progresso
    };

        payload.Adicao = titulo.Adicao instanceof Date 
      ? titulo.Adicao 
      : new Date(titulo.Adicao); 

    if (titulo.id) {
      payload.Adicao = new Date(titulo.Adicao);
      await api.atualizarDados(payload, this.endpoint);
    } else {
      payload.Adicao = new Date();
      payload.Vezes = 0;
      payload.Score = payload.Score || 0;
      await api.salvarDados(payload, this.endpoint);
    }

    return this.obterCatalogo();
  };

  async excluirTitulo(id) {
    await api.excluirDados(id, this.endpoint);
    return this.obterCatalogo();
  };

   filtrarPorStatus(status) {
    return this.catalogo.filter((t) => t.Status === status);
  }

  filtrarPorTipo(tipo) {
    return this.catalogo.filter((t) => t.Tipo === tipo);
  }

  topPorScore(tipo, qtd = 4) {
    return [...this.catalogo]
      .filter((t) => t.Tipo === tipo)
      .sort((a, b) => b.Score - a.Score)
      .slice(0, qtd);
  }

  topGeral(qtd = 4) {
    return [...this.catalogo].sort((a, b) => b.Score - a.Score).slice(0, qtd);
  }

  recentesPorStatus(status, qtd = 4) {
    return this.catalogo
      .filter((t) => t.Status === status)
      .sort((a, b) => {
      const ta = a?.Adicao instanceof Date && !isNaN(a.Adicao) ? a.Adicao.getTime() : 0;
      const tb = b?.Adicao instanceof Date && !isNaN(b.Adicao) ? b.Adicao.getTime() : 0;
      return tb - ta;
    })
      .slice(0, qtd);
  }
  
  assistindo(status, qtd = 4) {
    return this.catalogo
      .filter(titulo => status.includes(titulo.Status))
      .slice(0, qtd);
  }

  recentes(qtd = 3) {
    return [...this.catalogo]
      .sort((a, b) => {
      const ta = a?.Adicao instanceof Date && !isNaN(a.Adicao) ? a.Adicao.getTime() : 0;
      const tb = b?.Adicao instanceof Date && !isNaN(b.Adicao) ? b.Adicao.getTime() : 0;
      return tb - ta;
    })
    .slice(0, qtd);    
  }

  estatisticasPorTipo(tipo) {
    const lista = this.filtrarPorTipo(tipo);

    return {
      total: lista.length,
      dias: lista.reduce((acc, t) => acc + (t.Dias || 0), 0),
      totalEpisodios: lista.reduce((acc, t) => acc + Number(t.Episodios || 0), 0),
      reassistidos: lista.reduce((acc, t) => acc + (t.Vezes || 0), 0),
      assistindo: lista.filter((t) => t.Status === "Assistindo").length,
      completado: lista.filter((t) => t.Status === "Completado").length,
      dropped: lista.filter((t) => t.Status === "Dropped").length,
      planejado: lista.filter((t) => t.Status === "Planejado").length,
      emEspera: lista.filter((t) => t.Status === "Em-Espera").length,
      mediaPontuacao: lista.length
        ? (
            lista.reduce((acc, t) => acc + (t.Score || 0), 0) / lista.length
          ).toFixed(1)
        : 0,
    };
  }

  resumoGeral() {
    const totalDias = this.catalogo.reduce((acc, t) => acc + Number(t.Dias || 0), 0);
    const totalHoras = totalDias * 24;
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
      assistindo: this.catalogo.filter((t) => t.Status === "Assistindo").length,
      completado: this.catalogo.filter((t) => t.Status === "Completado").length,
      dropped: this.catalogo.filter((t) => t.Status === "Dropped").length,
      planejado: this.catalogo.filter((t) => t.Status === "Planejado").length,
      emEspera: this.catalogo.filter((t) => t.Status === "Em-Espera").length,
      serie: this.catalogo.filter((t) => t.Tipo === "Serie").length,
      filme: this.catalogo.filter((t) => t.Tipo === "Filme").length,
      show: this.catalogo.filter((t) => t.Tipo === "Show").length,
      desenho: this.catalogo.filter((t) => t.Tipo === "Desenho").length,
      documentario: this.catalogo.filter((t) => t.Tipo === "Documentário").length,
      reality: this.catalogo.filter((t) => t.Tipo === "Reality").length,
      mediaPontuacao: this.catalogo.length
        ? Number((somaPontuacoes / this.catalogo.length).toFixed(1))
        : 0,
    };
  }

  dadosGraficoTipo() {
    const tipos = [
      "Serie",
      "Filme",
      "Documentário",
      "Reality",
      "Desenho",
      "Show",
    ];
    const valores = tipos.map((tipo) => this.filtrarPorTipo(tipo).length);
    return { labels: tipos, data: valores };
  }

  dadosGraficoStatus() {
    const status = [
      "Assistindo",
      "Reassistindo",
      "Completado",
      "Dropped",
      "Planejado",
      "Em-Espera",
    ];
    const valores = status.map((s) => this.filtrarPorStatus(s).length);
    return { labels: status, data: valores };
  }

  dadosGraficoPlataforma() {
    const plataformas = [
      "Netflix",
      "Amazom Prime",
      "Crunchroll",
      "YouTube",
      "MAX",
      "Download",
      "TV",
    ];
    const valores = plataformas.map(
      (p) => this.catalogo.filter((t) => t.Onde === p).length
    );
    return { labels: plataformas, data: valores };
  };

  async obterCatalogoTipos() {
  
    const tipoData = await api.buscarDados(`${this.endpoint}/tipos`);
    
    this.tipos = tipoData.map((tipo) => {
        const tipos = new CatalogoTipo(
          tipo._id,
          tipo.descricao
        );               
      return tipos;
    })     
    return this.tipos;
  };

  async obterCatalogoStatus() {
  
    const statusData = await api.buscarDados(`${this.endpoint}/status`);
    
    this.status = statusData.map((statu) => {
        const status = new CatalogoStatus(
          statu._id,
          statu.descricao
        );               
      return status;
    })     
    return this.status;
  };

  async obterCatalogoPlataforma() {  
    const plataformaData = await api.buscarDados(`${this.endpoint}/plataformas`);
    
    this.plataformas = plataformaData.map((plataforma) => {
        const plataformas = new CatalogoPlataforma(
          plataforma._id,
          plataforma.descricao
        );               
      return plataformas;
    })     
    return this.plataformas;
  };
}


