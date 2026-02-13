import $ from "jquery";
import DataTable from "datatables.net-dt";

// CSS
import "datatables.net-dt/css/dataTables.dataTables.css";

// jQuery global (obrigatório)
window.$ = $;
window.jQuery = $;

export function criarDataTable({
  tabelaId,
  dados = [],
  colunas = [],
  opcoes = {}
}) {
  const tabela = document.getElementById(tabelaId);
  if (!tabela) {
    console.warn(`Tabela '${tabelaId}' não encontrada`);
    return null;
  }

  if ($.fn.DataTable.isDataTable(tabela)) {
    $(tabela).DataTable().destroy();
    tabela.innerHTML = "";
  }

  return new DataTable(tabela, {
    data: dados,
    columns: colunas,
    responsive: true,
    pageLength: 10,
    order: [],
    language: {
      url: "/datatables/pt-BR.json"
    },
    ...opcoes
  });
}
