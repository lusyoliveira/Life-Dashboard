import api from "../js/metodoApi.js";
//import Tarefas from "../Tarefas.js";

export class TarefasViewModel {
  constructor(endpoint = "tarefas") {
    this.endpoint = endpoint;
    this.tarefas = [];
  }

  async obterTarefas() {
    let tarefas = [];
 
    tarefas = await api.buscarDados(this.endpoint);
    this.tarefas = tarefas.map(tarefa => {
        return {
            ...tarefa,
            Adicionado: new Date(tarefa.Adicionado).toLocaleDateString('pt-BR')
        };
    });
    
    return this.tarefas;    
  }

  async obterTarefaPorID(tarefaId) {
    let tarefa = {};

    // A chamada à API já retorna um único objeto
    tarefa = await api.buscarDadosPorId(tarefaId,this.endpoint);

   // Verifique se a tarefa existe antes de tentar formatar a data
    if (tarefa) {
      this.tarefas = {
        ...tarefa,
        id: Number(tarefa.id),
        Adicionado: new Date(tarefa.Adicionado).toLocaleDateString('pt-BR')
      };
      return this.tarefas;
    } else {
      return null;
    }
  }

  async salvarTarefa(tarefa) {
    if (tarefa.id) {
      await api.atualizarDados(tarefa, this.endpoint);
    } else {
      await api.salvarDados(tarefa, this.endpoint);
    }
    return this.obterTarefas();
  }

  async marcarTarefa(tarefa) {
    if (tarefa.id) {
      await api.atualizarDados(tarefa, this.endpoint);
    } else {
      alert('É necessário definir uma tarefas')
    }
    return this.obterTarefas();
  }

  async excluirTarefa(id) {
    await api.excluirDados(id, this.endpoint);
    return this.obterTarefas();
  }
}