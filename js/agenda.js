import { AgendaViewModel } from "./modulos/agenda/AgendaViewModel.js";
import { AgendaView } from "../js/modulos/agenda/AgendaView.js";
import { formatarParaISO } from "./Utils/metodoData.js";
import Agenda from "./modulos/agenda/agendaModel.js";

const formAgenda = document.getElementById('agenda-form');
const btnCancelar = document.getElementById('cancelar-agenda');

document.addEventListener("DOMContentLoaded", async () => {
  const vm = new AgendaViewModel();
  const agendaView = new AgendaView(vm);

  //CRUD
  await agendaView.listarAgenda("linhas");
  await agendaView.listarTipos('tipo-adicionar');

  formAgenda.addEventListener("submit", async (e) => {
    e.preventDefault();

    const idInput = document.getElementById('id-adicionar').value;
    const titulo = document.getElementById('titulo-adicionar').value;
    const data = document.getElementById('data-adicionar').value;
    const categoria = document.getElementById('categoria-adicionar').value;
    const tipo = document.getElementById('tipo-adicionar').value;
    const status = document.getElementById('status-adicionar').value;

    const agendamento = new Agenda( 
        idInput ? idInput : null,
        titulo,
        status,
        categoria,
        tipo,
        formatarParaISO(data)
    );
    
    await vm.salvarAgenda(agendamento);
    agendaView.listarAgenda("linhas");
    e.target.reset();
  });

  btnCancelar.addEventListener('click', () => {
    formAgenda.reset();
  });
 
})