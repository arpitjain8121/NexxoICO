//Plug-in function for the bootstrap version of the multiple email
$(function() {
    $('#dataTableTransactionHistoryNovam').dataTable( {
        responsive: true,
        "bProcessing": true,
        "bFilter": true,
        "aaSorting": [[ 0, "asc" ]],
        "ordering": false,
        "iDisplayLength": 50,
        "bServerSide": true,
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "sAjaxSource": "/novamadmin/transactionlist",
        "paging": true,
        "fnInitComplete": function(){
        },
        "aoColumns" : [
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    });
});
