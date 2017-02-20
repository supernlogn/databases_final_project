<?php

function getJSONTableNames() {
    $allObjectsJSON = file_get_contents("tableNames.json");
    return $allObjectsJSON;
}
function getJSONTableExample() {
    $allObjectsJSON = file_get_contents("example.json");
    return $allObjectsJSON;
}
try {    
    switch (htmlspecialchars($_GET["tableName"])) {
        case 'tableNames':
            echo getJSONTableNames(); //send json file containing the table names
            break;
        case 'example':
            echo getJSONTableExample();
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