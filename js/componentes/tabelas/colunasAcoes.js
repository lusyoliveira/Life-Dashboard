
export function colunaAcoes({
  campoId = "id",
  mostrarEditar = true,
  mostrarExcluir = true
} = {}) {
  return {
    title: "Ações",
    data: null,
    orderable: false,
    searchable: false,
    render: (data, type, row) => {
      const id = row[campoId];

      return `
        <button
          class="btn btn-sm btn-primary btn-editar"
          data-id="${row.id}"
          data-titulo="${row.Titulo}">
          <i class="bi bi-pencil-fill"></i>
        </button>

        <button
          class="btn btn-sm btn-danger btn-excluir"
          data-id="${row.id}">
          <i class="bi bi-trash-fill"></i>
        </button>
      `;
    }
  };
}
