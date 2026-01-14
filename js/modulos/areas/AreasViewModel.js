import api from "../../servicos/metodoApi.js";
import Area from "../areas/areasModel.js";

export class AreaViewModel {
  constructor(endpoint = "areas") {
    this.endpoint = endpoint;
    this.areas = [];
  }

  async obterArea() {  
    const areaData = await api.buscarDados(this.endpoint);
    
    this.areas = areaData      
        .map((area) => {
        const areas = new Area(
          area._id,
          area.descricao
        );               
      return areas;
    })     
    return this.areas;
  };

  async obterAreaPorID(areaID) {
        const area = await api.buscarDadosPorId(areaID,this.endpoint);
      if (!area) return null;

      const areaModel = new Area(
          area._id,
          area.descricao
        );       
        return areaModel
    };

  async salvarArea(area) {
    const payload = {
      ...area
    };

    if (area.id) {
      
      await api.atualizarDados(payload, this.endpoint);
    } else {
      await api.salvarDados(payload, this.endpoint);
    }
    return this.obterArea();
  }

  async excluirArea(id) {
    await api.excluirDados(id, this.endpoint);
    return this.obterArea();
  }
}