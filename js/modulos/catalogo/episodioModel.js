export default class Episodio {
    constructor({
        id = null,
        temporadaId = null,
        idTMDB = null,
        numeroEpisodio = null,
        assistido = false,
        tituloEpisodio = '',
        sinopse = '',
        duracao = 0,
        estreia = null,
        votos = 0
    } = {}) {
        this.id = id;
        this.temporadaId = temporadaId;
        this.idTMDB = idTMDB;
        this.numeroEpisodio = numeroEpisodio;
        this.assistido = assistido;
        this.tituloEpisodio = tituloEpisodio;
        this.sinopse = sinopse;
        this.duracao = duracao;
        this.estreia = estreia;
        this.votos = votos;
    }  
}