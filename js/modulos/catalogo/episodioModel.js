export default class Episodio {
    constructor({
        id = null,
        temporadaId = null,
        id_tmdb_episodio = null,
        numero_episodio = null,
        assistido = false,
        titulo_episodio = '',
        sinopse = '',
        duracao = 0,
        estreia = null,
        votos = 0
    } = {}) {
        this.id = id;
        this.temporadaId = temporadaId;
        this.id_tmdb_episodio = id_tmdb_episodio;
        this.numero_episodio = numero_episodio;
        this.assistido = assistido;
        this.titulo_episodio = titulo_episodio;
        this.sinopse = sinopse;
        this.duracao = duracao;
        this.estreia = estreia;
        this.votos = votos;
    }  
}