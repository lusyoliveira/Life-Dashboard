import api from "../../servicos/metodoApi.js";
import Tipo from "../tipos/tipoModel.js";

export class TipoViewModel {
  constructor(endpoint = "tipos") {
    this.endpoint = endpoint;
    this.tipos = [];
  }

   async obterTipos(tipo) {  
    const tipoData = await api.buscarDados(this.endpoint);
        
    this.tipos = tipoData    
        .filter((umtipo) => umtipo.Tipo === tipo) 
        .map((umtipo) => {

        const tipos = new Tipo(
          umtipo._id,
          umtipo.descricao,
          umtipo.Tipo
        );              
      return tipos;      
    })     
    return this.tipos;
  };
}