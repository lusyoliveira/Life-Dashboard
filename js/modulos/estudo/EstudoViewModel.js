import api from "../../servicos/metodoApi.js";
import Curso from "./estudoModel.js";

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
        curso.id,
        curso.capa,
        {
          id: curso.plataformaId,
          descricao: curso.Plataforma.descricao
        },
        curso.aulas,
        curso.assistido,
        curso.horas,
        curso.descricao,
        curso.professor,
        {
          id: curso.areaId,
          descricao: curso.Area.descricao
        },
        curso.comprado,
        curso.valor,
        {
          id: curso.statusId,
          descricao: curso.Status.descricao
        },
        curso.certificado
      );      
        return cursos;
    });   
    return this.cursos;
  }

  async obterCursoPorID(idCurso) {
    const curso = await api.buscarDadosPorId(idCurso, this.endpoint);
    if (!curso) return null;

      const cursos = new Curso(
        curso.id,
        curso.capa,
        {
          id: curso.plataformaId,
          descricao: curso.Plataforma.descricao
        },
        curso.aulas,
        curso.assistido,
        curso.horas,
        curso.descricao,
        curso.professor,
        {
          id: curso.areaId,
          descricao: curso.Area.descricao
        },
        curso.comprado,
        curso.valor,
        {
          id: curso.statusId,
          descricao: curso.Status.descricao
        },
        curso.certificado
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
          .filter(curso => curso.Status.descricao === "Cursando")
          .slice(0, qtd);
  };

}