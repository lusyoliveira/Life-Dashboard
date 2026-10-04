import Episodio from "./episodioModel.js";

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
            <div class="list-group-item list-group-item-action gap-3 py-3 item-episodio" aria-current="true"  
                data-ep-id="${epId}" 
                data-ep-numero="${epNum}">
                    <div class="d-flex gap-2 justify-content-between">
                        <div class="d-flex gap-2">
                            <input class="form-check-input chk-episodio-assistido" type="checkbox" ${checked}>
                            <h6 class="mb-0">${epNome}</h6>
                        </div>
                        <small class="opacity-50 text-nowrap">${episodio.exibicao_episodios}</small>
                        <span class="badge text-bg-warning">${episodio.media_votos_episodio}</span>
                    </div>                            
                    <div>
                        <p class="mb-0 opacity-75">${episodio.sinopse_episodio}</p>
                    </div>
            </div>
   
        `;


        
    };

    // Captura os dados digitados/marcados em um elemento de episódio na DOM
    extrairDadosEpisodioDoElemento(elEp) {
        return {
            id: elEp.dataset.epId || null,
            numero: Number(elEp.dataset.epNumero),
            assistido: elEp.querySelector('.chk-episodio-assistido')?.checked || false
        };
    }
}