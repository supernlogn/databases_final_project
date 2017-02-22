// https://www.w3schools.com/php/php_ajax_database.asp
/*function answerQuestion(qid, args="") {
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
}*/

function answerQuestion(qid,args=""){
  var eltId= "q" + qid + "-ans";
  $.get({
    url: "php/db_answer_question.php",
    //data: {qid: qid, args: args},
    data: {qid: qid, args: args},
    success: function(a1,a2,resp) {
      if (resp.readyState==4 && resp.status==200) {
        document.getElementById(eltId).innerHTML=resp.responseText;
      }
    }
  });
}

function fetchPlanetNames_asOptions(){
  $.get({
    url: "php/fetchPlanetNames_asOptions.php",
    success: function(a1,a2,resp) {
      if(resp.readyState==4 && resp.status==200) {
        //document.getElementById("planet-dropdown").innerHTML= resp.responseText;
        var d1= document.getElementById("q8_planet_dropdown");
        d1.insertAdjacentHTML("beforeend",resp.responseText);
      }
    }
  });
}
