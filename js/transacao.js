import "./Utils/bootstrap.js";
import { FinanceiroViewModel } from "./modulos/financeiro/FinanceiroViewModel.js";
import { FinanceiroView } from "./modulos/financeiro/FinanceiroView.js";
import { carregarFormulario } from "./Utils/utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const vm = new FinanceiroViewModel();
    const financeiroView = new FinanceiroView(vm);
    const botaoTransacao = document.getElementById('adicionarTransacao');
    const formTransacaoHTML = await carregarFormulario("/pages/partials/formTransacao.html");
    financeiroView.formHTML = formTransacaoHTML
    financeiroView.listarTransacoes('tbtransacoes');
  
    //Adicionar transação
    botaoTransacao.addEventListener("click", async () => {
        await financeiroView.abrirModalCriarTransacao();
    });

});