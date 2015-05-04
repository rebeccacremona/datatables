<?php 

if ( !isset($_POST["data"])) {
	$response['error'] = TRUE;
	$response['message'] = "Data required.";
	echo json_encode($response);
	die();    
      
} else {
	
	// Get the data
	$data = json_decode($_POST["data"]);
	
	$path = $data[3];
	$db = new PDO('sqlite:' . $path);
	$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );

	$column_safe = $db->quote($data[0]);
	$table_safe = $db->quote($data[4]);

    $id = $data[1];
    $content= $data[2];
      
	if(!$db){
	  $response['error'] = TRUE;
	  $response['message'] = $db->errorInfo();
	  echo json_encode($response);
	  die();
	}

	// Update the database.
      
	// ...create a new row, or update existing one
	$sql_exists = $db->prepare("SELECT id FROM {$table_safe} WHERE id = :id");
	$sql_exists->execute(array('id' => $id));
	$sql_exists->rowCount() ? true : false;
	$exists = $sql_exists->fetch(PDO::FETCH_ASSOC);

	if ($exists){
	$sql_update = $db->prepare("UPDATE {$table_safe} SET {$column_safe} = :content WHERE id = :id");
	$update = $sql_update->execute(array(':id' => $id, ':content' => $content));

	} else {
	$sql_insert = $db->prepare("INSERT INTO {$table_safe} (id, {$column_safe}) VALUES (:id, :content)");
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
