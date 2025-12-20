export default class Tarefas {
    Id
    Tarefa
    Adicionado
    Feito = false

    constructor(_id,tarefa, adicionado){
        this.Id = _id
        this.Tarefa = tarefa
        this.Adicionado = adicionado
    }
}