//Plug-in function for the bootstrap version of the multiple email
$(function() {
    //initialize
    var transactionHistoryDataTable = null;
    populateBonusTransactionHistory();

    $('button#purchase').click(function(e){
        window.location.href = '/buytokens';
    });

    $('#walletTypeDropDown li a').click(function(e) {
        $("#walletTypeDropDownBtn:first-child").text($(this).text());
        $("#walletTypeDropDownBtn:first-child").val($(this).attr("id"));

        //clear datatable
        $('#dataTableTransactionHistory').dataTable().fnClearTable();
        $('#dataTableTransactionHistory').dataTable().fnDraw();
        $('#dataTableTransactionHistory').dataTable().fnDestroy();

        console.log($(this).attr("id"));
    });


    function populateBonusTransactionHistory(){
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
            "sAjaxSource": "/bonustransactionhistorylist",
            "paging": true,
            "fnInitComplete": function(){
            },
            "aoColumns" : [
                {},
                {},
                {},
                {},
                {}
            ]
        });
    }

});

