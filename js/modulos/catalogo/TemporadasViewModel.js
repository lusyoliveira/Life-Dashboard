import { EpisodioViewModel } from './EpisodioViewModel.js';

export class TemporadaViewModel {
    constructor(endpoint = "temporada") {
        this.episodioVM = new EpisodioViewModel();
        this.temporada = [];
    }

}