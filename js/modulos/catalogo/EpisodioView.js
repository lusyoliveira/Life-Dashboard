import utils from "../../Utils/utils.js"

export class EpisodioView {
        constructor(vm) {
        this.vm = vm;
    }   

    // Gera o HTML de um episódio
    renderizarItemEpisodio(episodio) {
        const epNum = episodio.numero_episodio ?? 'N/A';
        const epNome = episodio.titulo_episodio ?? 'Sem título';
        const epId = episodio.id_tmdb_episodio ?? episodio.idTMDB ?? '';

        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-group-item list-group-item-action gap-3 py-3 item-episodio';
        itemDiv.setAttribute('data-episodio', epNum);
        itemDiv.setAttribute('data-epidtmdb', epId);
        itemDiv.setAttribute('data-epnumero', epNum);

        const flexDiv = document.createElement('div');
        flexDiv.className = 'd-flex gap-2 justify-content-between';

        const leftDiv = document.createElement('div');
        leftDiv.className = 'd-flex gap-2';

        const checkbox = document.createElement('input');
        checkbox.className = 'form-check-input chk-episodio-assistido';
        checkbox.type = 'checkbox';
        checkbox.checked = Boolean(episodio.assistido);

        // Evento 'change' para atualizar o banco via ViewModel
        checkbox.addEventListener('change', async () => {
            await this.vm.atualizarEpisodioAssistido(epId, checkbox.checked);
        });

        const titulo = document.createElement('h6');
        titulo.className = 'mb-0 titulo-episodio';
        titulo.textContent = epNome;

        const smallDuracao = document.createElement('small');
        smallDuracao.innerHTML = `Duração: <small class="opacity-50 text-nowrap duracao-episodio">${episodio.duracao_episodio ?? episodio.duracao ?? 'N/A'} min</small>`;

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(titulo);
        leftDiv.appendChild(smallDuracao);

        // Monte o restante dos elementos (Exibição, Votos, Sinopse) de forma similar...
        
        flexDiv.appendChild(leftDiv);
        itemDiv.appendChild(flexDiv);

        return itemDiv;
    }
}