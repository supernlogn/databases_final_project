// add an event to POST deletion data at change
$changeHandler = function($element) {
    // rowData: the record corresponding to the clicked row, 
    // $element: the tr element.

    // dont fire the previous wait if you were waiting
    clearTimeout($.data(this, 'timer'));
    var wait = setTimeout(sendDataToServer.bind($element.parentElement), 500); // delay after user types
    $(this).data('timer', wait);
    // TODO
    var sendDataToServer = function ($element) {
        var rowData = [];
        for(let td of $element.children) {
            rowData.append(td.innerHTML);
        }
        rowData.shift(); // remove rowdata

        $.post( {
        url: "serverApplication.php",  //server script to process data
        data: {rowData:rowData},
        success: function() {
            console.log("sucessfull post of table data");
        }.bind($element),
        cache: false
        }).done(function() {
            $.get({
                url: "serverApplication.php",  //server script to process data
                data: {requestData: "tableData",
                tableName: $element.name,
                rowData:rowData},
                success: function(data) {
                    let tds = $element.getElementsByTagName('td');
                    console.log(data) // for debug reasons
                    for(i in tds) {
                        tds[i].innerHTML = "1";
                    }
                },
                cache: false
            });

        }.bind($element));
    }
};
// and then get data, to update the field at the viewer's side.



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

    // $(function() {
    //     $('#' + htmlTable.id).bootstrapTable({
    //         data: objectRows
    //     });
    //     console.log(objectRows);
    // });
    let body = document.createElement('tbody');
    htmlTable.appendChild(body);
    
    i = 0;
    let tr;
    for(let element of objectRows) {
        tr = document.createElement('tr');
        tr.name = jsonObject.tableName;
        body.appendChild(tr);
        console.log(element)
        th = document.createElement('th');
        th.scope = "row";
        th.innerHTML = i++;
        tr.appendChild(th);
        for(let val in element) {
            let td = document.createElement('td');
            td.contentEditable=true;
            // td.attributes.contenteditable = true;
            td.onchange
            td.draggable = true;
            td.innerHTML = element[val];
            tr.appendChild(td);
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
    $.get(
        "serverApplication.php",
        {tableName : tableName},
        function(data) {
            jsonToHtmlTable(data, container);
        }
    ).done();

}


function fetchTableNames() {
    $.get(
        "serverApplication.php",  //server script to process data
        {tableName: "tableNames"},
        function(stringData) {
            let tableDropDownMenu = document.getElementById("TableDropDownMenu1");
            console.log("this is data:" + stringData);
            let data = JSON.parse(stringData);
            for(let tableName of data.tableData ) {
                let li = document.createElement('li');
                li.innerHTML = tableName;
                li.onclick = appendTable.bind(document.getElementById("page-wrapper"), li.innerHTML); 
                tableDropDownMenu.appendChild(li);
            }
        }
    );
}
