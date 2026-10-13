import "./Utils/bootstrap.js";
import utils from "./Utils/utils.js";
import { FinanceiroViewModel } from "./modulos/financeiro/FinanceiroViewModel.js";
import { FinanceiroView } from "./modulos/financeiro/FinanceiroView.js";

export async function inicializarTransacao() {
    const vm = new FinanceiroViewModel();
    const financeiroView = new FinanceiroView(vm);
    const botaoTransacao = document.getElementById('adicionarTransacao');
    const botaoMesAnterior = document.getElementById('mesAnterior');
    const botaoMesProximo = document.getElementById('mesProximo');
    const formTransacaoHTML = await utils.carregarFormulario("/pages/partials/formTransacao.html");
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

};
