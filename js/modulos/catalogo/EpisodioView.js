import utils from "../../Utils/utils.js"

export class EpisodioView {
        constructor(vm) {
        this.vm = vm;
        console.log(this.vm)
    }   

    // Gera o HTML de um episódio
    renderizarItemEpisodio(episodio) {
        const epNum = episodio.numero_episodio ?? 'N/A';
        const epNome = episodio.titulo_episodio ?? 'Sem título';
        const epIdTMDB = episodio.id_tmdb_episodio ?? episodio.idTMDB ?? '';
        const epId = episodio.id;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-group-item list-group-item-action gap-3 py-3 item-episodio';
        itemDiv.setAttribute('data-episodio', epNum);
        itemDiv.setAttribute('data-epidtmdb', epIdTMDB);
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
            console.log(epId)
            await this.vm.atualizarEpisodioAssistido(epId, checkbox.checked);
        });

        const titulo = document.createElement('h6');
        titulo.className = 'mb-0 titulo-episodio';
        titulo.textContent = epNome;

        const smallDuracao = document.createElement('small');
        smallDuracao.className = 'opacity-50 text-nowrap exibicao-episodio';
        smallDuracao.textContent = episodio.duracao_episodio || episodio.duracao || 'N/A';

        const containerDuracao = document.createElement('small');
        containerDuracao.textContent = 'Duração: '
        
        const containerExibicao = document.createElement('small');
        containerExibicao.textContent = 'Estréia: '

        const smallExibicao = document.createElement('small');
        smallExibicao.className = 'opacity-50 text-nowrap exibicao-episodio';
        smallExibicao.textContent = utils.formatarDataBR(episodio.exibicao_episodios || episodio.estreia) || 'N/A'

        const containerVotos = document.createElement('span');
        containerVotos.textContent = 'Nota TMDB: '

        const spanVotos = document.createElement('span');
        spanVotos.className = 'badge text-bg-warning votos-episodio';
        spanVotos.textContent = episodio.media_votos_episodio || episodio.votos || 'N/A'

        const containerSinopse = document.createElement('div');

        const pSinopse = document.createElement('p');
        pSinopse.className = 'mb-0 opacity-75 sinopse-episodio';
        pSinopse.textContent = episodio.sinopse_episodio || episodio.sinopse;

        containerSinopse.appendChild(pSinopse);
        containerVotos.appendChild(spanVotos);
        containerExibicao.appendChild(smallExibicao);
        containerDuracao.appendChild(smallDuracao);
        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(titulo);
        flexDiv.appendChild(leftDiv);
        flexDiv.appendChild(containerDuracao);
        flexDiv.appendChild(containerExibicao);
        flexDiv.appendChild(containerVotos);
        itemDiv.appendChild(flexDiv);
        itemDiv.appendChild(containerSinopse);

        return itemDiv;
    }
}
