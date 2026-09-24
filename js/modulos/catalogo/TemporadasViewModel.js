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

    async salvarTemporada(temporadaModel) {
        const payload = {
            id : temporadaModel.id,
            tituloId : temporadaModel.tituloId,
            idTMDBTemporada : temporadaModel.idTMDBTemporada,
            numeroTemporada : temporadaModel.numeroTemporada,
            nomeTemporada : temporadaModel.nomeTemporada,
            sinopse : temporadaModel.sinopse,
            estreia : temporadaModel.estreia,
            posterTemporada : temporadaModel.posterTemporada,
            votosTemporada : temporadaModel.votosTemporada,
            quantidadeEpisodios : temporadaModel.quantidadeEpisodios
        };

        // 1. Salva a temporada primeiro no backend para obter/confirmar o ID
        let temporadaSalva;
        if (temporadaModel.id) {
            temporadaSalva = await api.atualizarDados(payload, `${this.endpointcat}/${this.endpoint}/${temporadaModel.id}`);
        } else {
            temporadaSalva = await api.salvarDados(payload, `${this.endpointcat}/${temporadaModel.tituloId}/${this.endpoint}`);
        }

        const temporadaId = temporadaSalva.id || temporadaModel.id;

        // 2. Delega o salvamento dos episódios para o EpisodioViewModel
        if (temporadaModel.episodios && temporadaModel.episodios.length > 0) {
            await this.episodioVM.salvarListaEpisodios(temporadaModel.listaEpisodios, temporadaId);
        }
    };
}