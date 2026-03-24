import { popularSelect, limparFormulario } from "../../Utils/utils.js";
import { calculaTempoData, formatarDataBR, formatarParaISO } from "../../Utils/metodoData.js";
import { CategoriaViewModel } from "../categorias/CategoriasViewModel.js";
import { ContasViewModel } from "../contas/ContasViewModel.js";
import { graficoPizza } from "../../componentes/graficos/GraficosFactory.js";
import { abrirModalAcao } from "../../Utils/modal.js";
import Transacao from "./transacaoModel.js"

export class FinanceiroView {
  constructor(vm) {
    this.vm = vm;

    // Estado do mês exibido
    const hoje = new Date();
    this.mesAtual = hoje.getMonth();  
    this.anoAtual = hoje.getFullYear();
  }

  async abrirModalExcluirTransacao(id) {
      abrirModalAcao({
          titulo: "Excluir transação",
          conteudoHTML: `<p>Deseja realmente excluir esta transação?</p>`,
          textoConfirmar: "Excluir",
          classeBotao: "btn-danger",

          onConfirmar: async () => {
          await this.vm.excluirTransacao(id);
          await this.listarTransacoes('tbtransacoes');
          }
      });
  };

  async abrirModalCriarTransacao() {
    abrirModalAcao({
        titulo: "Adicionar transação",
        conteudoHTML: this.formHTML,
        textoConfirmar: "Salvar",

        onConfirmar: async () => {
          const form = document.getElementById("formTransacao");

          if (!form.checkValidity()) {
              form.reportValidity();
              return false;
          }

          await this.salvarFormularioTransacao(form);
          await this.listarTransacoes('tbtransacoes');
        }
        
    });

    //ativa conta destino para transferência
    const checkboxTransferencia = document.getElementById('transaferencia-adicionar');
    const divContaDestino = document.getElementById('conta-destino-div');

    checkboxTransferencia.addEventListener('change', () => {
        if (checkboxTransferencia.checked) {
            divContaDestino.classList.remove('d-none');
            divContaDestino.classList.add('d-block');
        } else {
            divContaDestino.classList.remove('d-block');
            divContaDestino.classList.add('d-none');
        }
    });

    //ativa recorrencia
    const checkboxRecorrente = document.getElementById('recorrente-adicionar');
    const divrecorrrencia = document.getElementById('recorrencia');

    checkboxRecorrente.addEventListener('change', () => {
        if (checkboxRecorrente.checked) {
            divrecorrrencia.classList.remove('d-none');
            divrecorrrencia.classList.add('d-block');
        } else {
            divrecorrrencia.classList.remove('d-block');
            divrecorrrencia.classList.add('d-none');
        }
    });

    //ativa parcelamento
    const checkboxParcelamento = document.getElementById('parcelamento-adicionar');
    const divParcelamento = document.getElementById('parcelamento');

    if (checkboxParcelamento) {
        checkboxParcelamento.addEventListener('change', () => {
            if (checkboxParcelamento.checked) {
                divParcelamento.classList.remove('d-none');
                divParcelamento.classList.add('d-block');
            } else {
                divParcelamento.classList.remove('d-block');
                divParcelamento.classList.add('d-none');
            }
        });
    }
    limparFormulario();

    await this.listarCategoria("categoria-adicionar");
    await this.listarContasSelect("conta-origem-adicionar");
    await this.listarContasSelect("conta-destino-adicionar");
  };

  async abrirModalEditarTransacao(id) {
      const transacao = await this.vm.obterTransacaoPorID(id);

      abrirModalAcao({
          titulo: "Editar transação",
          conteudoHTML: this.formHTML,
          textoConfirmar: "Salvar alterações",

          onConfirmar: async () => {
          const form = document.getElementById("formTransacao");

          if (!form.checkValidity()) {
              form.reportValidity();
              return false;
          }

          await this.salvarFormularioTransacao(form);
          await this.listarTransacoes('tbtransacoes');
          }
      });
     
      await this.listarCategoria("categoria-adicionar");
      await this.listarContasSelect("conta-origem-adicionar");
      await this.listarContasSelect("conta-destino-adicionar");

      document.getElementById('id-adicionar').value = id;
      document.getElementById('descricao-adicionar').value = transacao.Descricao;
      document.getElementById('data-adicionar').value = new Date(transacao.Data).toISOString().slice(0,16);
      document.getElementById('categoria-adicionar').value = transacao.Categoria._id;
      document.getElementById('conta-destino-adicionar').value = transacao.ContaDestino === null ? '' : transacao.ContaDestino._id;
      document.getElementById('conta-origem-adicionar').value = transacao.ContaOrigem._id;
      document.getElementById('valor-adicionar').value = transacao.Valor;
      document.getElementById('parcela-adicionar').value = transacao.ParcelaInicio;
      document.getElementById('parcelamento-adicionar').checked = transacao.Parcelamento;
      if (transacao.Tipo === 'R') {
          document.getElementById('receita-adicionar').checked = true;
      } else if (transacao.Tipo === 'D') {
          document.getElementById('despesa-adicionar').checked = true;
      } else if (transacao.Tipo === 'T') {
          document.getElementById('transaferencia-adicionar').checked = true;
      }
      document.getElementById('recorrente-adicionar').checked = transacao.Recorrente;
      document.getElementById('periodicidade-adicionar').value = transacao.Periodicidade;
  };

