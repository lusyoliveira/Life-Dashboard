export default class Tarefas {
    Id
    Codigo
    Tarefa
    Adicionado
    Feito = false

    constructor(_id,codigo,tarefa, adicionado){
        this.Id = _id
        this.Codigo = codigo
        this.Tarefa = tarefa
        this.Adicionado = adicionado
    }
}