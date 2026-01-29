import { calculaTempoData, formatarDataBR, formatarParaISO } from "../../Utils/metodoData.js";
import { popularSelect, limparFormulario } from "../../Utils/utils.js";
import { CategoriaViewModel } from "../categorias/CategoriasViewModel.js";
import { StatusViewModel } from "../status/StatusViewModel.js";
import { TipoViewModel } from "../tipos/TipoViewModel.js";
import { graficoPizza } from "../../componentes/graficos/GraficosFactory.js";
import { criarDataTable } from "../../componentes/tabelas/DataTable.js";
import { colunaAcoes } from "../../componentes/tabelas/colunasAcoes.js";
import { abrirModalAcao } from "../../Utils/modal.js";
import Agenda from "./agendaModel.js";

export class AgendaView {
  constructor(vm) {
    this.vm = vm;
    this.registrarEventosTabela();
  }

  async registrarEventosTabela() {
    const tabela = document.getElementById("tabelaAgenda");
    if (!tabela) return;

    tabela.addEventListener("click", async (e) => {
        const btnEditar = e.target.closest(".btn-editar");
        const btnExcluir = e.target.closest(".btn-excluir");

        if (btnEditar) {
        await this.abrirModalEditarAgenda(btnEditar.dataset.id);
        }

        if (btnExcluir) {
        await this.abrirModalExcluirAgenda(btnExcluir.dataset.id);
        }
    });
  };

  async abrirModalExcluirAgenda(id) {
      abrirModalAcao({
          titulo: "Excluir agendamento",
          conteudoHTML: `<p>Deseja realmente excluir este agedamento?</p>`,
          textoConfirmar: "Excluir",
          classeBotao: "btn-danger",

          onConfirmar: async () => {
          await this.vm.excluirAgenda(id);
          await this.listarAgenda();
          }
      });
  };

  async abrirModalCriarAgenda() {
      abrirModalAcao({
          titulo: "Adicionar agendamento",
          conteudoHTML: this.formHTML,
          textoConfirmar: "Salvar",

          onConfirmar: async () => {
          const form = document.getElementById("formAgenda");

          if (!form.checkValidity()) {
              form.reportValidity();
              return false;
          }

          await this.salvarFormularioAgenda(form);
          await this.listarAgenda();
          }
      });

      limparFormulario();

      await this.listarTipos('tipo-adicionar');
      await this.listarCategoria('categoria-adicionar');
      await this.listarStatus('status-adicionar');

  };

  async abrirModalEditarAgenda(id) {
    const agenda = await this.vm.obterAgendaPorID(id);

    abrirModalAcao({
        titulo: "Editar agendamento",
        conteudoHTML: this.formHTML,
        textoConfirmar: "Salvar alterações",

        onConfirmar: async () => {
        const form = document.getElementById("formAgenda");

        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        await this.salvarFormularioAgenda(form);
        await this.listarAgenda();
        }
    });    

    await this.listarTipos('tipo-adicionar');
    await this.listarCategoria('categoria-adicionar');
    await this.listarStatus('status-adicionar');

    document.getElementById('id-adicionar').value = agenda.id;
    document.getElementById('titulo-adicionar').value = agenda.Titulo;
    document.getElementById('data-adicionar').value = new Date(agenda.Data).toISOString().slice(0,16);
    document.getElementById('categoria-adicionar').value = agenda.Categoria._id;
    document.getElementById('tipo-adicionar').value = agenda.Tipo._id;
    document.getElementById('status-adicionar').value = agenda.Status._id; 
  };

  async salvarFormularioAgenda(form) {
      const idInput = form.querySelector('#id-adicionar')?.value || null;
      const titulo = form.querySelector('#titulo-adicionar').value;
      const data = form.querySelector('#data-adicionar').value;
      const categoria = form.querySelector('#categoria-adicionar').value;
      const tipo = form.querySelector('#tipo-adicionar').value;
      const status = form.querySelector('#status-adicionar').value;

      const agendamento = new Agenda( 
        idInput ? idInput : null,
        titulo,
        status,
        categoria,
        tipo,
        formatarParaISO(data)
      );
      await this.vm.salvarAgenda(agendamento);
  };
  async listarAgenda() {
      const dados = await this.vm.obterAgenda();

      criarDataTable({
      tabelaId: "tabelaAgenda",
      dados,
      colunas: [
          { title: "Título", data: "Titulo" },
          { title: "Status", data: "Status.descricao" },
          { title: "Categoria", data: "Categoria.descricao" },
          { title: "Tipo", data: "Tipo.descricao" },
          {
              title: "Data",
              data: "Data",
              render: (data) => formatarDataBR(data)
          },
          colunaAcoes({ campoId: "id" })

          ]
      });
  };

