import "./Utils/bootstrap.js";
import { carregarFormulario } from "./Utils/utils.js";
import { EstudoViewModel } from "./modulos/estudo/EstudoViewModel.js";
import { EstudoView } from "./modulos/estudo/EstudoView.js"
import { PlataformaViewModel } from "./modulos/plataformas/PlataformasViewModel.js";
import { PlataformasView } from "./modulos/plataformas/PlataformasView.js";
import { AreaViewModel } from "./modulos/areas/AreasViewModel.js";
import { AreasView } from "./modulos/areas/AreasView.js";
import { StatusViewModel } from "./modulos/status/StatusViewModel.js";
import { StatusView } from "./modulos/status/StatusView.js";

document.addEventListener("DOMContentLoaded", async () => {
  const vm = new EstudoViewModel();
  const estudoView = new EstudoView(vm);
  const areasVM = new AreaViewModel();
  const areasView = new AreasView(areasVM);
  const plataformaVM = new PlataformaViewModel();
  const plataformaView = new PlataformasView(plataformaVM);
  const statusVM = new StatusViewModel();
  const statusView = new StatusView(statusVM);
  const botaoAdicionar = document.getElementById("adicionarCurso");
  const botaoArea = document.getElementById('adiciona-areas');  
  const botaoPlataforma = document.getElementById('adiciona-plataforma'); 
  const botaoStatus = document.getElementById('adiciona-status');   
  const formCursoHTML = await carregarFormulario("/pages/partials/formCurso.html");
  estudoView.formHTML = formCursoHTML

  await areasView.renderCardAreas('lista-areas'); 
  await plataformaView.renderCardPlataformas('lista-plataforma', 'Cursos');
  await statusView.renderCardStatus('lista-status', 'Geral');
  await estudoView.listarCursos();
   
    //Adicionar curso
    botaoAdicionar.addEventListener("click", async () => {
        await estudoView.abrirModalCriarCursos();
    });

   //Adiciona area
    botaoArea.addEventListener("click", async (evento) => { 
        evento.preventDefault();   

        const descricaoarea = document.getElementById('descricao-areas').value
        const inputIdarea = document.getElementById('input-id-areas').value;

        if (descricaoarea === '') {
            alert('É necessário inserir uma área!');
            return
        }
        const area = {
            id: inputIdarea ? inputIdarea : null,
            descricao: descricaoarea
        }          
        await areasVM.salvarArea(area);
        await areasView.renderCardAreas('lista-areas');

        document.getElementById('descricao-areas').value = ''
        document.getElementById('input-id-areas').value = ''
    });

    //Adiciona plataforma
    botaoPlataforma.addEventListener("click", async (evento) => { 
        evento.preventDefault();   

        const descricaoplataforma = document.getElementById('descricao-plataforma').value
        const inputIdplataforma = document.getElementById('input-id-plataforma').value;

        if (descricaoplataforma === '') {
            alert('É necessário inserir uma plataforma!');
            return
        }
        const plataforma = {
            id: inputIdplataforma ? inputIdplataforma : null,
            descricao: descricaoplataforma,
            Tipo: 'Cursos'
        }          
        await plataformaView.salvarPlataforma(plataforma);
        await plataformaView.renderCardPlataformas('lista-plataforma', 'Cursos');

        document.getElementById('descricao-plataforma').value = ''
        document.getElementById('input-id-plataforma').value = ''
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

});

