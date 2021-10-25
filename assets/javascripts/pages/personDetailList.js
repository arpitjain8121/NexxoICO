var qpay = qpay || {};
nexxo.personDetailList = nexxo.personDetailList || (function(){

    var sort = "firstName desc";
    var pageIndex = -1;
    var requestCompleted=false;
    var records = 0;

    function isNullOrEmpty(param){
        return (param == null || typeof param == "undefined" || undefined == param || $.trim(param).length == 0);
    }

    function reloadPersonStatus(){
        $("#statusId").empty();
        $("#statusId").append('<option value="">--select person status--</option>');
        $("#statusId").append('<option value="3">Active</option>');
        $("#statusId").append('<option value="4">Blocked</option>');
    }

    function bindScrollOnPersonList(){
        $(window).scroll(function(){
            if($(window).scrollTop() -($(document).height() - $(window).height()) > -50){
                if(nexxo.personDetailList.records > 0 && requestCompleted) {
                    $("div#personListPanel").find('div#loadmoreajaxloader').show();
                    getPersonListSuggestions(false);
                }
            }
        });
    }

    function formatResultValue(a, b) {
        var c = "(" + b.replace(RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\)", "g"), "\\$1") + ")";
        return a.replace(RegExp(c, "gi"), "<strong>$1</strong>")
    }

    function getPersonListSuggestions(isAsync){
        $("div#personListPanel").find('div#loadmoreajaxloader').html('');
        requestCompleted=false;
        pageIndex = pageIndex + 1;
        if($("#sorter-personListTable").length>0){
            sort=$("#sorter-personListTable").val();
        }

        var data = {
            statusId: $("#statusId").val(),
            searchString: $("#searchString").val()
        };

        $.ajax({
            type:'GET',
            dataType: "json",
            url: "/personListSuggestions?pageIndex=" + pageIndex + "&sort=" + sort,
            data: data,
            success: onSuccessSuggestionsAppend
        });
    }

    function onSuccessSuggestionsAppend(response){

        if(response != "undefined" && 201 == response.status){
            var cErrorMessage = response.message;
            if(!isNullOrEmpty(cErrorMessage)) {
                $("div#personListPanel div#errorResponse").html(cErrorMessage+"<br/>");
            }
        } else {
            var g = "";
            if (pageIndex == 0) {
                $("div#personListPanel div#totalCount").html("&nbsp;&nbsp;Total Person: " + response.totalRecords);
            }

            nexxo.personDetailList.records = 0;
            if (response.suggestions != "undefined" && response.suggestions.length > 0) {
                nexxo.personDetailList.records = response.suggestions.length;
                $.each(response.suggestions, function (k, v) {
                    g += '<tr class="autocomplete-suggestion" record_id="' + v.additionalField.personId + '"  status_id="' + v.additionalField.currentStatusId + '">';
                    g += '<td style="vertical-align: middle">' +formatResultValue ( v.additionalField.firstName, response.query )+ '</td>';
                    g += '<td style="vertical-align: middle">' +formatResultValue ( v.additionalField.lastName, response.query )+ '</td>';
                    g += '<td style="vertical-align: middle">' +formatResultValue ( v.additionalField.email, response.query )+ '</td>';
                    g += '<td style="vertical-align: middle">' +formatResultValue ( v.additionalField.phoneNo, response.query )+ '</td>';
                    g += '<td style="vertical-align: middle">' +formatResultValue ( v.additionalField.nationality, response.query )+ '</td>';
                    g += '<td style="vertical-align: middle">' +formatResultValue ( v.additionalField.passportNo, response.query )
                     if(v.additionalField.documentId != null){
                             g += "&nbsp;&nbsp;&nbsp;&nbsp; <img class='img-thumbnail' id='kycDoc' src='"+v.additionalField.documentName+"' alt='Kyc Document' style='cursor:pointer' width='100' height='100' \n" +
                                 " onclick=\"showDialog('"+v.additionalField.documentName+"','"+v.additionalField.documentId+"',1,'"+ v.additionalField.personId +"');\" title='Preview File'/>"
                     }

                    g +='</td>';
                    g += '<td style="vertical-align: middle">' +formatResultValue ( v.additionalField.passportExpiry, response.query )+ '</td>';
                    g += '<td style="vertical-align: middle">' + v.additionalField.currentStatus + '</td>';
                    g += '<td style="vertical-align: middle">' + v.additionalField.userAction + '</td>';
                    g += '<td style="vertical-align: middle">' + v.additionalField.kycAction + '</td>';
                    g += '</tr>';
                });

                if (pageIndex == 0) {
                    $("#autoresult").html(g);
                } else {
                    $("#autoresult").append(g);
                }
            } else {
                if (nexxo.personDetailList.records == 0) {
                    if (pageIndex == 0) {
                        $("#autoresult").append("<tr><td colspan='4'></td><td colspan='5'>No records to display</td></tr>");
                    } else {
                        $('div#loadmoreajaxloader').html('<center>No more records to display.</center>');
                    }
                }
            }
        }

        requestCompleted = true;

        $("a#rejectAction, a#authAction").each(function (event) {
            $(this).click(function (event) {
                var _recordId = $(this).parents('tr').attr('record_id');
                var _currentStatusId = $(this).parents('tr').attr('status_id');
                var _newStatusId = ('rejectAction' == $(this).attr("id")) ? 6 : 5;

                var data = {
                    personId: _recordId,
                    statusId: _currentStatusId,
                    newStatusId:_newStatusId
                };

                $.ajax({
                    type:'POST',
                    dataType: "json",
                    url: "/personRecord/updateKYCStatus",
                    data: data,
                    success: window.location.href = "/personListPage",
                    async:false
                });
            });
        });

        $("a#blockUserAction, a#activateUserAction").each(function (event) {
                    $(this).click(function (event) {
                        var _recordId = $(this).parents('tr').attr('record_id');
                        if($(this).attr("id") == 'blockUserAction'){
                            var _newStatusId = 4;
                        } else if($(this).attr("id") == 'activateUserAction'){
                            var _newStatusId = 3;
                        }

                        var data = {
                            personId: _recordId,
                            newStatusId:_newStatusId
                        };

                        $.ajax({
                            type:'POST',
                            dataType: "json",
                            url: "/personRecord/updatePersonStatus",
                            data: data,
                            success: window.location.href = "/personListPage",
                            async:false
                        });
                    });
                });
    }

    return {
        init: function(){
            'use strict';
            pageIndex = -1;
            nexxo.personDetailList.setup();
        },setup: function () {
            $(document).ready(function () {
                reloadPersonStatus();
                bindScrollOnPersonList();
                nexxo.personDetailList.bindClickFunction();
                nexxo.personDetailList.personListSortFunction();
                getPersonListSuggestions(false);
            });
        },resetAndRetrieve: function () {
            $("#autoresult").html("") ;
            pageIndex = -1;
            getPersonListSuggestions(true);
        },bindClickFunction:function(){

            $("select#statusId").on('change',function(e){
                nexxo.personDetailList.resetAndRetrieve();
            });

            $("input#searchString").keypress(function (e) {
                if (e.which == 13) { nexxo.personDetailList.resetAndRetrieve(); }
            });

            $("#filterBtn").click(function(){
                nexxo.personDetailList.resetAndRetrieve();
            });

            $('a#downloadFile').on('click', function(){
                var docId = $(this).val();
                var docTypeId = $('#downloadFile').attr("docTypeId");
                var encryptedId = $('#downloadFile').attr("encryptedId");
                window.location.href="/downloadDoc/"+docId+"/"+encryptedId+"/"+docTypeId;
                return false;
            });

        },personListSortFunction: function () {
            $("table>thead>tr>th" ).each(function( index ){
                var $this=$(this);
                var sortable= $this.attr("data-sortable");
                if (typeof sortable !== typeof undefined && sortable !== false){
                    if(!(sortable==="false")) {
                        $this.css("cursor","pointer");
                        var $default=$this.attr("data-sort-default");
                        if(typeof $default !== typeof undefined && $default !== false){
                            $this.append ( '&nbsp;<i class="fa fa-arrow-down"></i>' ) ;
                            $this.addClass("currentSort");
                            var $parent=$ ( this).closest('table');
                            var $s= $('<input>').attr('type','hidden' ).attr("id","sorter-"+$parent.attr("id")).appendTo('body')
                            $s.val($this.attr("data-sort-name")+" "+"desc");
                        }
                        else{
                            $ ( this ).append ( '&nbsp;<i class="fa"></i>' ) ;
                        }
                    }
                }
            });

            $("table>thead>tr>th").click(function(event) {
                if(true)
                {
                    var $this = $(event.target);
                    var caretDown = 'fa-arrow-up';//'fa-caret-down';
                    var caretUp = 'fa-arrow-down';//'fa-caret-up';
                    if ($this.is("i")) {
                        $this = $this.parent();
                    }
                    var $parent = $this.closest('table');
                    var $s = $("#sorter-" + $parent.attr("id"));
                    if (!($s.length > 0)) {
                        $('<input>').attr('type', 'hidden').attr("id", "sorter-" + $parent.attr("id")).appendTo('body');
                        $s = $("#sorter-" + $parent.attr("id"))
                    }
                    var sortable = $this.attr("data-sortable");
                    if (typeof sortable !== typeof undefined && sortable !== false) {
                        if (!(sortable === "false")) {
                            if ($this.hasClass("currentSort")) {
                                var $i = $this.find("i");
                                if ($i.hasClass(caretUp)) {
                                    $i.removeClass(caretUp).addClass(caretDown);
                                    $s.val($this.attr("data-sort-name") + " " + "asc");
                                }
                                else if ($i.hasClass(caretDown)) {
                                    $i.removeClass(caretDown).addClass(caretUp);
                                    $s.val($this.attr("data-sort-name") + " " + "desc");
                                }
                            }
                            else {
                                $s.val($this.attr("data-sort-name") + " " + "asc");
                                $parent.find(".currentSort").each(function (index) {
                                    $(this).find("i").removeClass(caretUp).removeClass(caretDown);
                                    $(this).removeClass("currentSort");
                                });
                                $this.find("i").addClass(caretDown).removeClass(caretUp);
                                $this.addClass("currentSort");
                            }
                        }
                    }
                    pageIndex = -1;
                    $("div#PersonListPanel").find("#autoresult").html("");
                    if (requestCompleted) {
                        getPersonListSuggestions(false);
                    }
                }
            });
        }
    }
}());
