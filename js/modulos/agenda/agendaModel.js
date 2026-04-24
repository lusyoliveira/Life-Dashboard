export default class Agenda {
    id
    Titulo
    Status
    Categoria
    Tipo
    Data

    constructor (id, titulo,status,categoria,tipo,data) {
        this.id = id
        this.Titulo = titulo           
        this.Status = status
        this.Categoria = categoria
        this.Tipo = tipo
        this.Data = data
    }
}