import "./Utils/bootstrap.js";
import { ConfiguracaoViewModel } from './modulos/configuracoes/ConfiguracaoViewModel.js';
import { ConfiguracaoView } from './modulos/configuracoes/ConfiguracaoView.js';
import Configuracao from './modulos/configuracoes/configuracaoModel.js';

export async function inicializarConfiguracao() {

    const vm = new ConfiguracaoViewModel();
    const configuracaoView = new ConfiguracaoView(vm);

    // Busca as configurações salvas
    const configuracoes =
        (await vm.obterConfiguracoes())[0];

    // Cria os controles já preenchidos
    await configuracaoView.configuracaoContagem(
        'linha-contagem',
        configuracoes
    );

    await configuracaoView.configuracaoMAL(
        'linha-mal',
        configuracoes
    );

    await configuracaoView.configuracaoGoogle(
        'linha-google',
        configuracoes
    );

    await configuracaoView.configuracaoOutlook(
        'linha-outlook',
        configuracoes
    );

    await configuracaoView.configuracaoClima(
        'linha-clima',
        configuracoes
    );
    await configuracaoView.configuracaoTMDB(
        'linha-tmdb',
        configuracoes
    );


    // Botão salvar
    const btnSalvar = document.getElementById('btn-salvar');

    if (!btnSalvar) {
        console.error('Botão #btn-salvar não encontrado.');
        return;
    }

    btnSalvar.addEventListener('click', async (e) => {

        e.preventDefault();

        const ativaMAL =
            document.getElementById('habilitar-mal').checked;

        const ativaOutlook =
            document.getElementById('habilitar-outlook').checked;

        const chaveOutlook =
            document.getElementById('credencial-outlook').value;

        const ativaGoogle =
            document.getElementById('habilitar-google').checked;

        const chaveGoogle =
            document.getElementById('credencial-google').value;

        const cidade =
            document.getElementById('cidade').value;

        const latitude =
            document.getElementById('latitude').value;

        const longitude =
            document.getElementById('longitude').value;

        const ativaClima =
            document.getElementById('habilitar-clima').checked;

        const atualizaClima =
            document.getElementById('atualiza-clima').value;

        const dataContagem =
            document.getElementById('data-contagem').value;

        const descricaoContagem =
            document.getElementById('descricao-contagem').value;


        const novaConfiguracao = new Configuracao(
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
            descricaoContagem
        );


        await vm.salvarConfiguracao(novaConfiguracao);

        console.log('Configuração salva.');

    });
}

