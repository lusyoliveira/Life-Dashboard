export class FinanceiroView {
  constructor(vm) {
    this.vm = vm;
  }

  async editarTransacao(Id) {
    const transacao = await this.vm.obterTransacaoPorID(Id)

    if (transacao) {
        document.getElementById('id-adicionar').value = Id;
        document.getElementById('descricao-adicionar').value = transacao.Descricao;
        document.getElementById('data-adicionar').value = new Date(transacao.Data).toISOString().slice(0,16);
        document.getElementById('categoria-adicionar').value = transacao.Categoria;
        document.getElementById('conta-adicionar').value = transacao.Conta;
        document.getElementById('valor-adicionar').value = transacao.Valor;
        document.getElementById('parcela-inicio').value = transacao.ParcelaInicio;
        document.getElementById('parcela-fim').value = transacao.ParcelaFim;
        document.getElementById('parcelamento-adicionar').value = transacao.Parcelamento;
    } else {
        alert('Transação não encontrado!');
    }
  };

  async listarTransacoes(elementoId) {
    const tabela = document.getElementById(elementoId);
    const corpoTabela = tabela.getElementsByTagName('tbody')[0];

    // Limpa tbody
    while (corpoTabela.firstChild) {
      corpoTabela.removeChild(corpoTabela.firstChild);
    }

    const transacoes = await this.vm.obterTransacoes();

    // Ordena por data
    const listaOrdenada = transacoes.sort(
      (a, b) => new Date(a.Data) - new Date(b.Data)
    );

    // Agrupa por dia (YYYY-MM-DD)
    const grupos = {};

    listaOrdenada.forEach(transacao => {
      const dataObj = new Date(transacao.Data);

      const dataChave = [
        dataObj.getFullYear(),
        String(dataObj.getMonth() + 1).padStart(2, '0'),
        String(dataObj.getDate()).padStart(2, '0')
      ].join('-');

      if (!grupos[dataChave]) {
        grupos[dataChave] = {
          data: dataChave,
          total: 0,
          itens: []
        };
      }

      grupos[dataChave].total += Number(transacao.Valor);
      grupos[dataChave].itens.push(transacao);
    });

    // Monta a tabela
    for (const chave in grupos) {
      const grupo = grupos[chave];

      /* ========= Cabeçalho do dia ========= */
      const trCabecalho = document.createElement('tr');

      const tdCabecalho = document.createElement('td');
      tdCabecalho.colSpan = 7;
      tdCabecalho.classList.add('table-active');
      tdCabecalho.style.fontWeight = 'bold';

      const [ano, mes, dia] = grupo.data.split('-');
      const dataFormatada = `${dia}/${mes}/${ano}`;


      tdCabecalho.textContent = `${dataFormatada} — Total do dia: R$ ${grupo.total.toFixed(2)}`;

      trCabecalho.appendChild(tdCabecalho);
      corpoTabela.appendChild(trCabecalho);
      
      /* ========= Transações do dia ========= */
      grupo.itens.forEach(transacao => {
        const tr = document.createElement('tr');

        // Coluna DATA (vazia para alinhar)
        const tdDataVazia = document.createElement('td');
        tdDataVazia.textContent = '';

        // DESCRIÇÃO
        const tdDescricao = document.createElement('td');
        tdDescricao.textContent = transacao.Descricao;

        // CATEGORIA
        const tdCategoria = document.createElement('td');
        tdCategoria.textContent = transacao.Categoria;

        // CONTA
        const tdConta = document.createElement('td');
        tdConta.textContent = transacao.Conta;

        // VALOR
        const tdValor = document.createElement('td');
        tdValor.textContent = Number(transacao.Valor).toFixed(2);

        // EDITAR
        const tdBtnEditar = document.createElement('td');
        const btnEditar = document.createElement('button');
        btnEditar.classList.add('btn', 'btn-primary');
        btnEditar.onclick = () => this.editarTransacao(transacao.Id);             

        const iconeEditar = document.createElement('i');
        iconeEditar.classList.add('bi', 'bi-pencil-fill');

        btnEditar.appendChild(iconeEditar);
        tdBtnEditar.appendChild(btnEditar);

        // EXCLUIR
        const tdBtnExcluir = document.createElement('td');
        const btnExcluir = document.createElement('button');
        btnExcluir.classList.add('btn', 'btn-danger');
        btnExcluir.onclick = async () => {
          try {
            await this.vm.excluirTransacoes(transacao.id);
          } catch (error) {
            alert("Erro ao excluir transação!");
          }
        };
        
        const iconeExcluir = document.createElement('i');
        iconeExcluir.classList.add('bi', 'bi-trash');

        btnExcluir.appendChild(iconeExcluir);
        tdBtnExcluir.appendChild(btnExcluir);

        // Montagem final da linha
        tr.appendChild(tdDataVazia);
        tr.appendChild(tdDescricao);
        tr.appendChild(tdCategoria);
        tr.appendChild(tdConta);
        tr.appendChild(tdValor);
        tr.appendChild(tdBtnEditar);
        tr.appendChild(tdBtnExcluir);

        corpoTabela.appendChild(tr);
      });
    }    
  };

  async listarContas(elementoDestinoId) {
    const elementoDestino = document.getElementById(elementoDestinoId);
    const contas = await this.vm.obterContas();

    contas.forEach((conta) => {
      const option = document.createElement('option');
      option.value = conta.id;
      option.textContent = conta.nome;

      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      li.textContent = conta.Descricao;

      const span = document.createElement('span');
      span.classList.add('badge', 'bg-primary', 'rounded-pill');
      span.textContent = `R$ ${conta.Saldo}`;

      li.appendChild(span);
      elementoDestino.appendChild(li);
    });
  }
}
