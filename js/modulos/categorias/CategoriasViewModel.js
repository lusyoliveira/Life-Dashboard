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

  async obterCategoriaPorID(categoriaID) {
        const categoria = await api.buscarDadosPorId(categoriaID,this.endpoint);
      if (!categoria) return null;

      const categoriaModel = new Categoria(
          categoria._id,
          categoria.descricao,
          categoria.Tipo
        );       
        return categoriaModel
    };

  async salvarCategoria(categoria) {
    const payload = {
      ...categoria
    };
    
    if (categoria.id) {      
      await api.atualizarDados(payload, this.endpoint);
    } else {
      await api.salvarDados(payload, this.endpoint);
    }
    return this.obterCategoria();
  }

  async excluirCategoria(id) {
    await api.excluirDados(id, this.endpoint);
    return this.obterCategoria();
  }
}