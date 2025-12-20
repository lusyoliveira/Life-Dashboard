export class RelogioView {
    constructor(vm) {
        this.vm = vm;
    }  

    async exibirRelogio(elementoId){
        const elementoDestino = document.getElementById(elementoId);
        if (!elementoDestino) return;

        const orbitaHora = document.createElement('div')
        orbitaHora.classList.add('orbita', 'hora')

        const orbitaMinuto = document.createElement('div')
        orbitaMinuto.classList.add('orbita', 'minuto')
        
        const rotacaoMinuto = document.createElement('div')
        rotacaoMinuto.classList.add('rotacao', 'minuto')
        
        const globoMinuto = document.createElement('div')
        globoMinuto.classList.add('globo', 'minuto')
        globoMinuto.id = 'minute'

        const orbitaSegundo = document.createElement('div')
        orbitaSegundo.classList.add('orbita', 'segundo')        
        
        const rotacaoSegundo = document.createElement('div')
        rotacaoSegundo.classList.add('rotacao', 'segundo')

        const globoSegundo = document.createElement('div')
        globoSegundo.classList.add('globo', 'segundo')
        globoSegundo.id = 'second'

        const divRelogio = document.createElement('div')
        divRelogio.classList.add('relogio')
        divRelogio.id = 'relogio-digital'

        const rotacaoHora = document.createElement('div')
        rotacaoHora.classList.add('rotacao', 'hora')
        
        const globoHora = document.createElement('div')
        globoHora.classList.add('globo', 'hora')
        globoHora.id = 'hour'

        rotacaoSegundo.appendChild(globoSegundo)
        orbitaSegundo.appendChild(rotacaoSegundo)
        orbitaSegundo.appendChild(divRelogio)
        rotacaoMinuto.appendChild(globoMinuto)
        orbitaMinuto.appendChild(rotacaoMinuto)
        orbitaMinuto.appendChild(orbitaSegundo)
        orbitaHora.appendChild(orbitaMinuto)
        rotacaoHora.appendChild(globoHora)
        orbitaHora.appendChild(rotacaoHora)        
        elementoDestino.appendChild(orbitaHora)  
        
        for await (const valores of this.vm.atualizaRelogio()) {
            divRelogio.textContent = `${valores.horaFormatada}:${valores.minutoFormatado}:${valores.segundoFormatado}`;

            // const { secondsDegrees, minutesDegrees, hoursDegrees } = this.vm.calculaPonteiros(valores);

            // document.getElementById("second").style.transform = `rotate(${secondsDegrees}deg)`;
            // document.getElementById("minute").style.transform = `rotate(${minutesDegrees}deg)`;
            // document.getElementById("hour").style.transform = `rotate(${hoursDegrees}deg)`;
        }
    }
}