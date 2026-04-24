import api from "../../servicos/metodoApi.js";
import Plataforma from "../plataformas/plataformasModel.js";

export class PlataformaViewModel {
  constructor(endpoint = "plataformas") {
    this.endpoint = endpoint;
    this.plataformas = [];
  }

  async obterPlataforma(tipo) {  
    const plataformaData = await api.buscarDados(this.endpoint);
    
    this.plataformas = plataformaData
        .filter((plataforma) => plataforma.tipo === tipo)        
        .map((plataforma) => {
        const plataformas = new Plataforma(
          plataforma.id,
          plataforma.descricao,
          plataforma.tipo
        );               
      return plataformas;
    })     
    return this.plataformas;
  };

  async obterPlataformaPorID(plataformaID) {
    const plataforma = await api.buscarDadosPorId(plataformaID,this.endpoint);
    if (!plataforma) return null;

    const plataformaModel = new Plataforma(
        plataforma.id,
        plataforma.descricao,
        plataforma.tipo
      );       
      return plataformaModel
  };

  async salvarPlataforma(plataforma) {
    const payload = {
      ...plataforma
    };
    
    if (plataforma.id) {      
      await api.atualizarDados(payload, this.endpoint);
    } else {
      await api.salvarDados(payload, this.endpoint);
    }
    return this.obterPlataforma();
  }

  async excluirPlataforma(id) {
    await api.excluirDados(id, this.endpoint);
    return this.obterPlataforma();
  }
}