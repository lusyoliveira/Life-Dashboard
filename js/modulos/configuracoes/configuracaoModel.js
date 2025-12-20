export default class Configuracao {
    id
    AtivaMAL 
    AtivaOutlook
    ChaveOutlook
    AtivaGoogle 
    ChaveGoogle
    Cidade
    Latitude
    Longitude 
    AtivaClima
    AtualizaClima
    DataContagem
    DescricaoContagem

    constructor(_id, ativMAL, ativaOutlook, chaveOutlook, ativaGoogle, chaveGoogle, cidade, latitude = 0, longitude = 0,ativaClima, atualizaClima = 0, dataContagem = new Date(), descricaoContagem) {
        this.id = _id
        this.AtivaMAL = ativMAL
        this.AtivaOutlook = ativaOutlook
        this.ChaveOutlook = chaveOutlook
        this.AtivaGoogle = ativaGoogle
        this.ChaveGoogle = chaveGoogle
        this.Cidade = cidade
        this.Latitude = latitude ?? 0
        this.Longitude = longitude ?? 0
        this.AtivaClima = ativaClima
        this.AtualizaClima = atualizaClima ?? 0
        this.DataContagem = dataContagem ? new Date(dataContagem) : new Date()
        this.DescricaoContagem = descricaoContagem
    }
}