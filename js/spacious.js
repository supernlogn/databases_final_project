/*
    js sents data to php
    js receives from php

*/
/*
Example data sent by post request
{ 
    tableName: "Example-Table", 
    rowData: [1, 123, 321], 
    deletion: false
}

Example data send by get request
{
    tableName: "Example-Table",
}
Example data received by get request
{
    "tableName": "Example-Table",
    "tableData": [{
        "id": 1,
        "a": 123,
        "b": 321
        },{
        "id": 2,
        "a": 123123,
        "b": 321312
        },{
        "id": 3,
        "a": 124233,
        "b": 333521
        }
    ]
}
*/
$changeHandler = function($rowElement) {
    console.log("Executing changeHandler");   
    // $rowElement: the tr element.
 

    var sendDataToServer = function ($element) {
        var rowData = [];
        for(let td of $element.children) {
            rowData.push(td.innerHTML);
        }
        rowData.pop(); // remove button
        rowData.shift(); // remove rowdata #
        //TODO: Example
        $.post( {
            url: "php/serverApplication.php",  //server script to process data
            data: { tableName: $element.name,
                    rowData: rowData,
                    deletion: false
                  },
            success: function($element) {
                console.log("sucessfull post of table data");
                $.get({ 
                    url: "serverApplication.php",  //server script to process data
                    data: { tableName: $element.name,
                            rowData: rowData},
                    success: function(stringData) {
                        let $element = this;
                        let data = JSON.parse(stringData);
                        let tds = this.getElementsByTagName('td');
                        console.log(data) // for debug reasons
                        let k;
                        for(k = 0; k < length(data.tableData); ++k ) {
                            if(k == $element.firstChild.innerHTML) {
                                break;
                            }
                        }
                        let rowData = data.tableData[k];
                        let j = 0;
                        for(i in tds) {
                            tds[i].innerHTML = rowData[j];
                            j++;
                        }
                    }.bind($element),
                    cache: false
                });            
            }.bind(null, $element),
            cache: false
        });
    }.bind(null, $rowElement);

  // dont fire the previous wait if you were waiting
    clearTimeout($.data(this, 'timer'));
    var wait = setTimeout(sendDataToServer, 500); // delay after user types
    $(this).data('timer', wait);    
}
/*
Example data sent by delete request
{
    tableName: "Example-Table",
    rowData: [1, 123, 321],
    deletion: true
}
*/

$deleteRowHandler = function($rowElement) {
    console.log("deleteHandler");
    //     var rowData = [];
    //     for(let td of $rowElement.children) {
    //         rowData.push(td.innerHTML);
    //     }    
    // console.log({ tableName: $rowElement.name,
    //                 rowData: rowData,
    //                 deletion: true
    //             });
    var sendDataRemovalToServer = function ($element) {
        var rowData = [];
        for(let td of $element.children) {
            rowData.push(td.innerHTML);
        }
        rowData.pop(); // remove button
        rowData.shift(); // remove rowdata #
        //TODO: Example
        $.post( {
            url: "php/serverApplication.php",  //server script to process data
            data: { tableName: $element.name,
                    rowData: rowData,
                    deletion: true
                },
            success: function($element) {
                console.log("sucessfull deletion of table data");
                $rowElement.remove(); // remove html data
            }.bind(null, $element),
            cache: false
        }).done();
    }.bind(null, $rowElement);


  // dont fire the previous wait if you were waiting
    clearTimeout($.data(this, 'timer'));
    var wait = setTimeout(sendDataRemovalToServer, 500); // delay after user types
    $(this).data('timer', wait);      
}

