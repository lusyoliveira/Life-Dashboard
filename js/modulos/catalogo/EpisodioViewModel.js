import api from "../../servicos/metodoApi.js";

export class EpisodioViewModel {
    constructor(endpoint = "episodios") {
        this.endpoint = endpoint;
        this.episodio = [];
    }

    // Método para alternar status de assistido
   async atualizarEpisodioAssistido(episodioId, assistido) {
        try {
            return await api.atualizarCampo(
                { assistido }, 
                `catalogo/temporadas/episodios/${episodioId}/assistido`
            );
        } catch (error) {
            console.error("Erro no ViewModel ao atualizar episódio:", error);
            throw error;
        }
    }
}