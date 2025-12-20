import { FinanceiroViewModel } from "./FinanceiroViewModel.js";
import { FinanceiroView } from "./FinanceiroView.js";
import Transacao from "./Transacao.js";

document.addEventListener("DOMContentLoaded", async () => {
    const vm = new FinanceiroViewModel();
    const financeiroView = new FinanceiroView(vm);
    const formTransacao = document.getElementById('transacao-form');
    const btnCancelar = document.getElementById('cancelar-transacao');

    financeiroView.listarTransacoes('tbtransacoes')

    formTransacao.addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const idInput = document.getElementById('id-adicionar').value;     
        const descricao = document.getElementById('descricao-adicionar').value;
        const categoria = document.getElementById('categoria-adicionar').value;        
        const conta = document.getElementById('conta-adicionar').value;
        const data = document.getElementById('data-adicionar').value;
        const parcelaFim = document.getElementById('parcela-fim').value;
        const parcelaInicio = document.getElementById('parcela-inicio').value;
        const parcelamento = document.getElementById('parcelamento-adicionar').value;
        const valor = document.getElementById('valor-adicionar').value;

        const transacao = new Transacao(
        idInput ? idInput : null,
        descricao,
        data,
        categoria,
        conta,
        Number(valor),
        parcelaFim,
        parcelaInicio,
        parcelamento
        );
    
        await vm.salvarTransacao(transacao);
        financeiroView.listarTransacoes("tbtransacoes");
        e.target.reset();
    });

    btnCancelar.addEventListener('click', () => {
        formTransacao.reset();
    });
});