function arrayToHtmlTableRow(tbody, dataArray, tableName, i, addInserBtn) {
    let tr = document.createElement('tr');
    tr.name = tableName;
    tbody.appendChild(tr);
    let th = document.createElement('th');
    th.scope = "row";
    th.innerHTML = i;
    tr.appendChild(th);
    for(let val in dataArray) {
        let td = document.createElement('td');
        td.contentEditable=true;
        td.onkeyup = $changeHandler.bind(td, tr);
        // td.attributes.contenteditable = true;
        // td.onchange
        td.draggable = true;
        td.innerHTML = dataArray[val];
        tr.appendChild(td);
    }
    let buttonTd = document.createElement('td');
        tr.appendChild(buttonTd);
    let deleteBtn = document.createElement('button');
    deleteBtn.type = "button";
    deleteBtn.innerHTML = '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>';
    deleteBtn.className = "btn btn-danger";
    deleteBtn.onclick = $deleteRowHandler.bind(null, tr);
    buttonTd.appendChild(deleteBtn);
    if(addInserBtn) {
        let insertBtn = document.createElement('button');
        insertBtn.type = "button";
        insertBtn.innerHTML = '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>';
        insertBtn.className = "btn btn-success";
        insertBtn.onclick = function(tr, tbody, tableName) {
                                let trs = tbody.getElementsByTagName('tr');
                                let k;
                                for(k = 0; trs[k].firstChild.innerHTML != tr.firstChild.innerHTML; ++k) {
                                }
                                let lineIndex = parseInt(trs[k].firstChild.innerHTML);
                                // for(;k < trs.length; ++k) {
                                //     trs[k].firstChild.innerHTML = parseInt(trs[k].firstChild.innerHTML) + 1;
                                // }
                                let emptyArray = [];
                                for(k = 0; k < trs[0].childElementCount - 2; ++k) {
                                    emptyArray.push("");
                                }
                                arrayToHtmlTableRow(tbody, emptyArray, tableName, trs.length, true);
                                this.remove();
                            }.bind(insertBtn, tr, tbody, tableName);
        buttonTd.appendChild(insertBtn);
    }
    return tr;
}
/**
 * 
 * 
 * @param {String} jsonString a string of a json object which is
 *                  an array of records.
 * @param {HtmlElement} container an html container where this table will
 *                      be contained.
 */
var objectRows;
function jsonToHtmlTable(jsonString, container) {

    let jsonObject = JSON.parse(jsonString);
    objectRows = jsonObject.tableData;

    let el = objectRows[0];

    let htmlTableWrapper = document.createElement('div');
        htmlTableWrapper.className = "table-responsive";

    let htmlTable = document.createElement('table');
        htmlTable.id = 'table_' + jsonObject.tableName;
        htmlTable.className = "table table-bordered table-hover table-striped";
        htmlTableWrapper.appendChild(htmlTable);

    let titleThead = document.createElement('thead');
    let headerTr = document.createElement('tr');
        titleThead.appendChild(headerTr);
        htmlTable.appendChild(titleThead);
    let th;

    th = document.createElement('th');
    th.innerHTML = '#';
    headerTr.appendChild(th);
    let i = 0;
    for(let property in el) {
        th = document.createElement('th');
        th["data-field"] = property;
        // th["data-index"] = i;
        th.data_field = property;
        console.log(property);
        console.log(th);
        console.log(th["data-field"]);
        th.innerHTML = property;
        headerTr.appendChild(th);
    }
    console.log(headerTr.innerHTML);
    console.log(objectRows);

    let body = document.createElement('tbody');
    htmlTable.appendChild(body);
    
    i = 0;
    let tr;
    for(let element of objectRows) {
        if(i == objectRows.length - 1) {
            tr = arrayToHtmlTableRow(body, element, jsonObject.tableName, i++, true); 
        }
        else {
            tr = arrayToHtmlTableRow(body, element, jsonObject.tableName, i++); 
        }
        // tr.innerHTML = trInnerHTML.join('');
   }

    let divWrapper  = document.createElement('div');
        divWrapper.class="col-lg-4";
        divWrapper.appendChild(htmlTableWrapper);

        divWrapper.name = jsonObject.tableName;
        container.appendChild(divWrapper);
}

function appendTable(container, tableName) {
    console.log("called");
    $.get({
        url: "php/serverApplication.php",
        data: {tableName : tableName},
        success: function(data) {
            jsonToHtmlTable(data, container);
        }
    }).done();

}


function fetchTableNames() {
    $.get({
        url: "php/serverApplication.php",  //server script to process data
        data: {tableName: "tableNames"},
        success:function(stringData) {
            let tableDropDownMenu = document.getElementById("TableDropDownMenu1");
            console.log("this is data:" + stringData);
            let data = JSON.parse(stringData);
            for(let tableName of data.tableData ) {
                let li = document.createElement('li');
                let a = document.createElement('a');
                a.innerHTML = tableName;
                li.appendChild(a);
                li.onclick = appendTable.bind(null, document.getElementById("page-wrapper"), a.innerHTML); 
                tableDropDownMenu.appendChild(li);
            }
        }
    });
}
