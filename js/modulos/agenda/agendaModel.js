export default class Agenda {
    id
    Titulo
    Status
    Categoria
    Tipo
    Data
    Recorrente
    Periodicidade


    constructor (id,titulo,status,categoria,tipo,data,recorrente, periodicidade,) {
        this.id = id
        this.Titulo = titulo           
        this.Status = status  
        this.Categoria = categoria
        this.Tipo = tipo
        this.Data = data        
        this.Recorrente = recorrente ? recorrente : false
        this.Periodicidade = periodicidade ? periodicidade : null
    }
}