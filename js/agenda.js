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

    document.addEventListener("DOMContentLoaded", async () => {
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
    const formAgendaHTML = await carregarFormulario("/pages/partials/formAgenda.html");
    agendaView.formHTML = formAgendaHTML

    await categoriaView.renderCardCategorias('lista-categoria','Agenda');
    await statusView.renderCardStatus('lista-status', 'Geral');
    await tipoView.renderCardTipos('lista-tipo', 'Agenda');
    await agendaView.listarAgenda();

    agendaView.renderProximosCompromissos('proximos-compromissos', 7)
    
    //Adicionar Agendamento
    botaoAdicionar.addEventListener("click", async () => {
        await agendaView.abrirModalCriarAgenda();
    });

    //Adiciona categoria
    botaoCategoria.addEventListener("click", async (evento) => { 
        evento.preventDefault();   

        const descricaocategoria = document.getElementById('descricao-categoria').value
        const inputIdcategoria = document.getElementById('input-id-categoria').value;

        if (descricaocategoria === '') {
            alert('É necessário inserir uma categoria!');
            return
        }
        const categoria = {
            id: inputIdcategoria ? inputIdcategoria : null,
            descricao: descricaocategoria,
            Tipo: 'Agenda'
        }          
        await categoriaView.salvarCategoria(categoria);
        await categoriaView.renderCardCategorias('lista-categoria', 'Agenda');

        document.getElementById('descricao-categoria').value = ''
        document.getElementById('input-id-categoria').value = ''
    });

    //Adiciona status
    botaoStatus.addEventListener("click", async (evento) => { 
        evento.preventDefault();   

        const descricaostatus = document.getElementById('descricao-status').value
        const inputIdstatus = document.getElementById('input-id-status').value;

        if (descricaostatus === '') {
            alert('É necessário inserir uma status!');
            return
        }
        const status = {
            id: inputIdstatus ? inputIdstatus : null,
            descricao: descricaostatus,
            Tipo: 'Geral'
        }          
        await statusView.salvarStatus(status);
        await statusView.renderCardStatus('lista-status', 'Geral');

        document.getElementById('descricao-status').value = ''
        document.getElementById('input-id-status').value = ''
    });

    //Adiciona tipo   
    botaoTipo.addEventListener("click", async (evento) => { 
        evento.preventDefault();   

        const descricaotipo = document.getElementById('descricao-tipo').value
        const inputIdtipo = document.getElementById('input-id-tipos').value;

        if (descricaotipo === '') {
            alert('É necessário inserir uma tipo!');
            return
        }
        const tipo = {
            id: inputIdtipo ? inputIdtipo : null,
            descricao: descricaotipo,
            Tipo: 'Agenda'
        }          
        await tipoView.salvarTipo(tipo);
        await tipoView.renderCardTipos('lista-tipos','Agenda');
        
        document.getElementById('descricao-tipo').value = ''
        document.getElementById('input-id-tipo').value = ''
    });
});