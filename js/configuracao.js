import { ConfiguracaoViewModel } from './modulos/configuracoes/ConfiguracaoViewModel.js'
import { ConfiguracaoView } from './modulos/configuracoes/ConfiguracaoView.js'
import Configuracao from './modulos/configuracoes/configuracaoModel.js';

document.addEventListener('DOMContentLoaded', async () => {
    const vm = new ConfiguracaoViewModel();
    const configuracaoView = new ConfiguracaoView(vm);

    configuracaoView.configuracaoContagem('linha-contagem')
    configuracaoView.configuracaoGoogle('linha-google')
    configuracaoView.configuracaoMAL('linha-mal')
    configuracaoView.configuracaoOutlook('linha-outlook')
    configuracaoView.configuracaoClima('linha-clima')

    const btnSalvar = document.getElementById('btn-salvar');
    btnSalvar.addEventListener('click', async (e) =>{
        e.preventDefault();
        const ativaMAL = document.getElementById('habilitar-mal').checked;
        const ativaOutlook = document.getElementById('habilitar-outlook').checked;
        const chaveOutlook = document.getElementById('credencial-outlook').value;
        const ativaGoogle = document.getElementById('habilitar-google').checked;
        const chaveGoogle = document.getElementById('credencial-google').value;
        const cidade = document.getElementById('cidade').value;
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;
        const ativaClima = document.getElementById('habilitar-clima').checked;
        const atualizaClima = document.getElementById('atualiza-clima').value;
        const dataContagem = document.getElementById('data-contagem').value;
        const descricaoContagem = document.getElementById('descricao-contagem').value;

        console.log(ativaClima);
        
        const configuracoes = new Configuracao(
            1,
            ativaMAL,
            ativaOutlook,
            chaveOutlook,
            ativaGoogle, 
            chaveGoogle,
            cidade,
            latitude,
            longitude,
            ativaClima,
            atualizaClima,
            dataContagem,
            descricaoContagem,
        );
        await vm.salvarConfiguracao(configuracoes);
        configuracaoView.configuracaoContagem('linha-contagem')
        configuracaoView.configuracaoGoogle('linha-google')
        configuracaoView.configuracaoMAL('linha-mal')
        configuracaoView.configuracaoOutlook('linha-outlook')
        configuracaoView.configuracaoClima('linha-clima')
        e.target.reset();
    })
});