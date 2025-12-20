// Escuta quando a tabela for preenchida
document.addEventListener('Renderizado', () => {
    const tabela = $('.datatable');
    
    // Se DataTable já foi aplicado, destrói e recria
     if ($.fn.DataTable.isDataTable(tabela)) {
        tabela.DataTable().clear().destroy(); // destrói totalmente
        tabela.find('thead').remove(); // remove o cabeçalho duplicado renderizado
    }

    tabela.DataTable({
        paging: true,
        scrollX: false,
        searching: true,
        ordering: false,
        autoWidth: true,
        lengthMenu: [10, 25, 50],
        pageLength: 10,
        language: {
            url: '../../assets/json/PT-BR.json'
        }
    });
});
