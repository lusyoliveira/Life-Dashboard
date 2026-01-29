    import "./Utils/bootstrap.js";
    import { carregarFormulario } from "./Utils/utils.js";
    import { EstudoViewModel } from "./modulos/estudo/EstudoViewModel.js";
    import { EstudoView } from "./modulos/estudo/EstudoView.js";
    import { CatalogoViewModel } from "./modulos/catalogo/CatalogoViewModel.js";
    import { CatalogoView } from "./modulos/catalogo/CatalogoView.js";
    import { TarefasViewModel } from "./modulos/tarefas/TarefasViewModel.js";
    import { TarefasView } from "./modulos/tarefas/TarefasView.js";
    import { AgendaViewModel } from "./modulos/agenda/AgendaViewModel.js";
    import { AgendaView } from "./modulos/agenda/AgendaView.js";
    import { ClimaViewModel } from "./modulos/clima/ClimaViewModel.js";
    import { ClimaView } from "./modulos/clima/ClimaView.js";
    import { ContagemViewModel } from "./modulos/contagem/ContagemViewModel.js";
    import { ContagemView } from "./modulos/contagem/ContagemView.js";
    import { ContadorViewModel } from "./modulos/contador/ContadorViewModel.js";
    import { ContadorView } from "./modulos/contador/ContadorView.js";
    import { RelogioViewModel } from "./modulos/relogio/RelogioViewModel.js";
    import { RelogioView } from "./modulos/relogio/RelogioView.js";
    import { ConfiguracaoViewModel } from "./modulos/configuracoes/ConfiguracaoViewModel.js";
    import { ConfiguracaoView } from "./modulos/configuracoes/ConfiguracaoView.js";
    import { FinanceiroViewModel } from "./modulos/financeiro/FinanceiroViewModel.js";
    import { FinanceiroView } from "./modulos/financeiro/FinanceiroView.js";
    import { ContasViewModel } from "./modulos/contas/ContasViewModel.js";
    import { ContasView } from "./modulos/contas/ContasView.js";

    const botaoTarefa = document.getElementById('adiciona-tarefa'); 
    const botaoCatalogo = document.getElementById("adicionarCatalogo");   
    const botaoCurso = document.getElementById("adicionarCurso");
    const botaoTransacao = document.getElementById('adicionarTransacao');
    const tvm = new TarefasViewModel("tarefas");
    const tarefaView = new TarefasView(tvm);
    const evm = new EstudoViewModel("cursos");
    const estudoView = new EstudoView(evm);
    const cvm = new CatalogoViewModel("catalogo");
    const catalogoView = new CatalogoView(cvm);
    const avm = new AgendaViewModel("agenda");
    const agendaView = new AgendaView(avm);
    const clvm = new ClimaViewModel("clima");
    const climaView = new ClimaView(clvm);
    const ctvm = new ContagemViewModel();
    const contagemView = new ContagemView(ctvm);
    const ctdvm = new ContadorViewModel();
    const contadorView = new ContadorView(ctdvm);
    const rvm = new RelogioViewModel();
    const relogioView = new RelogioView(rvm);    
    const cfvm = new ConfiguracaoViewModel('configuracoes');
    const configuracaoView = new ConfiguracaoView(cfvm);
    const cf = new FinanceiroViewModel();
    const financeiroView = new FinanceiroView(cf);
    const contasVM = new ContasViewModel();
    const contasView = new ContasView(contasVM);  


    (async () => {
        await evm.obterCursos(); 
        await tvm.obterTarefas();   
        await cvm.obterCatalogo(); 
        await avm.obterAgenda();
        await contasVM.obterContas();
        
        // const configuracoes = (await cfvm.obterConfiguracoes())[0] 
        // setInterval(async () => {
        //     if (configuracoes.AtualizaClima) {
        //         await clvm.atualizarClima(configuracoes)
        //         climaView.exibirClima('clima')
        //     }
        // }, configuracoes.AtualizaClima ? configuracoes.AtualizaClima * 60000 : 0); // Converte minutos para milissegundos

        estudoView.renderCursando("Cursando");
        tarefaView.listarTarefas('lista-tarefa')
        catalogoView.renderAssistindo(['Assistindo','Reassistindo'],'Assistindo')
        agendaView.renderProximosCompromissos('proximos-compromissos', 7)
        financeiroView.renderTransacoesAVencer('proximos-transacoes', 7)
        agendaView.renderCalendario('calendario')
        climaView.exibirClima('clima')
        contagemView.exibirContagem('contagemRegressiva')
        contadorView.exibirContador('contador')
        relogioView.exibirRelogio('relogio')
        contasView.renderContas('lista-contas')

        const formCatalogoHTML = await carregarFormulario("/pages/partials/formCatalogo.html");
        catalogoView.formHTML = formCatalogoHTML;
        const formAgendaHTML = await carregarFormulario("/pages/partials/formAgenda.html");
        agendaView.formHTML = formAgendaHTML;
        const formCursoHTML = await carregarFormulario("/pages/partials/formCurso.html");
        estudoView.formHTML = formCursoHTML;
        const formTransacaoHTML = await carregarFormulario("/pages/partials/formTransacao.html");
        financeiroView.formHTML = formTransacaoHTML
        // const alertTrigger = document.getElementById('liveAlertPlaceholder')

        // if (alertTrigger) {
        //     alertTrigger.addEventListener('click', () => {
        //         mostrarAlerta('Nice, you triggered this alert message!', 'success')
        //     })
        // }

        //Adicionar transação
        botaoTransacao.addEventListener("click", async () => {
            await financeiroView.abrirModalCriarTransacao();
        });

        //Adicionar catalogo
        botaoCatalogo.addEventListener("click", async () => {
            await catalogoView.abrirModalCriarCatalogo();
        });
        //Adicionar curso
        botaoCurso.addEventListener("click", async () => {
            await estudoView.abrirModalCriarCursos();
        });
        //Adiciona tarefa
        botaoTarefa.addEventListener("click", async (evento) => { 
            evento.preventDefault();   

            const descricaoTarefa = document.getElementById('descricao-tarefa').value
            const inputIdTarefa = document.getElementById('id-tarefa').value;

            if (descricaoTarefa === '') {
                alert('É necessário inserir uma tarefa!');
                return
            }
            const tarefa = {
                id: inputIdTarefa,
                Tarefa: descricaoTarefa,
                Adicionado:  new Date(),
                Feito: false
            }           
            await tvm.salvarTarefa(tarefa);
            tarefaView.listarTarefas('lista-tarefa')
        });

    })();   

 