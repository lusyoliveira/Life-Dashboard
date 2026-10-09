export class EpisodioView {
        constructor(vm) {
        this.vm = vm;
    }   

    // Gera o HTML de um episódio
    renderizarItemEpisodio(episodio) {
        const epNum = episodio.numero_episodio ?? episodio.numeroEpisodio ?? 0;
        const epNome = episodio.titulo_episodio ?? episodio.tituloEpisodio ?? 'Sem título';
        const checked = episodio.assistido ? 'checked' : '';
        const epId = episodio.id_tmdb_episodio ?? episodio.idTMDB ?? '';

        return `
            <div class="list-group-item list-group-item-action gap-3 py-3 item-episodio" data-episodio="${epNum}" aria-current="true"  
                data-epidtmdb="${epId}" 
                data-epnumero="${epNum}">
                    <div class="d-flex gap-2 justify-content-between">
                        <div class="d-flex gap-2">
                            <input class="form-check-input chk-episodio-assistido" type="checkbox" ${checked}>
                            <h6 class="mb-0 titulo-episodio">${epNome}</h6>
                            <small>Duração: <small class="opacity-50 text-nowrap duracao-episodio">${episodio.duracao_episodio ?? episodio.duracao ?? 'N/A'} min</small></small>
                        </div>
                        <small>Exibição: <small class="opacity-50 text-nowrap exibicao-episodio">${episodio.exibicao_episodios}</small></small>
                        <span>Votos: <span class="badge text-bg-warning votos-episodio">${episodio.media_votos_episodio}</span></span>
                    </div>                            
                    <div>
                        <p class="mb-0 opacity-75 sinopse-episodio">${episodio.sinopse_episodio}</p>
                    </div>
            </div>
        `;        
    };
}