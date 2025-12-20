import api from "../../servicos/metodoApi.js";
import Transacao from "../financeiro/transacaoModel.js";
import Contas from "../financeiro/contasModel.js";

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

    async obterTransacaoPorID(ID) {
      const transacao = await api.buscarDadosPorId(ID,this.endpoint);
        if (!transacao) return null;

        const transacoes = new Transacao(
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
        return transacoes;
    }

    async salvarTransacao(transacao) {
        if (transacao.id) {
        await api.atualizarDados(transacao, this.endpoint);
        } else {
        await api.salvarDados(transacao, this.endpoint);
        }
        return this.obterTransacoes();
    }

    async excluirTransacoes(id) {
        await api.excluirDados(id, this.endpoint);
        return this.obterTransacoes();
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