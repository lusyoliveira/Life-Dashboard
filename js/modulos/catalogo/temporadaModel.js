export default class Temporada {
    id
    tituloId
    temporada
    nomeTemporada
    plataformaExibicao
    sinopse
    exibicao
    id_tmdb_temporada
    posterTemporada
    mediaVotosTemporada
    numeroEpisodio
    tituloEpisodio
    mediaVotosEpisodio

    constructor(id, tituloId, temporada, nomeTemporada, plataformaExibicao, sinopse, exibicao, id_tmdb_temporada, posterTemporada, mediaVotosTemporada, numeroEpisodio, tituloEpisodio, mediaVotosEpisodio) {
        this.id = id
        this.tituloId = tituloId
        this.temporada = temporada
        this.nomeTemporada = nomeTemporada
        this.plataformaExibicao = plataformaExibicao
        this.sinopse = sinopse
        this.exibicao = exibicao ? new Date(exibicao) : null
        this.id_tmdb_temporada = id_tmdb_temporada
        this.posterTemporada = posterTemporada
        this.mediaVotosTemporada = mediaVotosTemporada
        this.numeroEpisodio = numeroEpisodio
        this.tituloEpisodio = tituloEpisodio
        this.mediaVotosEpisodio = mediaVotosEpisodio
    }
}