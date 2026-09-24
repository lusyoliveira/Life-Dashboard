export default class Episodio {
    id
    temporadaId
    idTMDB
    numeroEpisodio
    assistido
    tituloEpisodio
    sinopse
    duracao
    estreia
    votos

    constructor(id, temporadaId, idTMDB, numeroEpisodio, assistido = false, tituloEpisodio, sinopse, duracao, estreia, votos){
        this.id = id
        this.temporadaId = temporadaId
        this.idTMDB = idTMDB
        this.numeroEpisodio = numeroEpisodio
        this.assistido = assistido
        this.tituloEpisodio = tituloEpisodio
        this.sinopse = sinopse
        this.duracao = duracao
        this.estreia = estreia
        this.votos = votos
    }  
}