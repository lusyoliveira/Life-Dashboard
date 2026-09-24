// TemporadaView.js
import { EpisodioView } from './EpisodioView.js';
import { TemporadaViewModel } from './TemporadasViewModel.js'

export default class TemporadaView {
    constructor(temporadaViewModel = new TemporadaViewModel(), episodioView = new EpisodioView()) {
        this.temporadaVM = temporadaViewModel;
        this.episodioView = episodioView;
    }

    // Método principal de renderização da aba
    renderizarAbaTemporadas(temporadas, containerElement) {
        if (!containerElement) return;

        containerElement.innerHTML = "";

        if (!temporadas || temporadas.length === 0) {
            containerElement.innerHTML = `<p class="text-muted p-3">Nenhuma temporada/episódio encontrado.</p>`;
            return;
        }

        const accordion = document.createElement("div");
        accordion.className = "accordion";
        accordion.id = "accordionTemporadas";

        temporadas.forEach((temp, index) => {
            const tempNum = temp.numero || temp.season_number || (index + 1);
            const tempNome = temp.nome || temp.name || `Temporada ${tempNum}`;
            const listaEps = temp.episodios || temp.episodes || [];

            const itemAcc = document.createElement("div");
            itemAcc.className = "accordion-item item-temporada";
            itemAcc.dataset.temporadaId = temp.id || '';
            itemAcc.dataset.temporadaNumero = tempNum;

            const idCollapse = `collapseTemp${index}`;
            const idHeader = `headingTemp${index}`;

            // Renderiza os episódios usando a EpisodioView
            let listaEpisodiosHTML = "";
            if (listaEps.length > 0) {
                listaEpisodiosHTML = listaEps
                    .map(ep => this.episodioView.renderizarItemEpisodio(ep))
                    .join('');
            } else {
                const totalEps = temp.totalEpisodios || temp.episode_count || 0;
                listaEpisodiosHTML = `<p class="small text-muted mb-0">Total de episódios informados: ${totalEps}</p>`;
            }

            itemAcc.innerHTML = `
                <h2 class="accordion-header" id="${idHeader}">
                    <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#${idCollapse}">
                        ${tempNome} (${listaEps.length || temp.totalEpisodios || 0} Episódios)
                    </button>
                </h2>
                <div id="${idCollapse}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#accordionTemporadas">
                    <div class="accordion-body">
                        ${listaEpisodiosHTML}
                    </div>
                </div>
            `;

            accordion.appendChild(itemAcc);
        });

        containerElement.appendChild(accordion);
    }

    // Extrai todas as temporadas e episódios editados na View para enviar no Salvamento
    extrairTemporadasDoFormulario(formElement) {
        const temporadasDetalhes = [];
        const elementosTemporadas = formElement.querySelectorAll('.item-temporada');

        elementosTemporadas.forEach(elTemp => {
            const idTemp = elTemp.dataset.temporadaId;
            const numeroTemp = elTemp.dataset.temporadaNumero;
            const epsElements = elTemp.querySelectorAll('.item-episodio');
            
            const listaEpisodios = [];
            epsElements.forEach(elEp => {
                listaEpisodios.push(this.episodioView.extrairDadosEpisodioDoElemento(elEp));
            });

            temporadasDetalhes.push({
                id: idTemp || null,
                numero: Number(numeroTemp),
                episodios: listaEpisodios
            });
        });

        return temporadasDetalhes;
    }
}