import api from "../../servicos/metodoApi.js";
import Episodio from "../../modulos/catalogo/episodioModel.js";

export class EpisodioViewModel {
    constructor(endpoint = "episodios") {
        this.endpoint = endpoint;
        this.endpointcat = "catalogo";
        this.endpointtemp = "temporadas";
        this.episodio = [];
    }

   // Salva ou atualiza um único episódio
    async salvarEpisodio(episodioModel) {
        const payload = {
            id: episodioModel.id,
            temporadaId: episodioModel.temporadaId,
            idTMDB: episodioModel.idTMDB,
            numeroEpisodio: episodioModel.numeroEpisodio,
            assistido: episodioModel.assistido,
            tituloEpisodio: episodioModel.tituloEpisodio,
            sinopse: episodioModel.sinopse,
            duracao: episodioModel.duracao,
            estreia: episodioModel.estreia,
            votos: episodioModel.votos
        };

        if (episodioModel.id) {
            return await api.atualizarDados(payload, `${this.endpointcat}/${this.endpointtemp}/${this.endpoint}/${episodioModel.id}`);
        } else {
            return await api.salvarDados(payload, `${this.endpointcat}/${this.endpointtemp}/${episodioModel.temporadaId}/${this.endpoint}`);
        }
    }

    // Salva uma lista de episódios de uma temporada (em lote ou iterativo)
    async salvarListaEpisodios(episodios = [], temporadaId) {
        const promessas = episodios.map(ep => {
            ep.temporadaId = temporadaId;
            return this.salvarEpisodio(ep);
        });

        return await Promise.all(promessas);
    }

    // Método utilitário muito comum na View: alternar status de assistido
    async atualizarAssistido(episodioId, assistido) {
        return await api.atualizarDados({ assistido }, `${this.endpointcat}/${this.endpointtemp}/${this.endpoint}/${episodioId}/assistido`);
    }
}