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

  async obterStatusPorID(statusID) {
        const status = await api.buscarDadosPorId(statusID,this.endpoint);
      if (!status) return null;

      const statusModel = new Status(
          status._id,
          status.descricao,
          status.Tipo
        );       
        return statusModel
    };

  async salvarStatus(status) {
    const payload = {
      ...status
    };
    
    if (status.id) {      
      await api.atualizarDados(payload, this.endpoint);
    } else {
      await api.salvarDados(payload, this.endpoint);
    }
    return this.obterStatus();
  };

  async excluirStatus(id) {
    await api.excluirDados(id, this.endpoint);
    return this.obterStatus();
  };
}