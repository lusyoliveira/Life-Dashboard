import "./Utils/bootstrap.js";
import { FinanceiroViewModel } from "./modulos/financeiro/FinanceiroViewModel.js";
import { FinanceiroView } from "./modulos/financeiro/FinanceiroView.js";
import { carregarFormulario } from "./Utils/utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const vm = new FinanceiroViewModel();
    const financeiroView = new FinanceiroView(vm);
    const botaoTransacao = document.getElementById('adicionarTransacao');
    const botaoMesAnterior = document.getElementById('mesAnterior');
    const botaoMesProximo = document.getElementById('mesProximo');
    const formTransacaoHTML = await carregarFormulario("/pages/partials/formTransacao.html");
    financeiroView.formHTML = formTransacaoHTML
    financeiroView.listarTransacoes('tbtransacoes');
    financeiroView.atualizarTituloMes();
  
    //Adicionar transação
    botaoTransacao.addEventListener("click", async () => {
        await financeiroView.abrirModalCriarTransacao();
        financeiroView.listarTransacoes('tbtransacoes');
    });

    // Eventos dos botões
    botaoMesAnterior.addEventListener('click', () => financeiroView.mesAnterior());
    botaoMesProximo.addEventListener('click', () => financeiroView.mesProximo());

});