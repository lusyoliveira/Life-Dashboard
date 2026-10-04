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
            acordionItem.className = 'accordion-item item-temporada';

            const h2Item = document.createElement('h2');
            h2Item.className = 'accordion-header d-flex gap-2 justify-content-between';
            h2Item.id = `heading-${accordionId}`;

            const buttonAcordionItem = document.createElement('button');
            buttonAcordionItem.className = 'accordion-button collapsed d-flex gap-2 justify-content-between';
            buttonAcordionItem.type = 'button';
            buttonAcordionItem.setAttribute('data-bs-toggle', 'collapse');
            buttonAcordionItem.setAttribute('data-bs-target', `#collapse-${accordionId}`);
            buttonAcordionItem.setAttribute('aria-expanded', 'false');  

            const tituloTemporada = temp.titulo_temporada || `Temporada ${temp.numero_temporada}`;
            buttonAcordionItem.innerHTML = `
                ${tituloTemporada} (${episodios.length} episódios)
                <small class="text-muted">Estreia: ${temp.exibicao_temporada}</small>
                <span class="badge text-bg-warning">Nota TMDB: ${temp.media_votos_temporada}</span>
            `;

            const btnMarcarDesmarcar = document.createElement('button');
            btnMarcarDesmarcar.type = 'button';
            btnMarcarDesmarcar.className = 'btn btn-sm btn-marcar-desmarcar-episodios ms-2';
            btnMarcarDesmarcar.title = 'Marcar/Desmarcar Todos os Episódios';
            btnMarcarDesmarcar.innerHTML = '<i class="bi bi-check2-square"></i>';   
            btnMarcarDesmarcar.onclick = async () => {
                this.marcarDesmarcarTodosEpisodios(containerAlvo);
            };

            const btnRemoverTemporada = document.createElement('button');
            btnRemoverTemporada.type = 'button';
            btnRemoverTemporada.className = 'btn btn-sm btn-remover-temporada ms-2';
            btnRemoverTemporada.title = 'Remover Temporada';
            btnRemoverTemporada.innerHTML = '<i class="bi bi-trash"></i>';
            btnRemoverTemporada.onclick = async () => {
                this.removerTemporada(containerAlvo);
            };

            const divCollapse = document.createElement('div');
            divCollapse.id = `collapse-${accordionId}`;
            divCollapse.className = 'accordion-collapse collapse';
            divCollapse.setAttribute('data-bs-parent', '#accordionTemporadas'); 

            const divBody = document.createElement('div');
            divBody.className = 'accordion-body';
            
            const divListGroup = document.createElement('div');
            divListGroup.className = 'list-group';
            divListGroup.innerHTML = htmlEpisodios; 

            h2Item.appendChild(buttonAcordionItem);
            h2Item.appendChild(btnMarcarDesmarcar);
            h2Item.appendChild(btnRemoverTemporada);    
            acordionItem.appendChild(h2Item);

            divBody.appendChild(divListGroup);
            divCollapse.appendChild(divBody);
            acordionItem.appendChild(divCollapse);
            containerAlvo.appendChild(acordionItem);
       });

       //this.removerTemporada(containerAlvo);
      // this.marcarDesmarcarTodosEpisodios(containerAlvo);
    };

    marcarDesmarcarTodosEpisodios(container) {
        container.onclick = (e) => {
            const btnMarcarDesmarcar = e.target.closest(".btn-marcar-desmarcar-episodios");
            if (btnMarcarDesmarcar) {
                e.stopPropagation();
                e.preventDefault();
                const itemTemporada = btnMarcarDesmarcar.closest(".item-temporada, .accordion-item");
                if (itemTemporada) {
                    const checkboxes = itemTemporada.querySelectorAll('input[type="checkbox"]');
                    const todosMarcados = Array.from(checkboxes).every(cb => cb.checked);
                    checkboxes.forEach(cb => cb.checked = !todosMarcados);
                }
            }
        };
    };
    
    removerTemporada(container) {
        // Remove ouvintes antigos se necessário, ou usa delegação diretamente
        container.onclick = (e) => {
            const btnRemover = e.target.closest(".btn-remover-temporada");
            if (btnRemover) {
                // Impede que o clique no botão abra/feche o accordion
                e.stopPropagation(); 
                e.preventDefault();

                // Busca o item pai da temporada (accordion-item) e o remove do DOM
                const itemTemporada = btnRemover.closest(".item-temporada, .accordion-item");
                if (itemTemporada) {
                    itemTemporada.remove();
                }
            }
        };
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