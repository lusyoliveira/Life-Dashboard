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
                transacao.id,
                transacao.escricao,
                transacao.data,
                transacao.categoria,
                transacao.contaDestino,
                transacao.contaOrigem,
                transacao.valor,
                transacao.parcelaInicio,
                transacao.parcelamento,  
                transacao.tipo,
                transacao.recorrente,
                transacao.periodicidade,
                transacao.recorrenciaInicio,
                transacao.recorrenciaFim,
                transacao.ultimaGeracao
            );
            return listaTransacoes;            
        })
        return this.transacoes;
    };

    async obterTransacaoPorID(ID) {
      const transacao = await api.buscarDadosPorId(ID,this.endpoint);
        if (!transacao) return null;

        const transacoes = new Transacao(
                transacao.id,
                transacao.descricao,
                transacao.data,
                {
                    id: transacao.categoriaId,
                    descricao: transacao.categoria,
                },
                {
                    id: transacao.contaDestinoId,
                    descricao: transacao.contaDestino.descricao
                },
                {
                    id: transacao.contaOrigemId,
                    descricao: transacao.contaOrigem.descricao
                },
                transacao.valor,
                transacao.parcelaInicio,
                transacao.parcelamento,  
                transacao.tipo,
                transacao.recorrente,
                transacao.periodicidade,
                transacao.recorrenciaInicio,
                transacao.recorrenciaFim,
                transacao.ultimaGeracao 
        );       
        return transacoes;
    }

    async salvarTransacao(transacao) {
        
        if (transacao.id) {
        await api.atualizarDados(transacao, this.endpoint);
        } else {
            //verifica tipo de transação
            if (transacao.tipo === 'T') {
                const transacaoOrigem = { ...transacao };
                transacaoOrigem.valor = -Math.abs(transacao.valor);
                transacaoOrigem.categoria = null;

                await api.salvarDados(transacaoOrigem, this.endpoint);

                const transacaoDestino = { ...transacao };
                transacaoDestino.valor = Math.abs(transacao.valor);
                transacaoDestino.categoria = null;

                await api.salvarDados(transacaoDestino, this.endpoint);
                return this.obterTransacoes();

            } else if (transacao.tipo === 'R') {

                const transacaoReceita = { ...transacao };
                transacaoReceita.valor = Math.abs(transacao.valor);
                transacaoReceita.contaDestino = null;

                await api.salvarDados(transacaoReceita, this.endpoint);
                return this.obterTransacoes();

            } else if (transacao.tipo === 'D') {
                const transacaoDespesa = { ...transacao };                          
                //verifica se é parcelamento e gera as parcelas
                if (transacao.parcelamento && transacao.parcelaInicio > 0) {
                    const totalParcelas = transacao.parcelaInicio; 
                    const valorParcela = Math.abs(transacao.Valor) / (totalParcelas + 1);

                    for (let i = 1; i <= totalParcelas; i++) {
                        const novaData = new Date(transacao.data);
                        novaData.setMonth(novaData.getMonth() + i);

                        const transacaoParcela = {
                            ...transacaoDespesa,
                            data: novaData.toISOString().split('T')[0],
                            valor: -Math.abs(valorParcela),
                            contaDestino: null,
                        };
                        await api.salvarDados(transacaoParcela, this.endpoint);
                    }
                } else if (transacao.recorrente) {
                    transacaoDespesa.ultimaGeracao = transacaoDespesa.data;
                    transacaoDespesa.recorrenciaInicio = transacaoDespesa.data;
                    transacaoDespesa.valor = -Math.abs(transacao.valor);
                    transacaoDespesa.contaDestino = null;

                    await api.salvarDados(transacaoDespesa, this.endpoint);
                } else {                    
                    transacaoDespesa.valor = -Math.abs(transacao.valor);
                    transacaoDespesa.contaDestino = null;

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
        const recorrentes = transacoes.filter(t => t.recorrente);

        const hoje = new Date();

        for (const t of recorrentes) {
            if (!t.recorrente) continue;

            const inicio = new Date(t.recorrenciaInicio);
            const ultima = new Date(t.ultimaGeracao);

            // antes do início
            if (hoje < inicio) continue;

            let proxima = metodoData.calcularProximaData(ultima, t.periodicidade);

            // passou do fim
            if (t.recorrenciaFim) {
                const fim = new Date(t.recorrenciaFim);
                if (proxima > fim) continue;
            }

            // gera múltiplas se estiver atrasado
            while (proxima <= hoje) {
                const dataAtualizacao = proxima.toISOString().split('T')[0];

                const jaExiste = transacoes.some(x => {
                    if (x.descricao !== t.descricao) return false;

                    const data = new Date(x.data);

                    return data.toDateString() === proxima.toDateString();
                });

                if (!jaExiste) {
                    const novaTransacao = {
                        ...t,
                        id: null,
                        data: proxima.toISOString().split('T')[0],
                        recorrente: false,
                        ultimaGeracao: null,
                        contaDestino: null
                    };

                    await api.salvarDados(novaTransacao, this.endpoint);
                }

                // atualiza última geração
                await api.atualizarDados(
                    {
                        ...t,
                        id: t.Id,
                        ultimaGeracao: dataAtualizacao
                    },
                    this.endpoint
                );

                // próxima iteração
                const proximaIteracao = metodoData.calcularProximaData(proxima, t.periodicidade);

                if (proximaIteracao.getTime() === proxima.getTime()) break;

                proxima = proximaIteracao;
            }
        }
    };

    async filtrarTransacoesAVencer(qtd = 13) {
        const transacoes = await this.obterTransacoes();

        const transacoesFiltrada = transacoes.filter(transacao => {
            const dataTransacao = new Date(transacao.data);
           
            return dataTransacao > new Date(); 
        })
        .filter (transacoes => transacoes.tipo === 'D')
        .sort((a, b) => new Date(a.data) - new Date(b.data))
        .slice(0, qtd);

        return transacoesFiltrada;
    };

    async transacoesporCategoria() {
        const categoriaVM = new CategoriaViewModel();
        const categorias = await categoriaVM.obterCategoria('Financeiro');
        const categoriasArray = categorias.map(c => c.descricao);

        await this.obterTransacoes();

        const valores = categoriasArray.map(categoria => {
            return this.transacoes
                .filter(t =>
                    t.Categoria !== null &&
                    t.Categoria.descricao === categoria
                )
                .reduce((acc, t) => acc + t.valor, 0);
        });

        return {
            labels: categoriasArray,
            data: valores
        };
    };

    async filtrarTransacoesAVencer(qtd = 13) {
        const transacoes = await this.obterTransacoes();

        const transacoesFiltrada = transacoes.filter(transacao => {
            const dataTransacao = new Date(transacao.data);
           
            return dataTransacao > new Date(); 
        })
        .filter (transacoes => transacoes.tipo === 'D')
        .sort((a, b) => new Date(a.data) - new Date(b.data))
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
                    t.Categoria.Descricao === categoria
                )
                .reduce((acc, t) => acc + t.Valor, 0);
        });

        return {
            labels: categoriasArray,
            data: valores
        };
    };
}