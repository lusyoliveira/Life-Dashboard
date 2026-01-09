import api from "../../servicos/metodoApi.js";
import Categoria from "../categorias/categoriasModel.js";

export class CategoriaViewModel {
  constructor(endpoint = "categorias") {
    this.endpoint = endpoint;
    this.categorias = [];
  }

  async obterCategoria(tipo) {
  
    const categoriaData = await api.buscarDados(this.endpoint);
    
    this.categorias = categoriaData
        .filter((categoria) => categoria.Tipo === tipo)        
        .map((categoria) => {
        const categorias = new Categoria(
          categoria._id,
          categoria.descricao,
          categoria.Tipo
        );               
      return categorias;
    })     
    return this.categorias;
  };
}