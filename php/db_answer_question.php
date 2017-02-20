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
$conn= new mysqli('localhost','admin','password','Space_Engaged');
if ($conn->connect_error){
	die("Connection failed: ".$conn->connect_error);
}

// Only questions without arguments like this:
$qid= intval($_GET['qid']);
$sql_query= "call q".$qid."()";
$result= $conn->query($sql_query);

if ($result->num_rows > 0){
	echo "<table>";
	// Print column names
	echo "<tr>";
	while($colinfo= $result->fetch_field()){
		//echo "<th>".$colinfo->name."</th>";
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

/*
mysqli_close($con);*/
?>
</body>
</html>
