import api from "../../servicos/metodoApi.js";
import Agenda from "../agenda/agendaModel.js";
import AgendaTipo from "./agendaTipoModel.js";
import AgendaStatus from "./agendaStatusModel.js";
import AgendaCategoria from "./agendaCategoriaModel.js";
 
export class AgendaViewModel {
  constructor(endpoint = "agenda") {
    this.endpoint = endpoint;
    this.agenda = [];
    this.tipos = [];
    this.status = [];
    this.categorias = [];
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
  };

  async obterAgendaTipos() {
  
    const tipoData = await api.buscarDados(`${this.endpoint}/tipos`);
    
    this.tipos = tipoData.map((tipo) => {
        const tipos = new AgendaTipo(
          tipo._id,
          tipo.descricao
        );               
      return tipos;
    })     
    return this.tipos;
  };

  async obterAgendaStatus() {
  
    const statusData = await api.buscarDados(`${this.endpoint}/status`);
    
    this.status = statusData.map((statu) => {
        const status = new AgendaStatus(
          statu._id,
          statu.descricao
        );               
      return status;
    })     
    return this.status;
  };

  async obterAgendaCategoria() {
  
    const categoriaData = await api.buscarDados(`${this.endpoint}/categorias`);
    
    this.categorias = categoriaData.map((categoria) => {
        const categorias = new AgendaCategoria(
          categoria._id,
          categoria.descricao
        );               
      return categorias;
    })     
    return this.categorias;
  };
}