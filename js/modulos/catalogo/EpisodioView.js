import Episodio from "./episodioModel.js";

export class EpisodioView {
        constructor(vm) {
        this.vm = vm;
    }   

    // Gera o HTML de um episódio
    renderizarItemEpisodio(episodio) {
        const epNum = episodio.numero_episodio || 0;
        const epNome = episodio.titulo_episodio || 'Sem título';
        const checked = '';
        const epId = episodio.id_tmdb_episodio || '';

        return `
            <div class="d-flex align-items-center justify-content-between border-bottom py-2 item-episodio" 
                 data-ep-id="${epId}" 
                 data-ep-numero="${epNum}">
                <div class="me-2">
                    <span class="fw-bold">Ep ${epNum}:</span> ${epNome}
                </div>
                <div class="form-check">
                    <input class="form-check-input chk-episodio-assistido" type="checkbox" ${checked}>
                    <label class="form-check-label small">Assistido</label>
                </div>
            </div>
        `;
    }

    // Captura os dados digitados/marcados em um elemento de episódio na DOM
    extrairDadosEpisodioDoElemento(elEp) {
        return {
            id: elEp.dataset.epId || null,
            numero: Number(elEp.dataset.epNumero),
            assistido: elEp.querySelector('.chk-episodio-assistido')?.checked || false
        };
    }
}