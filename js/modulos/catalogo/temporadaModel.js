import Episodio from "./episodioModel.js";

export default class Temporada {
    id
    tituloId
    idTMDBTemporada
    numeroTemporada
    nomeTemporada
    sinopse
    estreia
    posterTemporada
    votosTemporada
    quantidadeEpisodios
    listaEpisodios

    constructor(id, tituloId, idTMDBTemporada, numeroTemporada, nomeTemporada, sinopse, estreia, posterTemporada, votosTemporada, quantidadeEpisodios, listaEpisodios = []) {
        this.id = id
        this.tituloId = tituloId
        this.idTMDBTemporada = idTMDBTemporada
        this.numeroTemporada = numeroTemporada
        this.nomeTemporada = nomeTemporada
        this.sinopse = sinopse
        this.estreia = estreia ? new Date(estreia) : null
        this.posterTemporada = posterTemporada
        this.votosTemporada = votosTemporada
        this.quantidadeEpisodios = quantidadeEpisodios
        this.listaEpisodios = listaEpisodios.map(
            ep => new Episodio(ep.id, ep.temporadaId, ep.idTMDB, ep.numeroEpisodio, ep.assistido, ep.tituloEpisodio, ep.sinopse, ep.duracao, ep.estreia, ep.votos)
        );
    }
}