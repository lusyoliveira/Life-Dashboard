import api from "../../servicos/metodoApi.js";
import Transacao from "../financeiro/transacaoModel.js";
import Contas from "../contas/contasModel.js";
import { CategoriaViewModel } from "../categorias/CategoriasViewModel.js";

export class FinanceiroViewModel {
    constructor(endpoint = "transacoes") {
        this.endpoint = endpoint;
        this.transacoes = [];
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
                transacao.ContaOrigem,
                transacao.Valor,
                transacao.ParcelaInicio,
                transacao.ParcelaFim,
                transacao.Parcelamento,  
                transacao.Tipo
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
                transacao.ContaOrigem,
                transacao.Valor,
                transacao.ParcelaInicio,
                transacao.ParcelaFim,
                transacao.Parcelamento,  
                transacao.Tipo  
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

    async filtrarTransacoesAVencer(qtd = 13) {
        const transacoes = await this.obterTransacoes();

        const transacoesFiltrada = transacoes.filter(transacao => {
            const dataTransacao = new Date(transacao.Data);
           
            return dataTransacao > new Date(); 
        })
        .filter (transacoes => transacoes.Tipo === 'D')
        .sort((a, b) => new Date(a.Data) - new Date(b.Data))
        .slice(0, qtd);

        return transacoesFiltrada;
    };

    async transacoesporCategoria() {
        const categoriaVM = new CategoriaViewModel();
        const categorias = await categoriaVM.obterCategoria('Financeiro');
        const categoriasArray = categorias.map(c => c.Descricao);
        await this.obterTransacoes();

        const valores = categoriasArray.map(categoria =>
            this.transacoes
                .filter(t => t.Categoria.descricao === categoria)
                .reduce((acc, t) => acc + t.Valor, 0)
        );

        return {
            labels: categoriasArray,
            data: valores
        };
    };
}