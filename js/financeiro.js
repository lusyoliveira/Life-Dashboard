import "./Utils/bootstrap.js";
import { FinanceiroViewModel } from "./modulos/financeiro/FinanceiroViewModel.js";
import { FinanceiroView } from "./modulos/financeiro/FinanceiroView.js"; 
import { CategoriaViewModel } from "./modulos/categorias/CategoriasViewModel.js";
import { CategoriasView } from "./modulos/categorias/CategoriasView.js";


const botaoCategoria = document.getElementById('adiciona-categoria'); 

document.addEventListener("DOMContentLoaded", async () => {
    const cvm = new FinanceiroViewModel('contas');
    const contasView = new FinanceiroView(cvm);

    const categoriaVM = new CategoriaViewModel();
    const categoriaView = new CategoriasView(categoriaVM);

  await contasView.listarContas('lista-contas');
  // await contasView.listarContasSelect('lista-contas');
  await categoriaView.renderCardCategorias('lista-categoria', 'Financeiro');

  //Adiciona categoria
  botaoCategoria.addEventListener("click", async (evento) => { 
      evento.preventDefault();   

      const descricaocategoria = document.getElementById('descricao-categoria').value
      const inputIdcategoria = document.getElementById('input-id-categoria').value;

      if (descricaocategoria === '') {
          alert('É necessário inserir uma categoria!');
          return
      }
      const categoria = {
          id: inputIdcategoria ? inputIdcategoria : null,
          descricao: descricaocategoria,
          Tipo: 'Financeiro'
      }          
      await categoriaView.salvarCategoria(categoria);
      await categoriaView.renderCardCategorias('lista-categorias', 'Financeiro');

      document.getElementById('descricao-categoria').value = ''
      document.getElementById('input-id-categoria').value = ''
  });

});