import api from "../../servicos/metodoApi.js";
import Agenda from "../agenda/agendaModel.js";
import { CategoriaViewModel } from "../categorias/CategoriasViewModel.js";
import metodoData from "../../Utils/metodoData.js"
 
export class AgendaViewModel {
  constructor(endpoint = "agenda") {
    this.endpoint = endpoint;
    this.agenda = [];    
  }

  async obterAgenda() {
    const agendaData = await api.buscarDados(this.endpoint);
   
    this.agenda = agendaData.map((compromisso) => {
      
        const compromissos = new Agenda(
          compromisso.id,
          compromisso.titulo,
          {
            id: compromisso.statusId,
            descricao: compromisso.Status.descricao
          },
          {
            id: compromisso.categoriaId,
            descricao: compromisso.Categoria.descricao
          },
          {
            id: compromisso.tipoId,
            descricao: compromisso.Tipo.descricao
          },
          compromisso.data,
          compromisso.recorrente,
          compromisso.periodicidade
        );             
        return compromissos;        
    })     
    return this.agenda;
  };

  async obterAgendaPorID(agendaID) {
      const compromisso = await api.buscarDadosPorId(agendaID,this.endpoint);
    if (!compromisso) return null;

    const agenda = new Agenda(
         compromisso.id,
          compromisso.titulo,
          {
            id: compromisso.statusId,
            descricao: compromisso.Status.descricao
          },
          {
            id: compromisso.categoriaId,
            descricao: compromisso.Categoria.descricao
          },
          {
            id: compromisso.tipoId,
            descricao: compromisso.Tipo.descricao
          },
          compromisso.data,
          compromisso.recorrente,
          compromisso.periodicidade
        );                   
      return agenda
  };

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

  async compromissosporCategoria() {
      const categoriaVM = new CategoriaViewModel();
      const categorias = await categoriaVM.obterCategoria('Agenda');
      const categoriasArray = categorias.map(c => c.Descricao);
      await this.obterAgenda();
      
      const valores = categoriasArray.map(categoria =>
          this.agenda
              .filter(t => t.Categoria.descricao === categoria).length
      );

      return {
          labels: categoriasArray,
          data: valores
      };
  };
  
   async gerarRecorrenciasAgenda() {
        const compromissos = await this.obterAgenda();
        const recorrentes = compromissos.filter(t => t.Recorrente);

        const hoje = new Date();
        const competenciaAtual = new Date(
                hoje.getFullYear(),
                hoje.getMonth(),
                1
            );
  debugger
        for (const t of recorrentes) {

            if (!t.Recorrente) continue;

            const dataAtual = new Date(t.Data);

            let proxima = metodoData.calcularProximaData(dataAtual, t.Periodicidade);

            const competenciaProxima = new Date(
                proxima.getFullYear(),
                proxima.getMonth(),
                1
            );

          // quando for recorrencia anual, está gerando a competenciaProxima com o próximo ano, tornando esse if falso
          if (competenciaProxima.toDateString() === competenciaAtual.toDateString()) {  
            const dataAtualizacao = proxima.toISOString().split('T')[0];

            const jaExiste = compromissos.some(x => {
                    return (
                        new Date(x.Data).toDateString() === proxima.toDateString()
                    )
                }
            );

            if (!jaExiste) {
                  await api.atualizarDados(
                  {
                      ...t,
                      id: t.id,
                      Data: dataAtualizacao
                  },
                  this.endpoint
              );
            }

            // próxima iteração
            const proximaIteracao = metodoData.calcularProximaData(proxima, t.Periodicidade);

            if (proximaIteracao.getTime() === proxima.getTime()) break;

            proxima = proximaIteracao;
          }
        }
    };
}