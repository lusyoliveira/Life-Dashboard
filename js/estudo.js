import { EstudoViewModel } from "./modulos/estudo/EstudoViewModel.js";
import { EstudoView } from "./modulos/estudo/EstudoView.js"
import Curso from "./modulos/estudo/estudoModel.js";
import { AreaViewModel } from "./modulos/areas/AreasViewModel.js";
import { AreasView } from "./modulos/areas/AreasView.js";

document.addEventListener("DOMContentLoaded", async () => {
  const vm = new EstudoViewModel();
  const estudoView = new EstudoView(vm);

  const areasVM = new AreaViewModel();
  const areasView = new AreasView(areasVM);

  const formCurso = document.getElementById('curso-form');
  const btnCancelar = document.getElementById('cancelar-curso');
  const botaoArea = document.getElementById('adiciona-areas'); 

    await areasView.renderCardAreas('lista-areas');

  //CRUD
  await estudoView.listarCursos('linhas');
  await estudoView.listarArea('area-adicionar');
  await estudoView.listarStatus('status-adicionar');
  await estudoView.listarPlataforma('escola-adicionar');

  formCurso.addEventListener("submit", async (e) => {
     e.preventDefault();
 
     const idInput = document.getElementById('id-adicionar').value;     
     const capa = document.getElementById('capa-adicionar').value;
     const tituloCurso = document.getElementById('curso-adicionar').value;        
     const escola = document.getElementById('capa-adicionar').value;
     const instrutor = document.getElementById('instrutor-adicionar').value;
     const area = document.getElementById('area-adicionar').value;
     const dataCompra = document.getElementById('compra-adicionar').value;
     const aulas = document.getElementById('assistidos-adicionar').value;
     const assistido = document.getElementById('aulas-adicionar').value;
     const horas = document.getElementById('horas-adicionar').value;
     const valor = document.getElementById('valor-adicionar').value;
     const status = document.getElementById('status-adicionar').value;
     const certificado = document.getElementById('certificado-adicionar').value;

     const curso = new Curso(
        idInput ? idInput : null,
        capa,
        escola,
        Number(aulas),
        Number(assistido),
        Number(horas),
        tituloCurso,
        instrutor,
        area,
        formatarParaISO(dataCompra),
        Number(valor),
        status,
        certificado
     );
   
     await vm.salvarCurso(curso);
     estudoView.listarCursos("linhas");
     e.target.reset();
   });

  btnCancelar.addEventListener('click', () => {
      formCurso.reset();
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

});

