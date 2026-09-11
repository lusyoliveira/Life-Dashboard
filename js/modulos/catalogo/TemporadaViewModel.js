import api from "../../servicos/metodoApi.js";
import apiTMDB from "../../integracoes/tmDB/metodoTMDB.js";
import { ConfiguracaoViewModel } from "../configuracoes/ConfiguracaoViewModel.js";
import Temporada from "../../modulos/catalogo/temporadaModel.js";

export class TemporadaViewModel {
    constructor(endpoint = "temporada") {
        this.endpoint = endpoint;
        this.temporada = [];
    }

    async obterTemporada() {
        const temporadaData = await api.buscarDados(this.endpoint);

        this.temporada = temporadaData.map((item) => {
            const temporadas = new Temporada(
                item.id,
                item.tituloId,
                item.temporada,
                item.nomeTemporada,
                item.plataformaExibicao,
                item.sinopse,
                item.exibicao,
                item.id_tmdb_temporada,
                item.posterTemporada,
                item.mediaVotosTemporada,
                item.numeroEpisodio,
                item.tituloEpisodio,
                item.mediaVotosEpisodio
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
            temporadaData.temporada,
            temporadaData.nomeTemporada,
            temporadaData.plataformaExibicao,
            temporadaData.sinopse,
            temporadaData.exibicao,
            temporadaData.id_tmdb_temporada,
            temporadaData.posterTemporada,
            temporadaData.mediaVotosTemporada,
            temporadaData.numeroEpisodio,
            temporadaData.tituloEpisodio,
            temporadaData.mediaVotosEpisodio
        );
        return temporada;
    };

    async salvarTemporada(temporada) {
        const temporadaData = {
            id: temporada.id,
            tituloId: temporada.tituloId,
            temporada: temporada.temporada,
            nomeTemporada: temporada.nomeTemporada,
            plataformaExibicao: temporada.plataformaExibicao,
            sinopse: temporada.sinopse,
            exibicao: temporada.exibicao,
            id_tmdb_temporada: temporada.id_tmdb_temporada,
            posterTemporada: temporada.posterTemporada,
            mediaVotosTemporada: temporada.mediaVotosTemporada,
            numeroEpisodio: temporada.numeroEpisodio,
            tituloEpisodio: temporada.tituloEpisodio,
            mediaVotosEpisodio: temporada.mediaVotosEpisodio
        };

        if(temporada.id) {
            await api.atualizarDados(temporadaData, this.endpoint);
        } else {
            await api.salvarDados(temporadaData, this.endpoint);
        }
        return this.temporada;
    };
}