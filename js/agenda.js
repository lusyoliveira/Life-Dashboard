import "./Utils/bootstrap.js";
import { carregarFormulario } from "./Utils/utils.js";
import { AgendaViewModel } from "./modulos/agenda/AgendaViewModel.js";
import { AgendaView } from "../js/modulos/agenda/AgendaView.js";
import { CategoriaViewModel } from "./modulos/categorias/CategoriasViewModel.js";
import { CategoriasView } from "./modulos/categorias/CategoriasView.js";
import { StatusViewModel } from "./modulos/status/StatusViewModel.js";
import { StatusView } from "./modulos/status/StatusView.js";
import { TipoViewModel } from "./modulos/tipos/TipoViewModel.js";
import { TiposView } from "./modulos/tipos/TiposView.js";

  export async function inicializarAgenda() {

    const vm = new AgendaViewModel();

    const agendaView = new AgendaView(vm);

    const categoriaVM = new CategoriaViewModel();
    const categoriaView = new CategoriasView(categoriaVM);

    const statusVM = new StatusViewModel();
    const statusView = new StatusView(statusVM);

    const tipoVM = new TipoViewModel();
    const tipoView = new TiposView(tipoVM);

    const botaoAdicionar = document.getElementById("adicionarAgenda");

    const botaoCategoria = document.getElementById('adiciona-categoria');

    const botaoStatus = document.getElementById('adiciona-status');

    const botaoTipo = document.getElementById('adiciona-tipo');

    const formAgendaHTML =
        await carregarFormulario("/pages/partials/formAgenda.html");

    agendaView.formHTML = formAgendaHTML;


    await categoriaView.renderCardCategorias(
        'lista-categoria',
        'Agenda'
    );

    await statusView.renderCardStatus(
        'lista-status',
        'Geral'
    );

    await tipoView.renderCardTipos(
        'lista-tipo',
        'Agenda'
    );

    await agendaView.listarAgenda();

    agendaView.renderProximosCompromissos(
        'proximos-compromissos',
        10
    );

    agendaView.renderGraficos();


    // Adicionar agendamento
    botaoAdicionar.addEventListener("click", async () => {
        await agendaView.abrirModalCriarAgenda();
    });


    // Adicionar categoria
    botaoCategoria.addEventListener("click", async (evento) => {

        evento.preventDefault();

        const descricaoCategoria =
            document.getElementById('descricao-categoria').value;

        const inputIdCategoria =
            document.getElementById('input-id-categoria').value;

        if (descricaoCategoria === '') {
            alert('É necessário inserir uma categoria!');
            return;
        }

        const categoria = {
            id: inputIdCategoria ? inputIdCategoria : null,
            descricao: descricaoCategoria,
            Tipo: 'Agenda'
        };

        await categoriaView.salvarCategoria(categoria);

        await categoriaView.renderCardCategorias(
            'lista-categoria',
            'Agenda'
        );

        document.getElementById('descricao-categoria').value = '';
        document.getElementById('input-id-categoria').value = '';
    });


    // Adicionar status
    botaoStatus.addEventListener("click", async (evento) => {

        evento.preventDefault();

        const descricaoStatus =
            document.getElementById('descricao-status').value;

        const inputIdStatus =
            document.getElementById('input-id-status').value;

        if (descricaoStatus === '') {
            alert('É necessário inserir uma status!');
            return;
        }

        const status = {
            id: inputIdStatus ? inputIdStatus : null,
            descricao: descricaoStatus,
            Tipo: 'Geral'
        };

        await statusView.salvarStatus(status);

        await statusView.renderCardStatus(
            'lista-status',
            'Geral'
        );

        document.getElementById('descricao-status').value = '';
        document.getElementById('input-id-status').value = '';
    });


    // Adicionar tipo
    botaoTipo.addEventListener("click", async (evento) => {

        evento.preventDefault();

        const descricaoTipo =
            document.getElementById('descricao-tipos').value;

        const inputIdTipo =
            document.getElementById('input-id-tipos').value;

        if (descricaoTipo === '') {
            alert('É necessário inserir um tipo!');
            return;
        }

        const tipo = {
            id: inputIdTipo ? inputIdTipo : null,
            descricao: descricaoTipo,
            Tipo: 'Agenda'
        };

        await tipoView.salvarTipo(tipo);

        await tipoView.renderCardTipos(
            'lista-tipo',
            'Agenda'
        );

        document.getElementById('descricao-tipos').value = '';
        document.getElementById('input-id-tipos').value = '';
    });

}
