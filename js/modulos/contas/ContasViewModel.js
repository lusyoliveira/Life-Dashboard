import api from "../../servicos/metodoApi.js";
import Contas from "../contas/contasModel.js";

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

  async obterContasPorID(contasID) {
        const contas = await api.buscarDadosPorId(contasID,this.endpoint);
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
  }

  async excluirContas(id) {
    await api.excluirDados(id, this.endpoint);
    return this.obterContas();
  }
}