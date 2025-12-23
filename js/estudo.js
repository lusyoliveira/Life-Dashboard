import { EstudoViewModel } from "./modulos/estudo/EstudoViewModel.js";
import { EstudoView } from "./modulos/estudo/EstudoView.js"
import Curso from "./modulos/estudo/estudoModel.js";


document.addEventListener("DOMContentLoaded", async () => {
  const vm = new EstudoViewModel();
  const estudoView = new EstudoView(vm);

  const formCurso = document.getElementById('curso-form');
  const btnCancelar = document.getElementById('cancelar-curso');

  //CRUD
  await estudoView.listarCursos("linhas");
  // await estudoView.listarArea('area-adicionar');
  // await estudoView.listarStatus('status-adicionar');

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

});