  async renderProximosCompromissos(elementoDestinoId, qtd) {
    const elementoDestino = document.getElementById(elementoDestinoId);
    const agendaFiltrada = this.vm.filtrarProximosCompromissos(qtd);

    if (elementoDestino) {
      elementoDestino.innerHTML = "";
      agendaFiltrada.forEach((compromisso) => {
   
        const dataUTC = new Date(compromisso.Data);
        const dataLocal = new Date(dataUTC.getTime() + dataUTC.getTimezoneOffset() * 60000);
        elementoDestino.innerHTML += `            
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${compromisso.Titulo}</h5>
                        <small>${calculaTempoData(dataLocal)}</small>
                        </div>
                        <small class="badge text-bg-info">${
                          compromisso.Categoria.descricao
                        }</small>
                    </a>
                `;
      });
    }
  };

  async preencherCalendario(mes, ano, elementoId) {
    const calendarioContainer = document.getElementById(elementoId);
    const agendaConvertida = await this.vm.obterAgenda();
    const divAntigo = document.getElementById("calendario-dias");
    if (divAntigo) {
      divAntigo.remove();
    }
   
    // Cria os dias do mês
    const primeiroDia = new Date(ano, mes).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    const divDiasContainer = document.createElement("div");
    divDiasContainer.classList.add("calendario-dias");
    divDiasContainer.id = "calendario-dias";

    for (let i = 0; i < primeiroDia; i++) {
      const divHojeVazio = document.createElement("div");
      divHojeVazio.classList.add("calendario-hoje");
      divDiasContainer.appendChild(divHojeVazio);
    }
    calendarioContainer.appendChild(divDiasContainer);

    // Preenche os dias do mês
    for (let i = 1; i <= totalDias; i++) {
      const isToday =
        i === new Date().getDate() &&
        mes === new Date().getMonth() &&
        ano === new Date().getFullYear();

      const agendaFiltrada = agendaConvertida.filter((compromisso) => {
        const dataUTC = new Date(compromisso.Data);
        // converte UTC para horário local
        const dataLocal = new Date(dataUTC.getTime() + dataUTC.getTimezoneOffset() * 60000);

        const diaComp = dataLocal.getDate();
        const mesComp = dataLocal.getMonth() + 1;
        const anoComp = dataLocal.getFullYear();

        return (
          diaComp === i &&
          mesComp === mes + 1 &&
          anoComp === ano
        );
      });

      if (agendaFiltrada.length > 0) {
        const divHojeContainer = document.createElement("div");
        divHojeContainer.classList.add("calendario-hoje");

        const divDataCompromisso = document.createElement("div");
        divDataCompromisso.classList.add("calendario-data-compromisso");
        divDataCompromisso.textContent = i;

        const divCompromisso = document.createElement("div");
        divCompromisso.classList.add("compromissos-dia");

        agendaFiltrada.forEach((compromisso) => {
          const divTitulo = document.createElement("div");
          divTitulo.classList.add("titulo-compromisso");
          divTitulo.textContent = compromisso.Titulo;

          const spanCategoria = document.createElement("span");
          spanCategoria.classList.add("badge", "text-bg-info");
          spanCategoria.textContent = compromisso.Categoria.descricao;

          const spanStatus = document.createElement("span");
          spanStatus.classList.add("badge", "text-bg-success");
          spanStatus.textContent = compromisso.Status.descricao;

          divCompromisso.appendChild(divTitulo);
          divCompromisso.appendChild(spanCategoria);
          divCompromisso.appendChild(spanStatus);
        });
        divHojeContainer.appendChild(divDataCompromisso);
        divHojeContainer.appendChild(divCompromisso);
        divDiasContainer.appendChild(divHojeContainer);
      } else {
        const divHoje = document.createElement("div");
        divHoje.classList.add("calendario-hoje");

        const divData = document.createElement("div");
        divData.classList.add("calendario-data");
        divData.textContent = i;
        divHoje.appendChild(divData);
        divDiasContainer.appendChild(divHoje);
        calendarioContainer.appendChild(divDiasContainer);
      }
    }
  }

