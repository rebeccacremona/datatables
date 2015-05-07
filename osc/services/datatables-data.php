<?php

include('drupal-auth.php');
include('config.php');

// 
// MAIN
//

	foreach($sources["json"] as $path){
		$json_records = OSC_load_json($path);
		OSC_add_json($json_records,$combined_records);
	}

	foreach($sources["sqlite"] as $db){
		$sqlite_records = OSC_load_sqlite($db[0], $db[1], $db[2], $db[3]);
		OSC_add_sqlite($sqlite_records,$combined_records);
	}

	foreach($sources["tsv"] as $file){
		OSC_add_tsv($file[0], $file[1], $combined_records);
	}

	echo json_encode(array_values($combined_records));
	

// 
// FUNCTION DEFINITIONS
// 

	// loads a json record set
	// ... expected json format: [{"id":id,"values":{key:value,key:value...}},{...},{...}]
	function OSC_load_json($path) {
		return json_decode(file_get_contents($path), true);
	}

	// loads a sqlite record set
	// ... from one table only
	// ... produces an associative array, in the format:
	// ... array( id => array( "0" => array(key => value, key => value....)  ), id => array( "0" => array(...) ) )
	// ... and yes, there's an unnecessary level there, the array with one key, always "0"
	// ... but this is the best solution offered by PDO. 
	function OSC_load_sqlite($path, $table, $id_field, $fields){
		 
		$fields_joined = join(", ", $fields);

		// in real life, you'd want to put in a try/catch blog and log errors
		$db = new PDO('sqlite:' . $path);
		$sql = "SELECT ".$id_field.",".$fields_joined." FROM ".$table." GROUP BY id";

		$prepared = $db->prepare($sql);
		$prepared->execute();
		
		return $prepared->fetchAll(PDO::FETCH_GROUP|PDO::FETCH_ASSOC);
	}

	// adds already-loaded json record set to the data 
	function OSC_add_json(&$source, &$destination){
		foreach($source as $record){
			$id = $record["id"];

			if(isset($destination[$id])){
				foreach($record["values"] as $key => $value){
					$destination[$id]["values"][$key] = $value;
				}
			} else {
				$destination[$id] = array("id" => $id, "values" => array());
				foreach($record["values"] as $key => $value){
					$destination[$id]["values"][$key] = $value;
				}
			}		
		}
	}

	// adds already-loaded sqlite record set to the data 
	function OSC_add_sqlite(&$source, &$destination){
		foreach($source as $id => $values){

			if(isset($destination[$id])){
				foreach( $values[0] as $key => $value){
					$destination[$id]["values"][$key] = $value;
			 	}
			} else {
				$destination[$id] = array("id" => $id, "values" => array());
				foreach( $values[0] as $key => $value){
					$destination[$id]["values"][$key] = $value;
			 	}
			}		
		}
	}

	// loads AND adds tsv records to the data
	// ...requires tsv file to include a header row
	function OSC_add_tsv($path, $id_field, &$destination){
		if (($handle = fopen($path, "rU")) !== FALSE) {
		    
		    // Get the headers. Find the id field, and unset it.
		    $headers = fgetcsv($handle, 0, "\t");
		    $id_index = array_search($id_field, $headers);
		    unset($headers[$id_index]);


		    // Get the records. Load them into the (passed in) array.
		    // ... Expected format of passed in array:
			// ... array( id => array( "id" => id, "values" => array (key=>value,key=>value...)), id => array ("id"=> id, "values" => array(...)) )
		    while (($record = fgetcsv($handle, 0, "\t")) !== FALSE) {
			    
			    // Get the record id, then remove it from the values array
			    // ...using unset rather than pop or similar to prevent array reindexing
			    $id = $record[$id_index];
			    unset($record[$id_index]);


			    if(isset($destination[$id])){
					foreach($record as $key => $value){
						$destination[$id]["values"][$headers[$key]] = $value;
					}
				} else {
					$destination[$id] = array("id" => $id, "values" => array());
					foreach($record as $key => $value){
						$destination[$id]["values"][$headers[$key]] = $value;
					}
				}
		    }
		    
		    fclose($handle);
		}
	}

	
// TESTS
// 
// Instructions: 
// 1) remove <script> var data_json = from the first line of this file
// 2) comment out the "echo the data" line
// 2) uncomment ONE of the tests
// 3) load data.php in your browser (not index.php)
// 

	// TEST: verify the json loads. 
	// Should print ids and aas.
	// 
	// foreach($json_records as $record){
	// 	$id = $record["id"];
	// 	foreach($record["values"] as $key => $value){
	// 		print($id." ".$key.": ".$value."<br>");
	// 	}
	// }	

	// TEST: verify the database records load
	// Should print ids, tags, and comments (most tags/comments are blank)
	// 
	// foreach($sqlite_records as $key => $value){
	// 		$values = $value[0];	
	// 		foreach($sqlite_fields as $field)
	// 		print($key." ".$field." ".$values[$field]."<br>");
	// }

	// TEST: verify the tsv loads
	// Should print data from any non-tsv sources, then...
	// ...first_name, last_name, email, OA_faculty?, and latin 
	// 
	// foreach($combined_records as $record){
	// 	$id = $record["id"];
	// 	foreach($record["values"] as $key => $value){
	// 		print($id." ".$key.": ".$value."<br>");
	// 	}
	// }

	// TEST: the data gets combined
	// Should print ids, aas, tags, comments (most tags/comments are blank)
	// ...first_name, last_name, email, OA_faculty?, and latin 
	// 
	// foreach($combined_records as $record){
	// 	$id = $record["id"];
	// 	foreach($record["values"] as $key => $value){
	// 		print($id." ".$key.": ".$value."<br>");
	// 	}
	// }

?>
