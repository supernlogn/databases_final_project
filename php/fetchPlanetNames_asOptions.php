<html>
<body>
<?php
	$conn= new mysqli('localhost','admin','password','Space_Engaged');
	if ($conn->connect_error){
		die("Connection failed: ".$conn->connect_error);
	}

	$sql_query= "SELECT distinct Planet FROM SpaceStation";
	$result= $conn->query($sql_query);

	if ($result->num_rows > 0){
		while($row= $result->fetch_row()){
			printf("<option value='\"%s\"'>%s</option>\n", $row[0], $row[0]);
		}
	} else {
		echo "No planets available";
	}
	mysqli_close($con);
?>
</body>
</html>
