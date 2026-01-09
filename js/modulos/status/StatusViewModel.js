import api from "../../servicos/metodoApi.js";
import Status from "../status/statusModel.js";

export class StatusViewModel {
  constructor(endpoint = "status") {
    this.endpoint = endpoint;
    this.status = [];
  }

  async obterStatus(tipo) {
  
    const statusData = await api.buscarDados(this.endpoint);
    
    this.status = statusData
        .filter((estado) => estado.Tipo === tipo)        
        .map((estado) => {
        const status = new Status(
          estado._id,
          estado.descricao,
          estado.Tipo
        );               
      return status;
    })     
    return this.status;
  };
}