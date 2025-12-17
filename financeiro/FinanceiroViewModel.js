import api from "../js/metodoApi.js";
import Transacao from "../financeiro/Transacao.js";
import Contas from "../financeiro/Contas.js";

export class FinanceiroViewModel {
    constructor(endpoint = "transacoes") {
        this.endpoint = endpoint;
        this.transacoes = [];
        this.contas = [];
    }

    async obterTransacoes() {
        const transacoesData = await api.buscarDados(this.endpoint);
        this.transacoes = transacoesData.map(transacao => {
            const listaTransacoes = new Transacao(
                transacao._id,
                transacao.Descricao,
                transacao.Data,
                transacao.Categoria,
                transacao.Conta,
                transacao.Valor,
                transacao.ParcelaInicio,
                transacao.ParcelaFim,
                transacao.Parcelamento,  
            );
            return listaTransacoes;
        })
        return this.transacoes;
    };

       async obterContas() {
        const contasData = await api.buscarDados(this.endpoint);
        this.contas = contasData.map(conta => {
            const listaContas = new Contas(
                conta._id,
                conta.Agencia,
                conta.Conta,
                conta.Banco,
                conta.Descricao,
                conta.Tipo,
                conta.Saldo,  
            );
            return listaContas;
        })
        return this.contas;
    };

}