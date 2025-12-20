import api from "../../servicos/metodoApi.js";
import Agenda from "../agenda/agendaModel.js";
 
export class AgendaViewModel {
  constructor(endpoint = "agenda") {
    this.endpoint = endpoint;
    this.agenda = [];
  }

  async obterAgenda() {
    const agendaData = await api.buscarDados(this.endpoint);
   
    this.agenda = agendaData.map((compromisso) => {
        const compromissos = new Agenda(
          compromisso._id,
          compromisso.Titulo,
          compromisso.Status,
          compromisso.Categoria,
          compromisso.Tipo,
          compromisso.Data,
        );       
        return compromissos;
    })     
    return this.agenda;
  }

    async obterAgendaPorID(agendaID) {
        const compromisso = await api.buscarDadosPorId(agendaID,this.endpoint);
      if (!compromisso) return null;

      const agenda = new Agenda(
          compromisso._id,
          compromisso.Titulo,
          compromisso.Status,
          compromisso.Categoria,
          compromisso.Tipo,
          compromisso.Data,
        );       
        return agenda
    }

  async salvarAgenda(compromisso) {
    const payload = {
      ...compromisso
    };

    if (compromisso.id) {
      
      await api.atualizarDados(payload, this.endpoint);
    } else {
      await api.salvarDados(payload, this.endpoint);
    }
    return this.obterAgenda();
  }

  async excluirAgenda(id) {
    await api.excluirDados(id, this.endpoint);
    return this.obterAgenda();
  }

  filtrarAgenda (){
    return [...this.agenda]
              .filter(compromisso => {
              const dataCompromisso = new Date(compromisso.Data);
              return dataCompromisso > new Date(); 
            })   
  } 

  filtrarProximosCompromissos(qtd = 13) {
    return [...this.agenda]
      .filter(compromisso => {
        const dataCompromisso = new Date(compromisso.Data);
        return dataCompromisso > new Date(); 
      })
      .sort((a, b) => new Date(a.Data) - new Date(b.Data))
      .slice(0, qtd);
  }
}