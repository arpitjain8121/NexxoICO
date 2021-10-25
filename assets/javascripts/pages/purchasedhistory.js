//Plug-in function for the bootstrap version of the multiple email
$(function() {
    populateTransactionHistory();

    $("#buy-tokens-golden-coins").click(function(e){
        e.preventDefault();
        window.location.href="/buytokens";
    });

    function populateTransactionHistory(){
        transactionHistoryDataTable = $('#dataTableTransactionHistory').dataTable( {
            responsive: true,
            "bProcessing": true,
            "bFilter": false,
            "aaSorting": [[ 0, "asc" ]],
            "ordering": false,
            "iDisplayLength": 20,
            "bServerSide": true,
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "sAjaxSource": "/purchasetransactionhistorylist",
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
    }

    function isNullOrEmpty(param){
        return (param == null || typeof param == "undefined" || undefined == param || $.trim(param).length == 0);
    }

    function isObject(val) {
        if (val === null) { return false;}
        return ( (typeof val === 'function') || (typeof val === 'object') );
    }

});