  async salvarFormularioTransacao(form) {
    const idInput = form.querySelector('#id-adicionar')?.value || null;
    const descricao = form.querySelector('#descricao-adicionar').value;
    const categoria = form.querySelector('#categoria-adicionar').value;
    const contaDestino = form.querySelector('#conta-destino-adicionar').value;
    const contaOrigem = form.querySelector('#conta-origem-adicionar').value;
    const data = form.querySelector('#data-adicionar').value;
    const parcelaInicio = form.querySelector('#parcela-adicionar').value;
    const parcelamento = form.querySelector('#parcelamento-adicionar').checked;
    const valor = form.querySelector('#valor-adicionar').value;
    const receita = form.querySelector('#receita-adicionar').checked;
    const despesa = form.querySelector('#despesa-adicionar').checked;
    const transaferencia = form.querySelector('#transaferencia-adicionar').checked;
    const recorrente = form.querySelector('#recorrente-adicionar').checked;
    const periodicidade = form.querySelector('#periodicidade-adicionar').value;
    let tipo = null;

    if (receita) {
        tipo = 'R';
    } else if (despesa) {
        tipo = 'D';
    } else if (transaferencia) {
        tipo = 'T';
    }

    const transacao = new Transacao(
      idInput ? idInput : null,
      descricao,
      formatarParaISO(data),
      categoria,
      contaDestino,
      contaOrigem,
      Number(valor),
      parcelaInicio ? parcelaInicio : null,
      parcelamento ? parcelamento : false,
      tipo,
      recorrente ? recorrente : false,
      periodicidade ? periodicidade : null,
    );

    await this.vm.salvarTransacao(transacao);
  };

  mesAnterior() {
    this.mesAtual--;

    if (this.mesAtual < 0) {
      this.mesAtual = 11;
      this.anoAtual--;
    }

    this.atualizarTituloMes();
    this.listarTransacoes('tbtransacoes');
  };

  mesProximo() {
    this.mesAtual++;

    if (this.mesAtual > 11) {
      this.mesAtual = 0;
      this.anoAtual++;
    }

    this.atualizarTituloMes();
    this.listarTransacoes('tbtransacoes');
  };
  
 atualizarTituloMes() {
    const titulo = document.getElementById('mesAno');

    const data = new Date(this.anoAtual, this.mesAtual, 1);

    const mesPorExtenso = data.toLocaleDateString('pt-BR', {
      month: 'long'
    });

    const mesFormatado =
      mesPorExtenso.charAt(0).toUpperCase() + mesPorExtenso.slice(1);

    titulo.textContent = `${mesFormatado} / ${this.anoAtual}`;
  };

