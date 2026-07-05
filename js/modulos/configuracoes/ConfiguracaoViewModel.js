import api from "../../servicos/metodoApi.js";
import Configuracao from "./configuracaoModel.js";

export class ConfiguracaoViewModel {
    constructor(endpoint = 'configuracoes') {
    this.endpoint = endpoint;
    this.configuracao = [];
  }

    async obterConfiguracoes() {
       const configuracaoData = await api.buscarDados(this.endpoint);
            
        this.configuracao = configuracaoData.map((configuracoes) => {
            const configuracao = new Configuracao(
                configuracoes.id,
                configuracoes.ativaMAL,
                configuracoes.ativaOutlook,
                configuracoes.chaveOutlook,
                configuracoes.ativaGoogle,
                configuracoes.chaveGoogle,
                configuracoes.cidade,
                configuracoes.latitude,
                configuracoes.longitude,
                configuracoes.ativaClima,
                configuracoes.atualizaClima,
                configuracoes.dataContagem,
                configuracoes.descricaoContagem
            );
            
            return configuracao;
        });       
            return this.configuracao        
    };

    async salvarConfiguracao(configuracao) {
        debugger
        if (configuracao.id) {
            await api.atualizarDados(configuracao, this.endpoint);
        } else {
            alert('Não foi possível atualizar as configurações!')
        }
        return this.obterConfiguracoes();
    }
}
