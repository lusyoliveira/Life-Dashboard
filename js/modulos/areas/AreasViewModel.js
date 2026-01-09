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
          area.descricao,
          area.Tipo
        );               
      return areas;
    })     
    return this.areas;
  };
}