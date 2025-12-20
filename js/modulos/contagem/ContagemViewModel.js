import { ConfiguracaoViewModel } from '../configuracoes/ConfiguracaoViewModel.js'

export class ContagemViewModel {
    constructor() {
        this.vm = new ConfiguracaoViewModel();
        this.contagem = {};
    }

    async *contagemRegressiva() {
        const configuracoes = (await this.vm.obterConfiguracoes())[0];
        const dataAlvo = new Date(configuracoes.DataContagem).getTime();

        while (true) {
            const dataAtual = new Date().getTime();
            const tempoRestante = dataAlvo - dataAtual;

            if (tempoRestante <= 0) {
                this.contagem = { dias: 0, horas: 0, minutos: 0, segundos: 0 };
                yield this.contagem; // emite última vez (zerado)
                break;
            }

            const dias = Math.floor(tempoRestante / (1000 * 60 * 60 * 24));
            const horas = Math.floor((tempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);

            this.contagem = { dias, horas, minutos, segundos };

            yield this.contagem; // entrega valores
            await new Promise(resolve => setTimeout(resolve, 1000)); // espera 1s
        }
    }
}
