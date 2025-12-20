export class ContadorViewModel {
    constructor() {
        this.contagem = {};
    }

    consultaContagem() {
        const valorSalvo = localStorage.getItem('contagem');
        if (valorSalvo !== null) {
           return parseInt(valorSalvo, 10);
        }
        return 0
    };

    aumentaContador(valor) {    
        let valorcontador = valor || 0; 
        
        valorcontador += 1;
        valor = valorcontador;
        this.atualizarContagem(valor)
    };

    diminuiContador(valor) {
        let valorcontador = valor || 0;
        
       if (valorcontador > 0) {
            valorcontador -= 1;
            valor = valorcontador;
            this.atualizarContagem(valor)
        }
    };

    atualizarContagem(novoValor) {
        return localStorage.setItem('contagem', novoValor)
    };
}