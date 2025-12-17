import { calculaTempoData, converteDataUTC } from "../js/metodoData.js";
export class FinanceiroView {
  constructor(vm) {
    this.vm = vm;
  }

  listarTransacoes(elementoId) {
    const tabela = document.getElementById(elementoId) //('minhaTabela');
    const linhas = tabela.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const grupos = {};
  
    // 1. Agrupar as linhas por data
    for (let i = 0; i < linhas.length; i++) {
      const data = linhas[i].getElementsByTagName('td')[0].textContent;
      if (!grupos[data]) {
        grupos[data] = [];
      }
      grupos[data].push(linhas[i]);
    }
  
    // 2. Limpar a tabela
    const corpoTabela = tabela.getElementsByTagName('tbody')[0];
    while (corpoTabela.firstChild) {
      corpoTabela.removeChild(corpoTabela.firstChild);
    }
  
    // 3. Reconstruir a tabela com os grupos
    for (const data in grupos) {
      // Adicionar uma linha com a data como cabeçalho (opcional)
      const linhaData = document.createElement('tr');
      const celulaData = document.createElement('td');
      celulaData.setAttribute('colspan', '7'); // Ocupa duas colunas
      celulaData.style.fontWeight = 'bold';
      celulaData.classList.add('table-active')
      celulaData.textContent = data;
      linhaData.appendChild(celulaData);
      corpoTabela.appendChild(linhaData);
  
      // Adicionar as linhas do grupo
      grupos[data].forEach(linha => {
        corpoTabela.appendChild(linha);
      });
    }
  };

  async listarContas(elementoDestinoId) {
    const elementoDestino = document.getElementById(elementoDestinoId);
    const contas = await this.vm.obterContas();

  }
}
