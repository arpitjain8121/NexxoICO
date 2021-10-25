//Plug-in function for the bootstrap version of the multiple email
$(function() {
    $('#dataTableReferHistory').dataTable( {
        "bProcessing": false,
        "bFilter": false,
        "aaSorting": [[ 0, "asc" ]],
        "ordering": false,
        "iDisplayLength": 50,
        "bServerSide": true,
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "sAjaxSource": "/referralhistorylist",
        "paging": false,
        "fnInitComplete": function(){
        },
        "aoColumns" : [
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    });
});
