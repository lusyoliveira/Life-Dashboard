import Episodio from "./episodioModel.js";

export default class Temporada {
    id
    tituloId
    id_tmdb_temporada
    numero_temporada
    nome_temporada
    sinopse
    estreia
    poster
    votos
    quantidade_episodios
    listaEpisodios

    constructor(id, tituloId, id_tmdb_temporada, numero_temporada, nome_temporada, sinopse, estreia, poster, votos, quantidade_episodios, listaEpisodios = []) {
        this.id = id
        this.tituloId = tituloId
        this.id_tmdb_temporada = id_tmdb_temporada
        this.numero_temporada = numero_temporada
        this.nome_temporada = nome_temporada
        this.sinopse = sinopse
        this.estreia = estreia ? new Date(estreia) : null
        this.poster = poster
        this.votos = votos
        this.quantidade_episodios = quantidade_episodios
        this.listaEpisodios = listaEpisodios.map(
            ep => new Episodio(ep)
        );
    }
}