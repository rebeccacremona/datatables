<?php 

include('../../config.php');

if ( !isset($_POST["data"])) {
	$response['error'] = TRUE;
	$response['message'] = "Data required.";
	echo json_encode($response);
	die();    
      
} else {
	
	// Get the data
	$data = json_decode($_POST["data"]);
	
	$path = "../../" . $editable[$data[0]]["path"];
	$table = $editable[$data[0]]["table"];
	$column = $editable[$data[0]]["column"];
	$id_column = $editable[$data[0]]["id"];
	
	$id = $data[1];
    $content= $data[2];
	
	$db = new PDO('sqlite:' . $path);
	$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
      
	if(!$db){
	  $response['error'] = TRUE;
	  $response['message'] = $db->errorInfo();
	  echo json_encode($response);
	  die();
	}

	// Update the database.
      
	// ...create a new row, or update existing one
	$sql_exists = $db->prepare("SELECT {$id_column} FROM {$table} WHERE {$id_column} = :id");
	$sql_exists->execute(array('id' => $id));
	$exists = $sql_exists->fetch(PDO::FETCH_ASSOC);

	if ($exists){
	$sql_update = $db->prepare("UPDATE {$table} SET {$column} = :content WHERE {$id_column} = :id");
	$update = $sql_update->execute(array(':id' => $id, ':content' => $content));

	} else {
	$sql_insert = $db->prepare("INSERT INTO {$table} ({$id_column}, {$column}) VALUES (:id, :content)");
	$update = $sql_insert->execute(array(':id' => $id, ':content' => $content));
	}
      
	// ...check for errors
	if(!$update){
		$response['error'] = TRUE;
		$response['message'] = $db->errorInfo();
		echo json_encode($response);
		die();
	} else {
		$response['error'] = FALSE;
		$response['saved'] = $data[2];
		echo json_encode($response);
	}
}

?> 
