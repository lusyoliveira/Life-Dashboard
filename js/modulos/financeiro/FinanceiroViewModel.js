import api from "../../servicos/metodoApi.js";
import Transacao from "../financeiro/transacaoModel.js";
import { CategoriaViewModel } from "../categorias/CategoriasViewModel.js";
import metodoData from "../../Utils/metodoData.js"

export class FinanceiroViewModel {
    constructor(endpoint = "transacoes") {
        this.endpoint = endpoint;
        this.transacoes = [];
        this.gerandoRecorrencia = false;
        this.ultimaExecucao = null;
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
                transacao.Parcelamento,  
                transacao.Tipo,
                transacao.Recorrente,
                transacao.Periodicidade,
                transacao.RecorrenciaInicio,
                transacao.RecorrenciaFim,
                transacao.UltimaGeracao
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
            transacao.Parcelamento,  
            transacao.Tipo,
            transacao.Recorrente,
            transacao.Periodicidade,
            transacao.RecorrenciaInicio,
            transacao.RecorrenciaFim,
            transacao.UltimaGeracao  
        );       
        return transacoes;
    }

    async salvarTransacao(transacao) {
        
        if (transacao.id) {
        await api.atualizarDados(transacao, this.endpoint);
        } else {
            //verifica tipo de transação
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
                //verifica se é parcelamento e gera as parcelas
                if (transacao.Parcelamento && transacao.ParcelaInicio > 0) {
                    const totalParcelas = transacao.ParcelaInicio; // - transacao.ParcelaInicio;
                    const valorParcela = Math.abs(transacao.Valor) / (totalParcelas + 1);

                    for (let i = 1; i <= totalParcelas; i++) {
                        const novaData = new Date(transacao.Data);
                        novaData.setMonth(novaData.getMonth() + i);

                        const transacaoParcela = {
                            ...transacaoDespesa,
                            Data: novaData.toISOString().split('T')[0],
                            Valor: -Math.abs(valorParcela),
                            ContaDestino: null,
                        };
                        await api.salvarDados(transacaoParcela, this.endpoint);
                    }
                } else if (transacao.Recorrente) {
                    transacaoDespesa.UltimaGeracao = transacaoDespesa.Data;
                    transacaoDespesa.RecorrenciaInicio = transacaoDespesa.Data;
                    transacaoDespesa.Valor = -Math.abs(transacao.Valor);
                    transacaoDespesa.ContaDestino = null;

                    await api.salvarDados(transacaoDespesa, this.endpoint);
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

    async gerarRecorrencias() {
        const transacoes = await this.obterTransacoes();
        const recorrentes = transacoes.filter(t => t.Recorrente);

        const hoje = new Date();

        for (const t of recorrentes) {
            if (!t.Recorrente) continue;

            const inicio = new Date(t.RecorrenciaInicio);
            const ultima = new Date(t.UltimaGeracao);

            // antes do início
            if (hoje < inicio) continue;

            let proxima = metodoData.calcularProximaData(ultima, t.Periodicidade);

            // passou do fim
            if (t.RecorrenciaFim) {
                const fim = new Date(t.RecorrenciaFim);
                if (proxima > fim) continue;
            }

            // gera múltiplas se estiver atrasado
            while (proxima <= hoje) {
                const dataAtualizacao = proxima.toISOString().split('T')[0];

                const jaExiste = transacoes.some(x => {
                    if (x.Descricao !== t.Descricao) return false;

                    const data = new Date(x.Data);

                    return data.toDateString() === proxima.toDateString();
                });

                if (!jaExiste) {
                    const novaTransacao = {
                        ...t,
                        id: null,
                        Data: proxima.toISOString().split('T')[0],
                        Recorrente: false,
                        UltimaGeracao: null,
                        ContaDestino: null
                    };

                    await api.salvarDados(novaTransacao, this.endpoint);
                }

                // atualiza última geração
                await api.atualizarDados(
                    {
                        ...t,
                        id: t.Id,
                        UltimaGeracao: dataAtualizacao
                    },
                    this.endpoint
                );

                // próxima iteração
                const proximaIteracao = metodoData.calcularProximaData(proxima, t.Periodicidade);

                if (proximaIteracao.getTime() === proxima.getTime()) break;

                proxima = proximaIteracao;
            }
        }
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