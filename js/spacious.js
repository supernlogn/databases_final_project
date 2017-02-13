

/**
 * 
 * 
 * @param {String} jsonString a string of a json object which is
 *                  an array of records.
 * @param {HtmlElement} container an html container where this table will
 *                      be contained.
 */
function jsonToHtmlTable(jsonString, container) {

    let obj = JSON.stringify(jsonString);
    let el = obj[0];
    let htmlTableWrapper = document.createElement('div');
        htmlTableWrapper.class = "table-responsive";

    let htmlTable = document.createElement('table');
        htmlTable.class = "table table-bordered table-hover table-striped";
        htmlTableWrapper.appendChild(htmlTable);

    let titleThread = document.createElement('thread');
        titleThread.appendChild(document.createElement('tr'));
        htmlTable.appendChild(titleThread);
    let th;

    for(let property in el) {
        th = document.createElement('th');
        th.innerHTML = '' + property;
        titleThread.firstChild.appendChild(th);
    }
    
    let body = document.createElement('tbody');
    htmlTable.appendChild(body);
    
    for(let el of obj) {
        let tr = document.createElement('tr');
        body.appendChild(tr);
        let trInnerHTML = [];
        for(let val of el) {
            trInnerHTML.push('<td>'+val+'</td');
        }
        tr.innerHTML = trInnerHTML.join('');
    }

    let divWrapper  = document.createElement('div');
        divWrapper.class="col-lg-4";
        divWrapper.appendChild(htmlTableWrapper);

    container.appendChild(divWrapper);
}
