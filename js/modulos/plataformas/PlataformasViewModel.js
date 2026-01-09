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
        .filter((plataforma) => plataforma.Tipo === tipo)        
        .map((plataforma) => {
        const plataformas = new Plataforma(
          plataforma._id,
          plataforma.descricao,
          plataforma.Tipo
        );               
      return plataformas;
    })     
    return this.plataformas;
  };
}