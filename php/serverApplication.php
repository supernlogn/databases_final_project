<?php

function debug_to_console( $data ) {
	if ( is_array( $data ) )
		$output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
	else
		$output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";
	echo $output;
}

// Returns an bool array with 0/1 for each column
function getPKcols($tableName, $conn){
	$tableName= mysqli_escape_string($conn, $tableName);	// TODO ???
	$sql_query= "SELECT * FROM ".$tableName;
	$result= $conn->query($sql_query);
	if ($result->num_rows > 0){
		$colFlags= $result->fetch_fields()->flags;
		for($i= 0; $i<count($colFlags); $i++){
			$colFlags[$i]= $colFlags[$i] & 2;
		}
	}
}
function sanitizeDBdata($rowData, $conn){
	for ($i=0; $i< count($rowData); $i++) {
		$rowData[i]= mysqli_escape_string($conn, $rowData[i]);
	}
	return $rowData;
}

function getJSONTableNames($conn) {
	$sql_query= "SHOW tables";
	$result= $conn->query($sql_query);

	$tableNames= array();
	if ($result->num_rows > 0){
		while($row= $result->fetch_row()){
			array_push($tableNames, $row[0]);
		}
	}
	$tableNamesStr= json_encode($tableNames);
	$tableNamesSuper= array("tableName"=>"tableNames", "tableData"=>$tableNames);
	return json_encode($tableNamesSuper);
}
function getJSONTableExample() {
	$allObjectsJSON = file_get_contents("example.json");
	return $allObjectsJSON;
}
function getTableData($tableName, $conn) {
	$resultArray = array();
	if ($result = $conn->query("SELECT * FROM " . $tableName)) {
		while($row = $result->fetch_array(MYSQL_ASSOC)) {
			$resultArray[] = $row;
		}
		echo json_encode(array('tableName' => $tableName, 'tableData' => $resultArray));
	}
	$result->close(); 
}

function postChange($tableName, $rowData, $conn){
	$tableName= mysqli_escape_string($conn, $tableName);
	$rowData= sanitizeDBdata($conn, $rowData);
	return;

	$sql_query= "REPLACE INTO ".$tableName." VALUES (".$rowData.")";
	debug_to_console($sql_query);
	//$result= $conn->query($sql_query);
}
function postDeletion($tableName, $rowData, $conn){
}

// END FUNCTIONS

$conn= new mysqli('localhost','admin','password','Space_Engaged');
if ($conn->connect_error){
	die("Connection failed: ".$conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	try {    
		switch (htmlspecialchars($_GET["tableName"])) {
		case 'tableNames':
			echo getJSONTableNames($conn); //send json file containing the table names
			break;
		case 'example':
			echo getJSONTableExample();
			break;
		default:
			echo getTableData($_GET["tableName"], $conn);
			break;
		}
	} catch (Exception $e) {
		echo 'GET';
		echo 'Caught exception: ',  $e->getMessage(), "\n";
	}
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
	try {
		echo "[post]";
		//debug_to_console(htmlspecialchars($_POST["deletion"]));
		echo "[post]";
		if (htmlspecialchars($_POST["deletion"]) === 'true') {
			postDeletion($_POST["tableName"], $_POST["rowData"], $conn);
			echo "Deleted";
		} else {
			postChange($_POST["tableName"], $_POST["rowData"], $conn);
			echo "Changed";
		}
	} catch (Exception $e) {
		echo 'POST';
		echo 'Caught exception: ',  $e->getMessage(), "\n";
	}
}
mysqli_close($conn);
?>
