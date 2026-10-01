// TemporadaView.js
import { EpisodioView } from './EpisodioView.js';
import { TemporadaViewModel } from './TemporadasViewModel.js'

export default class TemporadaView {
    constructor(temporadaViewModel = new TemporadaViewModel(), episodioView = new EpisodioView()) {
        this.temporadaVM = temporadaViewModel;
        this.episodioView = episodioView;
    }
    renderizarAbaTemporadas(temporadas) {
        // Certifique-se de que este é o ID/Classe correto do container dentro da aba "Episódios"
        const containerAlvo = document.getElementById("accordionTemporadas")
    
        if (!containerAlvo) {
            console.error("Container da aba de episódios não foi encontrado no DOM!");
            return;
        }

        containerAlvo.innerHTML = '';
        if (!temporadas || temporadas.length === 0) {
            containerAlvo.innerHTML = '<p class="text-muted text-center my-3">Nenhuma temporada encontrada.</p>';
            return;
        }

        //Monta o HTML de cada temporada
        temporadas.forEach((temp, index) => {
            const episodios = temp.listaEpisodios || [];
            const accordionId = `collapse-temporada-${temp.numero_temporada ?? index}`;

            // Renderiza os episódios da temporada
           const htmlEpisodios = episodios.length > 0 
                ? episodios.map(ep => this.episodioView.renderizarItemEpisodio(ep)).join('')
                : '<div class="p-2 text-muted small">Nenhum episódio disponível.</div>';

            const acordionItem = document.createElement('div');
            acordionItem.className = 'accordion-item';
            acordionItem.innerHTML = `
                <h2 class="accordion-header d-flex gap-2 justify-content-between" id="heading-${accordionId}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${accordionId}" aria-expanded="false" aria-controls="flush-collapseOne">
                        ${temp.titulo_temporada || `Temporada ${temp.numero_temporada}`} (${episodios.length} episódios)
                        <small class="text-muted">Estreia: ${temp.exibicao_temporada}</small>
                        <span class="badge text-bg-warning">Nota TMDB: ${temp.media_votos_temporada}</span>
                    </button>
                </h2>
                <div id="collapse-${accordionId}" class="accordion-collapse collapse" data-bs-parent="#accordionTemporadas">
                    <div class="accordion-body">
                        <div class="list-group">
                            ${htmlEpisodios}
                        </div>
                    </div>
                </div>
            `;

            containerAlvo.appendChild(acordionItem);

       });
    };

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