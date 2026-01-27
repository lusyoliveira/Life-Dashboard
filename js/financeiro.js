import "./Utils/bootstrap.js";
import { FinanceiroViewModel } from "./modulos/financeiro/FinanceiroViewModel.js";
import { FinanceiroView } from "./modulos/financeiro/FinanceiroView.js"; 
import { CategoriaViewModel } from "./modulos/categorias/CategoriasViewModel.js";
import { CategoriasView } from "./modulos/categorias/CategoriasView.js";
import { ContasViewModel } from "./modulos/contas/ContasViewModel.js";
import { ContasView } from "./modulos/contas/ContasView.js";
import { carregarFormulario } from "./Utils/utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const fvm = new FinanceiroViewModel();
    const financeiroView = new FinanceiroView(fvm);
    const categoriaVM = new CategoriaViewModel();
    const categoriaView = new CategoriasView(categoriaVM);
    const contasVM = new ContasViewModel();
    const contasView = new ContasView(contasVM);    
    const botaoCategoria = document.getElementById('adiciona-categoria'); 
    const botaoConta = document.getElementById('adicionarConta');
    const botaoTransacao = document.getElementById('adicionarTransacao');
    const formTransacaoHTML = await carregarFormulario("/pages/partials/formTransacao.html");
    financeiroView.formHTML = formTransacaoHTML
    const formContaHTML = await carregarFormulario("/pages/partials/formContas.html");
    contasView.formHTML = formContaHTML

    await contasView.listarContas();
    await contasView.renderContas('lista-contas');
    await categoriaView.renderCardCategorias('lista-categoria', 'Financeiro');
    financeiroView.renderTransacoesAVencer('proximos-transacoes', 5)
    //Adicionar conta
    botaoConta.addEventListener("click", async () => {
        await contasView.abrirModalCriarConta();
    });

    //Adicionar transação
    botaoTransacao.addEventListener("click", async () => {
        await financeiroView.abrirModalCriarTransacao();
    });

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