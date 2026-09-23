import api from "../../servicos/metodoApi.js";
import apiTMDB from "../../integracoes/tmDB/metodoTMDB.js";
import { ConfiguracaoViewModel } from "../configuracoes/ConfiguracaoViewModel.js";
import Episodio from "../../modulos/catalogo/episodioModel.js";

export class EpisodioViewModel {
    constructor(endpoint = "temporada") {
        this.endpoint = endpoint;
        this.episodio = [];
    }

    
}