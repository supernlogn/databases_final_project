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
	$tableName= mysqli_real_escape_string($conn, $tableName);	// TODO ???
	$sql_query= "SELECT * FROM ".$tableName;
	$result= $conn->query($sql_query);
	$colFlags= 1;
	if ($result->num_rows > 0){
		$colFlags= $result->fetch_fields();
		for($i= 0; $i<count($colFlags); $i++){
			$colFlags[$i]= $colFlags[$i]->flags & 2;
		}
	} else {
		echo "[pk]: Empty table!";
	}
	return $colFlags;
}
function getColTypes($tableName, $conn){
	$tableName= mysqli_real_escape_string($conn, $tableName);	// TODO ???
	$sql_query= "SELECT * FROM ".$tableName;
	$result= $conn->query($sql_query);
	$colTypes= 1;
	if ($result->num_rows > 0){
		$colTypes= $result->fetch_fields();
		for($i= 0; $i<count($colTypes); $i++){
			$colTypes[$i]= $colTypes[$i]->type;
		}
	} else {
		echo "[pk]: Empty table!";
	}
	return $colFlags;
}
function getColNames($tableName, $conn){
	$tableName= mysqli_real_escape_string($conn, $tableName);
	$sql_query= "SELECT * FROM ".$tableName;
	$result= $conn->query($sql_query);
	$colNames= 1;
	if ($result->num_rows > 0){
		$colNames= $result->fetch_fields();
		for($i=0; $i < count($colNames); $i++) {
			$colNames[$i]= $colNames[$i]->name;
		}
	} else {
		echo "[colnames]: Empty table!";
	}
	return $colNames;
}
function sanitizeDBdata($rowData, $conn){
	$rows= count($rowData);
	for ($i= 0; $i < $rows; $i++) {
		$rowData[$i]= mysqli_real_escape_string($conn, $rowData[$i]);
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
	$tableName= mysqli_real_escape_string($conn, $tableName);
	$rowData= sanitizeDBdata($rowData, $conn);
	$colNames= getColNames($tableName, $conn);
	$pk= getPKcols($tableName, $conn);
	$colTypes= getColTypes($tableName, $conn);

	/*echo 'Column names: ';
	debug_to_console(implode('|',$colNames));
	echo 'PK: ';
	debug_to_console(implode('|',$pk));*/
	
	$sql_query= "UPDATE ".$tableName." SET ";
	// Append all column names and values
	for($i= 0; $i < count($colNames); $i++){
		if ($pk[$i] == 0) {		// Only include if not part of key
			if ($colTypes[$i] < 7){		// If it's arithmetic, no quotes
				$sql_query= $sql_query.'`'.$colNames[$i].'`='.$rowData[$i].',';
			} else {
				$sql_query= $sql_query.'`'.$colNames[$i].'`="'.$rowData[$i].'",';
			}
		}
	}
	$sql_query= substr($sql_query,0,-1)." WHERE ";

	for($i= 0; $i < count($colNames); $i++){
		if ($pk[$i] != 0) {
			if ($colTypes[$i] < 7){		// If it's arithmetic, no quotes
				$sql_query= $sql_query.'`'.$colNames[$i].'`='.$rowData[$i].',';
			} else {
				$sql_query= $sql_query.'`'.$colNames[$i].'`="'.$rowData[$i].'",';
			}
		}
	}
	$sql_query= substr($sql_query,0,-1);

	debug_to_console($sql_query);
	$result= $conn->query($sql_query);
	echo 'Query run';
}
function postDeletion($tableName, $rowData, $conn){
	$tableName= mysqli_real_escape_string($conn, $tableName);
	$rowData= sanitizeDBdata($rowData, $conn);
	$colNames= getColNames($tableName, $conn);
	$pk= getPKcols($tableName, $conn);
	$colTypes= getColTypes($tableName, $conn);

	$sql_query= "DELETE FROM ".$tableName." WHERE ";
	for($i= 0; $i < count($colNames); $i++){
		if ($pk[$i] != 0) {
			if ($colTypes[$i] < 7){		// If it's arithmetic, no quotes
				$sql_query= $sql_query.'`'.$colNames[$i].'`='.$rowData[$i].',';
			} else {
				$sql_query= $sql_query.'`'.$colNames[$i].'`="'.$rowData[$i].'",';
			}
		}
	}
	$sql_query= substr($sql_query,0,-1);

	debug_to_console($sql_query);
	$result= $conn->query($sql_query);
	echo 'Query run';
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
		$rowData= $_POST["rowData"];
		$tableName= $_POST["tableName"];
		echo "[post]";
		//debug_to_console(htmlspecialchars($_POST["deletion"]));
		//debug_to_console(htmlspecialchars($tableName));
		//debug_to_console(htmlspecialchars($rowData[0]));
		//debug_to_console(htmlspecialchars($rowData[1]));
		echo "[post]";
		if (htmlspecialchars($_POST["deletion"]) === 'true') {
			postDeletion($tableName, $rowData, $conn);
			echo "Deleted";
		} else {
			postChange($tableName, $rowData, $conn);
			echo "Changed";
		}
	} catch (Exception $e) {
		echo 'POST';
		echo 'Caught exception: ',  $e->getMessage(), "\n";
	}
}
mysqli_close($conn);
?>
