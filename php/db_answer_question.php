<!-- https://www.w3schools.com/php/php_ajax_database.asp -->
<!DOCTYPE html>
<html>
<head>
<style>
	table {
			width: 100%;
			border-collapse: collapse;
	}
	table, td, th {
			border: 1px solid black;
			padding: 5px;
	}
	th {text-align: left;}
</style>
</head>
<body>

<?php
	function debug_to_console( $data ) {
		if ( is_array( $data ) )
			$output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
		else
			$output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";
		echo $output;
	}

	$conn= new mysqli('localhost','admin','password','Space_Engaged');
	if ($conn->connect_error){
		die("Connection failed: ".$conn->connect_error);
	}

	$qid= intval($_GET['qid']);
	if ($qid != 6 && $qid != 8) {
		$sql_query= "call q".$qid."()";
	} else {
		$args= $_GET['args'];
		$sql_query= sprintf("call q%s(%s)", $qid, $args);
	}
		//debug_to_console($sql_query);

	$result= $conn->query($sql_query);

	/*	$tableNames= array();
	if ($result->num_rows > 0){
		while($row= $result->fetch_row()){
			array_push($tableNames, $row[0]);
		}
	}
	mysqli_close($conn);
	$tableNamesStr= json_encode($tableNames);
	$tableNamesSuper= array("tableName"=>"tableNames", "tableData"=>$tableNamesStr);
	echo json_encode($tableNamesSuper, JSON_FORCE_OBJECT);
	*/

	if ($result->num_rows > 0){
		echo "<table>";
		// Print column names
		echo "<tr>";
		while($colinfo= $result->fetch_field()){
			printf("<th>%s</th>", $colinfo->name);
		}
		echo "</tr>";

		// print rows (per field)
		while($row= $result->fetch_row()){
			echo "<tr>";
			for($field=0; $field < $result->field_count; $field++){
				printf("<td>%s</td>", $row[$field]);
			}
			echo "</tr>";
		}
		echo "</table>";
	} else {
		echo "0 results";
	}
	mysqli_close($conn);
?>
</body>
</html>
