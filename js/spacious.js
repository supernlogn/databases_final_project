

/**
 * 
 * 
 * @param {String} jsonString a string of a json object which is
 *                  an array of records.
 * @param {HtmlElement} container an html container where this table will
 *                      be contained.
 */
function jsonToHtmlTable(jsonString, container) {

    let jsonObject = JSON.parse(jsonString);
    let objectRows = jsonObject.tableData;

    let el = objectRows[0];

    let htmlTableWrapper = document.createElement('div');
        htmlTableWrapper.className = "table-responsive";

    let htmlTable = document.createElement('table');
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

    for(let property in el) {
        th = document.createElement('th');
        th.innerHTML = '' + property;
        headerTr.appendChild(th);
    }
    console.log(headerTr.innerHTML);

    let body = document.createElement('tbody');
    htmlTable.appendChild(body);
    
    i = 0;
    for(let element of objectRows) {
        let tr = document.createElement('tr');
        body.appendChild(tr);
        console.log(element)
        th = document.createElement('th');
        th.scope = "row";
        th.innerHTML = i++;
        tr.appendChild(th);
        for(let val in element) {
            let td = document.createElement('td');
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

function addEventsToRow(bootstrapTable, allowDelete, allowEdit) {
    // let tds = htmlRow.getElementsByTagName('td');
    // for( td in tds) {
    //     tds[td] = tds[td].innerHTML;
    // }
    if(allowDelete) {
        // add an event to POST deletion data at change
        changeHandler = function(rowData, $element) {
            // rowData: the record corresponding to the clicked row, 
            // $element: the tr element.
            $.post( {
                url: "serverApplication.php",  //server script to process data
                data: {rowData:rowData},
                callback: function() {
                    console.log("sucessfull post of table data");
                }.bind($elemeDatant),
                cache: false
            }).done(function() {
                $.get({
                    url: "serverApplication.php",  //server script to process data
                    requestData: "tableData",
                    tablename: bootstrapTable.name,
                    rowData:rowData,
                    cache: false
                })
                
                let tds = $element.getElementsByTagName('td');
                for(i in tds) {
                    tds[i].innerHTML = "1";
                }
            }.bind(htmlRow));
        };
        // and then get data, to update the field at the viewer's side.
    }

    if(allowEdit) {
        // add an event to POST data at change
        // and then get data, to update the field at the viewer's side.
    }

    bootstrapTable.bootstrapTable({
        onClickRow: changeHandler
    });
    
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
