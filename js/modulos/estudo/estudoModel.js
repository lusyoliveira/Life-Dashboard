export default class Estudo {
    id
    Capa
    Plataforma
    Aulas
    Assistido
    Horas
    Descricao
    Professor
    Area
    Comprado
    Valor
    Status
    Certificado

    constructor(_id, capa, plataforma,aulas, assistido, horas,descricao,professor,area,comprado,valor,status, certificado = false){
        this.id = _id
        this.Capa = capa
        this.Plataforma = plataforma
        this.Aulas = aulas
        this.Assistido = assistido
        this.Horas = horas
        this.Descricao = descricao
        this.Professor = professor
        this.Area = area
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