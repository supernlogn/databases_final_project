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

$sql_query= "SELECT distinct Planet FROM SpaceStation";

if ($result->num_rows > 0){
	while($row= $result->fetch_row()){
		printf("<option value=\"%s\">%s</option>\n", $row, $row);
	}
}
mysqli_close($con);
?>
</body>
</html>
