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
          conta.id,
          conta.agencia,
          conta.conta,
          conta.banco,
          conta.descricao,
          conta.tipo,
          conta.saldo
        );               
      return contas;
    })     
    return this.contas;
  };

  async obterContaPorID(id) {
      const contas = await api.buscarDadosPorId(id,this.endpoint);
      if (!contas) return null;

      const contasModel = new Contas(
          conta.id,
          conta.agencia,
          conta.conta,
          conta.banco,
          conta.descricao,
          conta.tipo,
          conta.saldo
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
        t.ContaOrigem.id === contaId ||
        t.ContaDestino?.id === contaId
    );
console.log(transacoesConta);

    const somaMovimentacoes = transacoesConta.reduce((acc, t) => {
        return acc + Number(t.Valor);
    }, 0);

    return Number(saldoInicial) + somaMovimentacoes;
  };

}