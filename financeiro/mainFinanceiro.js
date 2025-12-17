import { FinanceiroViewModel } from "./FinanceiroViewModel.js";
import { FinanceiroView } from "./FinanceiroView.js";
import { formatarParaISO } from "../js/metodoData.js";

document.addEventListener("DOMContentLoaded", async () => {
    const cvm = new FinanceiroViewModel('contas');
    const contasView = new FinanceiroView(cvm);

  await contasView.listarContas('lista-contas');

});