  renderCalendario(elementoId) {
    const calendarioContainer = document.getElementById(elementoId);

    let dataAtual = new Date();
    let mes = dataAtual.getMonth();
    let ano = dataAtual.getFullYear();

    const divCabecalhoContainer = document.createElement("div");
    divCabecalhoContainer.classList.add(
      "cal-month",
      "d-flex",
      "justify-content-between"
    );

    const divCabecalho = document.createElement("div");
    divCabecalho.classList.add(
      "cal-month",
      "d-flex",
      "justify-content-evenly",
      "align-items-center"
    );
    divCabecalho.id = "calendario-cabecalho";

    const btnAnterior = document.createElement("button");
    btnAnterior.classList.add("btn");
    btnAnterior.title = "Anterior";
    btnAnterior.id = "botao-anterior";
    btnAnterior.onclick = () => {
      mes--;
      if (mes < 0) {
        mes = 11;
        ano--;
      }
      dataAtual = new Date(ano, mes);
      h4MesAno.textContent = `${dataAtual.toLocaleString("pt-BR", {
        month: "long",
      })} ${ano}`;
      this.preencherCalendario(mes, ano, elementoId);
    };

    const iconAnterior = document.createElement("i");
    iconAnterior.classList.add("bi", "bi-caret-left");

    const h4MesAno = document.createElement("h4");
    h4MesAno.classList.add("cal-month-name", "text-center", "text-uppercase");
    h4MesAno.id = "mes-ano";
    h4MesAno.textContent = `${dataAtual.toLocaleString("pt-BR", {
      month: "long",
    })} ${ano}`;

    const btnProximo = document.createElement("button");
    btnProximo.classList.add("btn");
    btnProximo.title = "Posterior";
    btnProximo.id = "botao-proximo";
    btnProximo.onclick = () => {
      mes++;
      if (mes > 11) {
        mes = 0;
        ano++;
      }
      dataAtual = new Date(ano, mes);
      h4MesAno.textContent = `${dataAtual.toLocaleString("pt-BR", {
        month: "long",
      })} ${ano}`;
      this.preencherCalendario(mes, ano, elementoId);
    };

    const iconProximo = document.createElement("i");
    iconProximo.classList.add("bi", "bi-caret-right");

    const divAcoes = document.createElement("div");
    divAcoes.classList.add("d-flex", "justify-content-between");

    const btnPesquisar = document.createElement("button");
    btnPesquisar.classList.add("btn");
    btnPesquisar.title = "Pesquisar";
    btnPesquisar.id = "pesquisar-evento";

    const iconPesquisar = document.createElement("i");
    iconPesquisar.classList.add("bi", "bi-search");

    const btnAdicionar = document.createElement("button");
    btnAdicionar.classList.add("btn");
    btnAdicionar.title = "Adicionar Evento";
    btnAdicionar.id = "adicionar-evento";
    btnAdicionar.onclick = async () => {  
      await this.abrirModalCriarAgenda();
    };

    const iconAdicionar = document.createElement("i");
    iconAdicionar.classList.add("bi", "bi-plus-square");

    const btnConfiguracoes = document.createElement("button");
    btnConfiguracoes.classList.add("btn");
    btnConfiguracoes.title = "Configurações";
    btnConfiguracoes.id = "configuracao-calendario";

    const iconConfiguracoes = document.createElement("i");
    iconConfiguracoes.classList.add("bi", "bi-three-dots");

    // Montando a estrutura do cabeçalho
    btnAnterior.appendChild(iconAnterior);
    btnProximo.appendChild(iconProximo);
    btnPesquisar.appendChild(iconPesquisar);
    btnAdicionar.appendChild(iconAdicionar);
    btnConfiguracoes.appendChild(iconConfiguracoes);
    divCabecalho.appendChild(btnAnterior);
    divCabecalho.appendChild(h4MesAno);
    divCabecalho.appendChild(btnProximo);
    divAcoes.appendChild(btnPesquisar);
    divAcoes.appendChild(btnAdicionar);
    divAcoes.appendChild(btnConfiguracoes);
    divCabecalhoContainer.appendChild(divCabecalho);
    divCabecalhoContainer.appendChild(divAcoes);
    calendarioContainer.appendChild(divCabecalhoContainer);

    //Cria semanas do calendário
    const divSemanaContainer = document.createElement("div");
    divSemanaContainer.classList.add("calendario-semana");
    const diasDaSemana = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    diasDaSemana.forEach((dia) => {
      const divDia = document.createElement("div");
      divDia.classList.add("col");
      divDia.textContent = dia;
      divSemanaContainer.appendChild(divDia);
    });
    calendarioContainer.appendChild(divSemanaContainer);

    this.preencherCalendario(mes, ano, elementoId);
  }

  async listarTipos(elementoId) {    
    const tipoVM = new TipoViewModel();
    const tipos =  await tipoVM.obterTipos('Agenda');
    
    popularSelect(tipos,elementoId)
  };

  async listarStatus(elementoId) {    
    const statusVM = new StatusViewModel();
    const status =  await statusVM.obterStatus('Geral');
    
    popularSelect(status,elementoId)
  };

  async listarCategoria(elementoId) {
    const categoriaVM = new CategoriaViewModel();
    const categorias = await categoriaVM.obterCategoria('Agenda');

    popularSelect(categorias, elementoId);
  };

  async renderGraficos() {
      const dados = await this.vm.compromissosporCategoria();

      graficoPizza(
          "graficoCategoria",
          dados,
          "Compromissos por Categoria"
      );
  };

}
