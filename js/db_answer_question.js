// https://www.w3schools.com/php/php_ajax_database.asp
function answerQuestion(qid, args="") {
  var eltId= "q" + qid + "-ans";
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
    if (this.readyState==4 && this.status==200) {
      document.getElementById(eltId).innerHTML=this.responseText;
    }
  }

  if (args == "") xmlhttp.open("GET","php/db_answer_question.php?qid="+qid,true);
  else {
    // TODO
    return;
  }
  xmlhttp.send();
}
