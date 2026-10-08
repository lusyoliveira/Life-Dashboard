import api from "../../servicos/metodoApi.js";
import Temporada from "../../modulos/catalogo/temporadaModel.js";
import { EpisodioViewModel } from './EpisodioViewModel.js';

export class TemporadaViewModel {
    constructor(endpoint = "temporada") {
        this.episodioVM = new EpisodioViewModel();
        this.endpointcat = "catalogo";
        this.endpoint = endpoint;
        this.temporada = [];
    }

    async obterTemporada() {
        const temporadaData = await api.buscarDados(this.endpoint);

        this.temporada = temporadaData.map((item) => {
            const temporadas = new Temporada(
                item.id,
                item.tituloId,
                item.id_tmdb_temporada,
                item.numero_temporada,
                item.nome_temporada,
                item.sinopse,
                item.estreia,
                item.poster,
                item.votos,
                item.quantidade_episodios
            );
            return temporadas;
        });
        return this.temporada;
    };  
    
    async obterTemporadaPorId(id) {
        const temporadaData = await api.buscarDadosPorId(id, this.endpoint);
        
        if(!temporadaData) return null;

        const temporada = new Temporada(
            temporadaData.id,
            temporadaData.tituloId,
            temporadaData.id_tmdb_temporada,
            temporadaData.numero_temporada,
            temporadaData.nome_temporada,
            temporadaData.sinopse,
            temporadaData.estreia,
            temporadaData.poster,
            temporadaData.votos,
            temporadaData.quantidade_episodios
        );
        return temporada;
    };
}