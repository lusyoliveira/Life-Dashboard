export default class Episodio {
    id
    temporadaId
    idTMDB
    numeroEpisodio
    tituloEpisodio
    sinopse
    duracao
    estreia
    votos

    constructor(id, temporadaId, idTMDB, numeroEpisodio, tituloEpisodio, tituloEpisodio, sinopse, duracao, estreia, votos){
        this.id = id
        this.temporadaId = temporadaId
        this.idTMDB = idTMDB
        this.numeroEpisodio = numeroEpisodio
        this.tituloEpisodio = tituloEpisodio
        this.sinopse = sinopse
        this.duracao = duracao
        this.estreia = estreia
        this.votos = votos
    }  
}