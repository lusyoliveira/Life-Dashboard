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
                transacao.ContaDestino,
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
                transacao.ContaDestino,
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

            if (transacao.Tipo === 'T') {
                const transacaoOrigem = { ...transacao };
                transacaoOrigem.Valor = -Math.abs(transacao.Valor);
                transacaoOrigem.Categoria = null;

                await api.salvarDados(transacaoOrigem, this.endpoint);

                const transacaoDestino = { ...transacao };
                transacaoDestino.Valor = Math.abs(transacao.Valor);
                transacaoDestino.Categoria = null;

                await api.salvarDados(transacaoDestino, this.endpoint);
                return this.obterTransacoes();

            } else if (transacao.Tipo === 'R') {

                const transacaoReceita = { ...transacao };
                transacaoReceita.Valor = Math.abs(transacao.Valor);
                transacaoReceita.ContaDestino = null;

                await api.salvarDados(transacaoReceita, this.endpoint);
                return this.obterTransacoes();

            } else if (transacao.Tipo === 'D') {
                const transacaoDespesa = { ...transacao };                          
debugger
                if (transacao.Parcelamento && transacao.ParcelaFim > 0) {
                    const totalParcelas = transacao.ParcelaFim; // - transacao.ParcelaInicio;
                    const valorParcela = Math.abs(transacao.Valor) / (totalParcelas + 1);

                    for (let i = 1; i <= totalParcelas; i++) {
                        const novaData = new Date(transacao.Data);
                        novaData.setMonth(novaData.getMonth() + i);

                        const transacaoParcela = {
                            ...transacaoDespesa,
                            Data: novaData.toISOString().split('T')[0],
                            Valor: -valorParcela,   
                            ContaDestino: null,
                        };
                        await api.salvarDados(transacaoParcela, this.endpoint);
                    }
                } else {                    
                    transacaoDespesa.Valor = -Math.abs(transacao.Valor);
                    transacaoDespesa.ContaDestino = null;

                    await api.salvarDados(transacaoDespesa, this.endpoint);
                }

                return this.obterTransacoes();
            } else {
                return 'Tipo Invalido';
            }
        }
    };

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

        const valores = categoriasArray.map(categoria => {
            return this.transacoes
                .filter(t =>
                    t.Categoria !== null &&
                    t.Categoria.descricao === categoria
                )
                .reduce((acc, t) => acc + t.Valor, 0);
        });

        return {
            labels: categoriasArray,
            data: valores
        };
    };
}