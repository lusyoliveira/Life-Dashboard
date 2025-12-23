import api from "../../servicos/metodoApi.js";
import Curso from "./estudoModel.js";
import EstudoStatus from "./estudoStatusModel.js";
import EstudoAreas from "./estudoAreaModel.js";

export class EstudoViewModel {
  constructor(endpoint = "cursos") {
    this.endpoint = endpoint;
    this.cursos = [];
    this.areas = [];
    this.status = [];
  }

  async obterCursos() {
    const cursosData = await api.buscarDados(this.endpoint);
    
    this.cursos = cursosData.map(curso => {
      const cursos = new Curso(
        curso._id,
        curso.Capa,
        curso.Escola,
        curso.Aulas,
        curso.Assistido,
        curso.Horas,
        curso.Name,
        curso.Professor,
        curso.Assunto,
        curso.Comprado,
        curso.Valor,
        curso.Status,
        curso.Certificado
      );
      //console.log(cursos);
      
        return cursos;
    });   
    return this.cursos;
  }

  async obterCursoPorID(idCurso) {
    const curso = await api.buscarDadosPorId(idCurso, this.endpoint);
    if (!curso) return null;

      const cursos = new Curso(
        curso._id,
        curso.Capa,
        curso.Escola,
        curso.Aulas,
        curso.Assistido,
        curso.Horas,
        curso.Name,
        curso.Professor,
        curso.Assunto,
        curso.Comprado,
        curso.Valor,
        curso.Status,
        curso.Certificado
      );

    return cursos;
  }

  async salvarCurso(curso) {
    if (curso.id) {
      await api.atualizarDados(curso, this.endpoint);
    } else {
      await api.salvarDados(curso, this.endpoint);
    }
    return this.obterCursos();
  }

  async excluirCurso(id) {
    await api.excluirDados(id, this.endpoint);
    return this.obterCursos();
  }

  cursando(qtd = 3) {
      return this.cursos
          .filter(curso => curso.Status === "Cursando")
          .slice(0, qtd);
  };

  async obterEstudoAreas() {
  
    const areasData = await api.buscarDados(`${this.endpoint}/tipos`);
    
    this.areas = areasData.map((area) => {
        const areas = new EstudoAreas(
          area._id,
          area.descricao
        );               
      return areas;
    })     
    return this.areas;
  };

  async obterEstudoStatus() {
  
    const statusData = await api.buscarDados(`${this.endpoint}/status`);
    
    this.status = statusData.map((statu) => {
        const status = new EstudoStatus(
          statu._id,
          statu.descricao
        );               
      return status;
    })     
    return this.status;
  };

}