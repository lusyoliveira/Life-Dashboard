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
                configuracoes._id,
                configuracoes.AtivaMAL,
                configuracoes.AtivaOutlook,
                configuracoes.ChaveOutlook,
                configuracoes.AtivaGoogle,
                configuracoes.ChaveGoogle,
                configuracoes.Cidade,
                configuracoes.Latitude,
                configuracoes.Longitude,
                configuracoes.AtivaClima,
                configuracoes.AtualizaClima,
                configuracoes.DataContagem,
                configuracoes.DescricaoContagem
            );
            
            return configuracao;
        });       
            return this.configuracao        
    };

    async salvarConfiguracao(configuracao) {
        if (configuracao.id) {
            await api.atualizarDados(configuracao, this.endpoint);
        } else {
            alert('Não foi possível atualizar as configurações!')
        }
        return this.obterConfiguracoes();
    }
}
