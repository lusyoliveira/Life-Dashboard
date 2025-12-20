export class ContadorView {
    constructor(vm) {
        this.vm = vm;
    }

    async exibirContador(elementoId){
        const elementoDestino = document.getElementById(elementoId);
        if (!elementoDestino) return;

        elementoDestino.innerHTML = "";

        const contador = await this.vm.consultaContagem();

        const divContainer = document.createElement('div')
        divContainer.classList.add('d-flex', 'm-4', 'justify-content-around', 'align-items-center')
        
        const hTitulo = document.createElement('h4')
        hTitulo.classList.add('fst-italic')
        hTitulo.textContent = 'Copos de Águas'

        const btnDiminuir = document.createElement('button')
        btnDiminuir.classList.add('btn', 'btn-secondary')
        btnDiminuir.id = 'diminui-contagem'
        btnDiminuir.onclick = () => {
                let valorAtual = parseInt(contador, 10);

                this.vm.diminuiContador(valorAtual)     
                this.exibirContador('contador') 
        }

        const iconebtnDiminuir =  document.createElement('i')
        iconebtnDiminuir.classList.add('bi', 'bi-dash-lg')

        const inputContador = document.createElement('input')
        inputContador.classList.add('form-control', 'text-center', 'w-25')
        inputContador.id = 'contador-valor'
        inputContador.value = contador

        const btnAumentar = document.createElement('button')
        btnAumentar.classList.add('btn', 'btn-secondary')
        btnAumentar.id = 'adiciona-contagem'
        btnAumentar.onclick = () => {
                let valorAtual = parseInt(contador, 10);

                this.vm.aumentaContador(valorAtual);
                this.exibirContador('contador');
        }

        const iconebtnAumentar =  document.createElement('i')
        iconebtnAumentar.classList.add('bi', 'bi-plus-lg')

        btnAumentar.appendChild(iconebtnAumentar)
        btnDiminuir.appendChild(iconebtnDiminuir)
        divContainer.appendChild(btnDiminuir)
        divContainer.appendChild(inputContador)
        divContainer.appendChild(btnAumentar)
        elementoDestino.appendChild(hTitulo)
        elementoDestino.appendChild(divContainer)
    };
}