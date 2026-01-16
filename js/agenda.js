import { AgendaViewModel } from "./modulos/agenda/AgendaViewModel.js";
import { AgendaView } from "../js/modulos/agenda/AgendaView.js";
import { CategoriaViewModel } from "./modulos/categorias/CategoriasViewModel.js";
import { CategoriasView } from "./modulos/categorias/CategoriasView.js";
import { StatusViewModel } from "./modulos/status/StatusViewModel.js";
import { StatusView } from "./modulos/status/StatusView.js";
import { TipoViewModel } from "./modulos/tipos/TipoViewModel.js";
import { TiposView } from "./modulos/tipos/TiposView.js";
import { formatarParaISO } from "./Utils/metodoData.js";
import Agenda from "./modulos/agenda/agendaModel.js";

const formAgenda = document.getElementById('agenda-form');
const btnCancelar = document.getElementById('cancelar-agenda');
const botaoCategoria = document.getElementById('adiciona-categoria'); 
const botaoStatus = document.getElementById('adiciona-status'); 
const botaoTipo = document.getElementById('adiciona-tipo'); 

    document.addEventListener("DOMContentLoaded", async () => {
    const vm = new AgendaViewModel();
    const agendaView = new AgendaView(vm);

    const categoriaVM = new CategoriaViewModel();
    const categoriaView = new CategoriasView(categoriaVM);

    const statusVM = new StatusViewModel();
    const statusView = new StatusView(statusVM);

    const tipoVM = new TipoViewModel();
    const tipoView = new TiposView(tipoVM);

    await categoriaView.renderCardCategorias('lista-categoria','Agenda');
    await statusView.renderCardStatus('lista-status', 'Geral');
    await tipoView.renderCardTipos('lista-tipo', 'Agenda');

    //CRUD
    await agendaView.listarAgenda("linhas");
    await agendaView.listarTipos('tipo-adicionar');
    await agendaView.listarCategoria('categoria-adicionar');
    await agendaView.listarStatus('status-adicionar');

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

    agendaView.renderProximosCompromissos('proximos-compromissos', 7)
    
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
        const inputIdtipo = document.getElementById('input-id-tipo').value;

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
})