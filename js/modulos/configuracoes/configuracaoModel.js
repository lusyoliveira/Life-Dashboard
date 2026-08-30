export default class Configuracao {
    id
    ativaMAL 
    ativaOutlook
    chaveOutlook
    ativaGoogle 
    chaveGoogle
    cidade
    latitude
    longitude 
    ativaClima
    atualizaClima
    dataContagem
    descricaoContagem
    ativaTMDB
    chaveTMDB

    constructor(_id, ativMAL, ativaOutlook, chaveOutlook, ativaGoogle, chaveGoogle, cidade, latitude = 0, longitude = 0,ativaClima, atualizaClima = 0, dataContagem = new Date(), descricaoContagem, ativaTMDB, chaveTMDB) {
        this.id = _id
        this.ativaMAL = ativMAL
        this.ativaOutlook = ativaOutlook
        this.chaveOutlook = chaveOutlook
        this.ativaGoogle = ativaGoogle
        this.chaveGoogle = chaveGoogle
        this.cidade = cidade
        this.latitude = latitude ?? 0
        this.longitude = longitude ?? 0
        this.ativaClima = ativaClima
        this.atualizaClima = atualizaClima ?? 0
        this.dataContagem = dataContagem ? new Date(dataContagem) : new Date()
        this.descricaoContagem = descricaoContagem
        this.ativaTMDB = ativaTMDB
        this.chaveTMDB = chaveTMDB
    }
}