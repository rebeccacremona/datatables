<?php 

if ( !isset($_POST["data"])) {
	$response['error'] = TRUE;
	$response['message'] = "Data required.";
	echo json_encode($response);
	die();    
      
} else {
	
	// Get the data
	$data = json_decode($_POST["data"]);

    $column_safe = SQLite3::escapeString($data[0]);
    $id_safe = SQLite3::escapeString($data[1]);
    $content_safe = SQLite3::escapeString($data[2]);
    $path = $data[3];
    $table_safe = SQLite3::escapeString($data[4]);

	// Open the database  
	$db = new SQLite3($path);
      
	if(!$db){
	  $response['error'] = TRUE;
	  $response['message'] = $db->lastErrorMsg();
	  echo json_encode($response);
	  die();
	}

	// Update the database.
      
	// ...create a new row, or update existing one
	$exists = $db->querySingle("SELECT id FROM {$table_safe} where id = {$id_safe}");

	if ($exists){
	$update = $db->exec("UPDATE {$table_safe} SET {$column_safe} = '{$content_safe}' WHERE id = {$id_safe}");
	} else {
	$update = $db->exec("INSERT INTO {$table_safe} (id, {$column_safe}) VALUES ({$id_safe},'{$content_safe}')");
	}
      
	// ...check for errors
	if(!$update){
		$response['error'] = TRUE;
		$response['message'] = $db->lastErrorMsg();
		echo json_encode($response);
		die();
	} else {
		$response['error'] = FALSE;
		$response['saved'] = $data[2];
		echo json_encode($response);
	}
}

// Close the database
$db->close();


?> 