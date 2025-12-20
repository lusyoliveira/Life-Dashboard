import { FinanceiroViewModel } from "./modulos/financeiro/FinanceiroViewModel.js";
import { FinanceiroView } from "./modulos/financeiro/FinanceiroView.js"; 

document.addEventListener("DOMContentLoaded", async () => {
    const cvm = new FinanceiroViewModel('contas');
    const contasView = new FinanceiroView(cvm);

  await contasView.listarContas('lista-contas');

});