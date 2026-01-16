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

  async obterTipoPorID(tipoID) {
    const tipo = await api.buscarDadosPorId(tipoID,this.endpoint);
    if (!tipo) return null;

    const tipoModel = new Tipo(
        tipo._id,
        tipo.descricao,
        tipo.Tipo
      );       
      return tipoModel
  };

  async salvarTipo(tipo) {
    const payload = {
      ...tipo
    };
    
    if (tipo.id) {      
      await api.atualizarDados(payload, this.endpoint);
    } else {
      await api.salvarDados(payload, this.endpoint);
    }
    return this.obterTipos();
  }

  async excluirTipo(id) {
    await api.excluirDados(id, this.endpoint);
    return this.obterTipos();
  }
}