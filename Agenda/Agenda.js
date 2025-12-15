export default class Agenda {
    id
    Titulo
    Status
    Categoria
    Tipo
    Data

    constructor (_id, titulo,status,categoria,tipo,data) {
        this.id = _id
        this.Titulo = titulo           
        this.Status = status
        this.Categoria = categoria
        this.Tipo = tipo
        this.Data = data
    }
}