  async listarTransacoes(elementoId) {
    const tabela = document.getElementById(elementoId);
    const corpoTabela = tabela.getElementsByTagName('tbody')[0];
    await this.vm.gerarRecorrencias(this.mesAtual, this.anoAtual);

    // Limpa tbody
    while (corpoTabela.firstChild) {
      corpoTabela.removeChild(corpoTabela.firstChild);
    }

    const transacoes = await this.vm.obterTransacoes();
    const transcoesMes = transacoes.filter(transacao => {
    const dataSomente = transacao.Data.split('T')[0]; // "2026-02-11"
    const [ano, mes, dia] = dataSomente.split('-');
    const dataTransacao = new Date(ano, mes - 1, dia); // LOCAL

    return dataTransacao.getMonth() === this.mesAtual &&
      dataTransacao.getFullYear() === this.anoAtual;
    });
           
    // Ordena por data
    const listaOrdenada = transcoesMes.sort(
      (a, b) => a.Data.localeCompare(b.Data)
    );

    // Agrupa por dia (YYYY-MM-DD)
    const grupos = {};

    listaOrdenada.forEach(transacao => {
      const dataSomente = transacao.Data.split('T')[0];
      const [ano, mes, dia] = dataSomente.split('-');
      const dataObj = new Date(ano, mes - 1, dia);

      
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

    if (listaOrdenada.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 7;
      td.textContent = 'Nenhuma transação neste mês';
      td.classList.add('text-center');
      tr.appendChild(td);
      corpoTabela.appendChild(tr);
      return;
    };
   
    // Monta a tabela
    for (const chave in grupos) {
      const grupo = grupos[chave];

      /* ========= Cabeçalho do dia ========= */
      const trCabecalho = document.createElement('tr');

      const tdCabecalho = document.createElement('td');
      tdCabecalho.colSpan = 7;
      tdCabecalho.classList.add('table-active');
      tdCabecalho.style.fontWeight = 'bold';
     
      // const dataUTC = new Date(grupo.data);
      // const dataLocal = new Date(dataUTC.getTime() + dataUTC.getTimezoneOffset() * 60000);
      
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

        if (transacao.Categoria && transacao.Categoria.descricao) {
          tdCategoria.textContent = transacao.Categoria.descricao;
        }

        // CONTA
        const tdConta = document.createElement('td');
        if (transacao.Tipo === 'T' && parseInt(transacao.Valor) < 0) {
          if (transacao.ContaOrigem && transacao.ContaOrigem.Descricao) {
            tdConta.textContent = transacao.ContaOrigem.Descricao;
          }
        } else if (transacao.Tipo === 'T' && parseInt(transacao.Valor) > 0) {
          if (transacao.ContaDestino && transacao.ContaDestino.Descricao) {
          tdConta.textContent = transacao.ContaDestino.Descricao;
          }
        } else if (transacao.Tipo === 'R' || transacao.Tipo === 'D') {
          if (transacao.ContaOrigem && transacao.ContaOrigem.Descricao) {
            tdConta.textContent = transacao.ContaOrigem.Descricao;
          }
        } else {
          tdConta.textContent = 'Conta não definida';
        }

        // VALOR
        const tdValor = document.createElement('td');
        tdValor.textContent = Number(transacao.Valor).toFixed(2);

        // EDITAR
        const tdBtnEditar = document.createElement('td');
        const btnEditar = document.createElement('button');
        btnEditar.classList.add('btn', 'btn-primary');
        btnEditar.onclick = async () => await this.abrirModalEditarTransacao(transacao.Id);             

        const iconeEditar = document.createElement('i');
        iconeEditar.classList.add('bi', 'bi-pencil-fill');

        btnEditar.appendChild(iconeEditar);
        tdBtnEditar.appendChild(btnEditar);

        // EXCLUIR
        const tdBtnExcluir = document.createElement('td');
        const btnExcluir = document.createElement('button');
        btnExcluir.classList.add('btn', 'btn-danger');
        btnExcluir.onclick = async () => await this.vm.abrirModalExcluirTransacao(transacao.Id);
        
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

  async renderTransacoesAVencer(elementoDestinoId, qtd) {
      const elementoDestino = document.getElementById(elementoDestinoId);
      const transacoes= await this.vm.filtrarTransacoesAVencer(qtd);        

      if (elementoDestino) {
        elementoDestino.innerHTML = "";

        if (transacoes.length > 0) {
          transacoes.forEach((transacao) => {
            const dataUTC = new Date(transacao.Data);
            const dataLocal = new Date(dataUTC.getTime() + dataUTC.getTimezoneOffset() * 60000);
            elementoDestino.innerHTML += `            
                        <a href="#" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${transacao.Descricao}</h5>
                            <small>${calculaTempoData(dataLocal)}</small>
                            </div>
                            <small class="badge text-bg-info">${
                              transacao.Categoria.descricao
                            }</small>
                        </a>
                    `;
          });
        } else {
            const pMensagem = document.createElement('p');
            pMensagem.classList.add('mensagem-curso');
            pMensagem.textContent = 'Não há transações pendentes no momento.';
            elementoDestino.appendChild(pMensagem);
        } 
      } 
    };

  async listarContasSelect(elementoId) {    
    const contasVM = new ContasViewModel();
    const contas =  await contasVM.obterContas();
    
    popularSelect(contas,elementoId)
  };

  async listarCategoria(elementoId) {
    const categoriaVM = new CategoriaViewModel();
    const categorias = await categoriaVM.obterCategoria('Financeiro');

    popularSelect(categorias, elementoId);
  };

  async renderGraficos() {
      const dados = await this.vm.transacoesporCategoria();

      graficoPizza(
          "graficoCategoria",
          dados,
          "Gastos por Categoria"
      );
  };
}
