import { limparFormulario } from "../../Utils/utils.js";
import { criarDataTable } from "../../componentes/tabelas/DataTable.js";
import { colunaAcoes } from "../../componentes/tabelas/colunasAcoes.js";
import { abrirModalAcao } from "../../Utils/modal.js";
import Contas from "./contasModel.js"

export class ContasView {
  constructor(vm) {
    this.vm = vm;
    this.registrarEventosTabela();
  }

  async registrarEventosTabela() {
        const tabela = document.getElementById("tabelaContas");
        if (!tabela) return;

        tabela.addEventListener("click", async (e) => {
            const btnEditar = e.target.closest(".btn-editar");
            const btnExcluir = e.target.closest(".btn-excluir");

            if (btnEditar) {
            await this.abrirModalEditarConta(btnEditar.dataset.id);
            }

            if (btnExcluir) {
            await this.abrirModalExcluirConta(btnExcluir.dataset.id);
            }
        });
    };

    async abrirModalExcluirConta(id) {
        abrirModalAcao({
            titulo: "Excluir conta",
            conteudoHTML: `<p>Deseja realmente excluir esta conta?</p>`,
            textoConfirmar: "Excluir",
            classeBotao: "btn-danger",

            onConfirmar: async () => {
            await this.vm.excluirConta(id);
            await this.listarContas();
            }
        });
    };

    async abrirModalCriarConta() {
        abrirModalAcao({
            titulo: "Adicionar conta",
            conteudoHTML: this.formHTML,
            textoConfirmar: "Salvar",

            onConfirmar: async () => {
            const form = document.getElementById("formConta");

            if (!form.checkValidity()) {
                form.reportValidity();
                return false;
            }

            await this.salvarFormularioConta(form);
            await this.listarContas();
            }
        });

        limparFormulario();   
    };

    async abrirModalEditarConta(id) {
        const conta = await this.vm.obterContaPorID(id);

        abrirModalAcao({
            titulo: "Editar conta",
            conteudoHTML: this.formHTML,
            textoConfirmar: "Salvar alterações",

            onConfirmar: async () => {
            const form = document.getElementById("formConta");

            if (!form.checkValidity()) {
                form.reportValidity();
                return false;
            }

            await this.salvarFormularioConta(form);
            await this.listarContas();
            }
        });    
        document.getElementById('id-adicionar').value = conta.id;
        document.getElementById('agencia-adicionar').value = conta.Agencia;
        document.getElementById('conta-adicionar').value = conta.Conta;
        document.getElementById('banco-adicionar').value = conta.Banco;
        document.getElementById('descricao-adicionar').value = conta.Descricao;
        document.getElementById('tipo-adicionar').value = conta.Tipo; 
        document.getElementById('saldo-adicionar').value = conta.Saldo;
    };

     async salvarFormularioConta(form) {
        const idInput = form.querySelector('#id-adicionar')?.value || null;
        const agencia = form.querySelector('#agencia-adicionar').value;
        const conta = form.querySelector('#conta-adicionar').value;
        const banco = form.querySelector('#banco-adicionar').value;
        const descricao = form.querySelector('#descricao-adicionar').value;
        const tipo = form.querySelector('#tipo-adicionar').value;
        const saldo = form.querySelector('#saldo-adicionar').value;

        const contaModel = new Contas( 
            idInput ? idInput : null,
            agencia,
            conta,
            banco,
            descricao,
            tipo,
            Number(saldo)
        );
        await this.vm.salvarContas(contaModel);
    };

    async listarContas() {
    const dados = await this.vm.obterContas();

    for (const conta of dados) {
        conta.Saldo = await this.vm.calcularSaldo(
            conta.id,
            conta.Saldo // aqui é o saldo inicial
        );
    }

    criarDataTable({
        tabelaId: "tabelaContas",
        dados,
        colunas: [
            { title: "Agência", data: "Agencia" },
            { title: "Conta", data: "Conta" },
            { title: "Banco", data: "Banco" },
            { title: "Descrição", data: "Descricao" },
            { title: "Tipo", data: "Tipo" },
            { title: "Saldo", data: "Saldo" },
            colunaAcoes({ campoId: "id" })
        ]
    });
};
async listarContas() {
    const dados = await this.vm.obterContas();

    for (const conta of dados) {
        conta.Saldo = await this.vm.calcularSaldo(
            conta.id,
            conta.Saldo 
        );
    }

    criarDataTable({
        tabelaId: "tabelaContas",
        dados,
        colunas: [
            { title: "Agência", data: "Agencia" },
            { title: "Conta", data: "Conta" },
            { title: "Banco", data: "Banco" },
            { title: "Descrição", data: "Descricao" },
            { title: "Tipo", data: "Tipo" },
            colunaAcoes({ campoId: "id" })
        ]
    });
};

    async renderContas(elementoDestinoId) {
        const elementoDestino = document.getElementById(elementoDestinoId);
        elementoDestino.innerHTML = "";

        const contas = await this.vm.obterContas();

        for (const conta of contas) {

            const saldoAtual = await this.vm.calcularSaldo(
                conta.id,
                conta.Saldo
            );

            const li = document.createElement('li');
            li.classList.add(
                'list-group-item',
                'd-flex',
                'justify-content-between',
                'align-items-center'
            );

            li.textContent = conta.Descricao;

            const span = document.createElement('span');
            span.classList.add('badge', 'bg-primary', 'rounded-pill');
            span.textContent = `R$ ${saldoAtual.toFixed(2)}`;

            li.appendChild(span);
            elementoDestino.appendChild(li);
        }
    }
}