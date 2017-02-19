<?php

function getJSONTableNames() {
    $a = array('name1','name2');
    
    return json_encode($a);
}
try {    
    switch (htmlspecialchars($_GET["requestData"])) {
        case 'tableNames':
            echo getJSONTableNames(); //send json file containing the table names
            break;
        default:
            echo "default";
            # code...
            break;
    }
} catch (Exception $e) {
    echo 'GET';
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}

?>