<?php

function getJSONTableNames() {
	$conn= new mysqli('localhost','admin','password','Space_Engaged');
	if ($conn->connect_error){
		die("Connection failed: ".$conn->connect_error);
	}

	$sql_query= "SHOW tables";
	$result= $conn->query($sql_query);

	$tableNames= array();
	if ($result->num_rows > 0){
		while($row= $result->fetch_row()){
			array_push($tableNames, $row[0]);
		}
	}
	mysqli_close($conn);
	$tableNamesStr= json_encode($tableNames);
	$tableNamesSuper= array("tableName"=>"tableNames", "tableData"=>$tableNamesStr);
	return json_encode($tableNamesSuper, JSON_FORCE_OBJECT);
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
