import api from "../../servicos/metodoApi.js";
import Contas from "../contas/contasModel.js";
import { FinanceiroViewModel } from "../financeiro/FinanceiroViewModel.js";

export class ContasViewModel {
  constructor(endpoint = "contas") {
    this.endpoint = endpoint;
    this.contas = [];
  }

  async obterContas() {
    const contasData = await api.buscarDados(this.endpoint);
    
    this.contas = contasData
        .map((conta) => {
        const contas = new Contas(
          conta._id,
          conta.Agencia,
          conta.Conta,
          conta.Banco,
          conta.Descricao,
          conta.Tipo,
          conta.Saldo
        );               
      return contas;
    })     
    return this.contas;
  };

  async obterContaPorID(id) {
      const contas = await api.buscarDadosPorId(id,this.endpoint);
      if (!contas) return null;

      const contasModel = new Contas(
          contas._id,
          contas.Agencia,
          contas.Conta,
          contas.Banco,
          contas.Descricao,
          contas.Tipo,
          contas.Saldo
        );       
        return contasModel
    };

  async salvarContas(contas) {
    const payload = {
      ...contas
    };
    
    if (contas.id) {      
      await api.atualizarDados(payload, this.endpoint);
    } else {
      await api.salvarDados(payload, this.endpoint);
    }
    return this.obterContas();
  };

  async excluirContas(id) {
    await api.excluirDados(id, this.endpoint);
    return this.obterContas();
  };
  
  async calcularSaldo(contaId, saldoInicial) {
    const financeiroVM = new FinanceiroViewModel();
    const transacoes = await financeiroVM.obterTransacoes();

    const transacoesConta = transacoes.filter(t => 
        t.ContaOrigem?._id === contaId ||
        t.ContaDestino?._id === contaId
    );

    const somaMovimentacoes = transacoesConta.reduce((acc, t) => {
        return acc + Number(t.Valor);
    }, 0);

    return Number(saldoInicial) + somaMovimentacoes;
  };

}