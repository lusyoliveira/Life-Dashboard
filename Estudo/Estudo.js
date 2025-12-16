export default class Estudo {
    id
    Capa
    Escola
    Aulas
    Assistido
    Horas
    Name
    Professor
    Assunto
    Comprado
    Valor
    Status
    Certificado

    constructor(_id, capa, escola,aulas, assistido, horas,name,professor,assunto,comprado,valor,status, certificado = false){
        this.id = _id
        this.Capa = capa
        this.Escola = escola
        this.Aulas = aulas
        this.Assistido = assistido
        this.Horas = horas
        this.Name = name
        this.Professor = professor
        this.Assunto = assunto
        this.Comprado = comprado
        this.Valor = valor
        this.Status = status
        this.Certificado = certificado
    }

    get Progresso () {
        if (!this.Assistido || !this.Aulas || isNaN(this.Assistido) || isNaN(this.Aulas)) {
            return 0;
        }
            return (this.Assistido / this.Aulas) * 100; 
    }
}