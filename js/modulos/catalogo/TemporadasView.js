import utils from "../../Utils/utils.js"
import { EpisodioView } from './EpisodioView.js';
import { TemporadaViewModel } from './TemporadasViewModel.js'

export default class TemporadaView {
    constructor(temporadaViewModel = new TemporadaViewModel(), episodioView = null) {
        this.temporadaVM = temporadaViewModel;
        this.episodioView = episodioView || new EpisodioView(this.temporadaVM.episodioVM);
    }
    
    renderizarAbaTemporadas(temporadas) {
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

            const acordionItem = document.createElement('div');
            acordionItem.className = 'accordion-item item-temporada';
            acordionItem.setAttribute('data-temporada', temp.numero_temporada ?? index);
            acordionItem.setAttribute('data-temporadaidtmdb', temp.id_tmdb_temporada ?? '');

            const h2Item = document.createElement('h2');
            h2Item.className = 'accordion-header d-flex gap-2 justify-content-between';
            h2Item.id = `heading-${accordionId}`;

            const buttonAcordionItem = document.createElement('button');
            buttonAcordionItem.className = 'accordion-button collapsed d-flex gap-2 justify-content-between';
            buttonAcordionItem.type = 'button';
            buttonAcordionItem.setAttribute('data-bs-toggle', 'collapse');
            buttonAcordionItem.setAttribute('data-bs-target', `#collapse-${accordionId}`);
            buttonAcordionItem.setAttribute('aria-expanded', 'false');  

            const h5Titulo = document.createElement('h5');
            h5Titulo.className = 'mb-0 titulo-temporada';
            h5Titulo.textContent = temp.titulo_temporada || `Temporada ${temp.numero_temporada}`;

            const smallEstreia = document.createElement('small');
            smallEstreia.className = 'text-muted ms-2 estreia-temporada';
            smallEstreia.textContent = `Estreia: ${utils.formatarDataBR(temp.exibicao_temporada || temp.estreia) || 'N/A'}`;

            const spanNota = document.createElement('span');
            spanNota.className = 'badge text-bg-warning ms-2 nota-temporada';
            spanNota.textContent = `Nota TMDB: ${temp.media_votos_temporada || temp.votos || 'N/A'}`;

            const btnMarcarDesmarcar = document.createElement('button');
            btnMarcarDesmarcar.type = 'button';
            btnMarcarDesmarcar.className = 'btn btn-sm btn-marcar-desmarcar-episodios ms-2';
            btnMarcarDesmarcar.title = 'Marcar/Desmarcar Todos os Episódios';
            btnMarcarDesmarcar.innerHTML = '<i class="bi bi-check2-square"></i>';   
            btnMarcarDesmarcar.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                const itemTemporada = btnMarcarDesmarcar.closest(".item-temporada, .accordion-item");
                if (itemTemporada) {
                    const checkboxes = itemTemporada.querySelectorAll('input[type="checkbox"]');
                    const todosMarcados = Array.from(checkboxes).every(cb => cb.checked);
                    checkboxes.forEach(cb => cb.checked = !todosMarcados);
                }
            };

            const btnRemoverTemporada = document.createElement('button');
            btnRemoverTemporada.type = 'button';
            btnRemoverTemporada.className = 'btn btn-sm btn-remover-temporada ms-2';
            btnRemoverTemporada.title = 'Remover Temporada';
            btnRemoverTemporada.innerHTML = '<i class="bi bi-trash"></i>';
            btnRemoverTemporada.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                const itemTemporada = btnRemoverTemporada.closest(".item-temporada, .accordion-item");
                if (itemTemporada) {
                    itemTemporada.remove();
                }
            };

            const divCollapse = document.createElement('div');
            divCollapse.id = `collapse-${accordionId}`;
            divCollapse.className = 'accordion-collapse collapse';
            divCollapse.setAttribute('data-bs-parent', '#accordionTemporadas'); 

            const divBody = document.createElement('div');
            divBody.className = 'accordion-body';
            
            const divBodyPoster = document.createElement('div');
            divBodyPoster.className = 'd-flex gap-3 mb-3 align-items-start';

            const imgCapa = document.createElement('img');
            imgCapa.src = utils.renderMiniatura(temp.poster_temporada || temp.poster);
            imgCapa.alt = `Poster da Temporada ${temp.numero_temporada}`;
            imgCapa.className = 'img-fluid poster-temporada';
            imgCapa.height = 120;
            imgCapa.width = 80;
    
            const divSinopse = document.createElement('div');
            divSinopse.className = 'sinopse-temporada';
            divSinopse.textContent = temp.sinopse_temporada || temp.sinopse || 'Sinopse indisponível.';

            const divListGroup = document.createElement('div');
            divListGroup.className = 'list-group';

            if (episodios.length === 0) {
                divListGroup.innerHTML = '<div class="p-2 text-muted small">Nenhum episódio disponível.</div>';
            } else {
                // Para cada episódio, pede para a EpisodioView criar o elemento pronto e joga na lista
                episodios.forEach(ep => {
                    const elementoEpisodio = this.episodioView.renderizarItemEpisodio(ep);
                    divListGroup.appendChild(elementoEpisodio);
                });
            }
''
            buttonAcordionItem.appendChild(h5Titulo);
            buttonAcordionItem.appendChild(smallEstreia);
            buttonAcordionItem.appendChild(spanNota);
            buttonAcordionItem.appendChild(divSinopse);
            h2Item.appendChild(buttonAcordionItem);
            h2Item.appendChild(btnMarcarDesmarcar);
            h2Item.appendChild(btnRemoverTemporada);    
            acordionItem.appendChild(h2Item);
            divBodyPoster.appendChild(imgCapa);
            divBodyPoster.appendChild(divSinopse);
            divBody.appendChild(divBodyPoster);
            divBody.appendChild(divListGroup);
            divCollapse.appendChild(divBody);
            acordionItem.appendChild(divCollapse);
            containerAlvo.appendChild(acordionItem);
       });

    };
}