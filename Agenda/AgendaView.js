import { calculaTempoData } from "../js/metodoData.js";
export class AgendaView {
  constructor(vm) {
    this.vm = vm;
  }
  //Formulário
  async editarAgenda(agendamentoId) {
    const agendamento = await this.vm.obterAgendaPorID(agendamentoId)

    if (agendamento) {
        document.getElementById('id-adicionar').value = agendamentoId;
        document.getElementById('titulo-adicionar').value = agendamento.Titulo;
        document.getElementById('data-adicionar').value = new Date(agendamento.Data).toISOString().slice(0,16);
        document.getElementById('categoria-adicionar').value = agendamento.Categoria;
        document.getElementById('tipo-adicionar').value = agendamento.Tipo;
        document.getElementById('status-adicionar').value = agendamento.Status;
    } else {
        alert('Compromisso não encontrado!');
    }
  }

  async listarAgenda(elementoId) {
    const linhaTabela = document.getElementById(elementoId);
    linhaTabela.innerHTML = "";
    const agenda = await this.vm.obterAgenda();

    if (!linhaTabela) return;

    if ($.fn.DataTable.isDataTable(".datatable")) {
      $(".datatable").DataTable().clear().destroy();
    } 
    
    const listaOrdenada = agenda.sort((a, b) => new Date(a.Data) - new Date(b.Data));
    listaOrdenada.forEach((compromisso) => {
        
      const tr = document.createElement("tr");
      
      const tdTitulo = document.createElement("td");
      tdTitulo.textContent = compromisso.Titulo;

      const tdStatus = document.createElement("td");
      tdStatus.textContent = compromisso.Status;
      tdStatus.classList.add("text-center");

      const tdCategoria = document.createElement("td");
      tdCategoria.textContent = compromisso.Categoria;
      tdCategoria.classList.add("text-center");

      const tdTipo = document.createElement("td");
      tdTipo.textContent = compromisso.Tipo;
      tdTipo.classList.add("text-center");

      const tdData = document.createElement("td");
      const dataUTC = new Date(compromisso.Data);
      const dataLocal = new Date(dataUTC.getTime() + dataUTC.getTimezoneOffset() * 60000);
      tdData.textContent = dataLocal.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const tdBtnEditar = document.createElement("td");
      const tdBtnExcluir = document.createElement("td");

      const btnEditar = document.createElement("button");
      btnEditar.classList.add("btn", "btn-primary");
      btnEditar.onclick = () => this.editarAgenda(compromisso.id);

      const iconeEditar = document.createElement("i");
      iconeEditar.classList.add("bi", "bi-pencil-fill");
      iconeEditar.setAttribute("id", "editar-agenda");

      const btnExcluir = document.createElement("button");
      btnExcluir.classList.add("btn", "btn-danger");
      btnExcluir.onclick = async () => {
        try {
          await this.vm.excluirAgenda(compromisso.id);
        } catch (error) {
          alert("Erro ao excluir agendamento!");
        }
      };

      const iconeExcluir = document.createElement("i");
      iconeExcluir.classList.add("bi", "bi-trash");
      iconeExcluir.setAttribute("id", "excluir-agenda");

      btnEditar.appendChild(iconeEditar);
      btnExcluir.appendChild(iconeExcluir);
      tdBtnEditar.appendChild(btnEditar);
      tdBtnExcluir.appendChild(btnExcluir);
      tr.appendChild(tdTitulo);
      tr.appendChild(tdStatus);
      tr.appendChild(tdCategoria);
      tr.appendChild(tdTipo);
      tr.appendChild(tdData);
      tr.appendChild(tdBtnEditar);
      tr.appendChild(tdBtnExcluir);

      linhaTabela.appendChild(tr);
    });

    document.dispatchEvent(new Event("Renderizado"));
  }

  async renderProximosCompromissos(elementoDestinoId) {
    const elementoDestino = document.getElementById(elementoDestinoId);
    const agendaFiltrada = this.vm.filtrarProximosCompromissos(13);

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
                          compromisso.Categoria
                        }</small>
                    </a>
                `;
      });
    }
  }

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
          spanCategoria.textContent = compromisso.Categoria;

          const spanStatus = document.createElement("span");
          spanStatus.classList.add("badge", "text-bg-success");
          spanStatus.textContent = compromisso.Status;

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
}
