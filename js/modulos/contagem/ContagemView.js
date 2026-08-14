export class ContagemView {
    constructor(vm) {
        this.vm = vm;
    }

    async exibirContagem(elementoId) {
        const elementoDestino = document.getElementById(elementoId);
        if (!elementoDestino) return;

        //Pega as configurações para usar no título
        const configuracoes = (await this.vm.vm.obterConfiguracoes())[0];
        const tituloConfig = configuracoes.descricaoContagem ?? "Contagem regressiva";

        const hTitulo = document.createElement('h5');
        hTitulo.classList.add('fst-italic');
        hTitulo.id = 'descricao-contagem';
        hTitulo.textContent = tituloConfig; 

        const divContainer = document.createElement('div');
        divContainer.classList.add('d-flex', 'justify-content-around', 'align-items-center');

        // Criar elementos fixos (dias, horas, minutos, segundos)
        const criarBloco = (id) => {
            const div = document.createElement('div');
            div.classList.add('d-flex', 'flex-column');

            const span = document.createElement('span');
            span.classList.add('fs-7');
            span.id = `span-${id}`;

            const p = document.createElement('p');
            p.classList.add('fs-5');
            p.id = id;
            p.textContent = id.charAt(0).toUpperCase();

            div.appendChild(span);
            div.appendChild(p);
            return div;
        };

        const blocoDias = criarBloco('dias');
        const blocoHoras = criarBloco('horas');
        const blocoMinutos = criarBloco('minutos');
        const blocoSegundos = criarBloco('segundos');

        divContainer.appendChild(blocoDias);
        divContainer.appendChild(blocoHoras);
        divContainer.appendChild(blocoMinutos);
        divContainer.appendChild(blocoSegundos);

        elementoDestino.appendChild(hTitulo);
        elementoDestino.appendChild(divContainer);

        // Consumir os valores emitidos pelo generator da VM
        for await (const valores of this.vm.contagemRegressiva()) {

            // A página foi trocada
            if (!elementoDestino.isConnected) {
                return;
            }

            const dias = document.getElementById("span-dias");
            const horas = document.getElementById("span-horas");
            const minutos = document.getElementById("span-minutos");
            const segundos = document.getElementById("span-segundos");

            // Os elementos foram removidos
            if (!dias || !horas || !minutos || !segundos) {
                return;
            }

            dias.textContent = valores.dias;
            horas.textContent = valores.horas;
            minutos.textContent = valores.minutos;
            segundos.textContent = valores.segundos;
        }
    }
}
