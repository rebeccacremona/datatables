<?php

// 
// DEFINE DATA SOURCES
// 

	// Add json filepaths here.
	// ... Expected json format: 
	// ... [{"id":id,"values":{key:value,key:value...}},{...},{...}]
	 
	$sources["json"] = array("data/mock_data.json","data/mock_data2.json");

	// Add sqlite sources here (reads from one table only).
	// ... Format: 
	// ... $sources["sqlite"][0] = array("example.sqlite","table_name", "id_field_name", array("desired_field", "desired_field", "desired_field") );
	// ... $sources["sqlite"][1] = etc.
	// ... $sources["sqlite"][2] = etc.
	 
	$sources["sqlite"][0] = array("data/mock_data.sqlite","people_editable", "id", array("comments", "tags") );

	// Add tsv sources here (header row required).
	// ... Format:
	// ... $sources["tsv"][0] = array("example.tsv","id_column_header");
	// ... $sources["tsv"][1] = etc.
	// ... $sources["tsv"][2] = etc. 
	// If it doesn't work, check your line-ending format!

	$sources["tsv"][0] = array("data/mock_data.tsv","person_id");
	$sources["tsv"][1] = array("data/mock_data2.tsv","person_id");


// 
// SPECIFY LOCATION OF EDITABLE COLUMNS
//

	// $editable["my_column"] = array (
	// 		"path" => "relative_to_this_file",
	// 		"table" => "my_table",
	// 		"column" => "my_column",
	// 		"id" => "huid",
    // 
	// );

	$editable["tags"] = array( 
		"path" => "data/mock_data.sqlite",
		"table" => "people_editable",
		"column" => "tags",
		"id" => "id"
	);

	$editable["comments"] = array( 
		"path" => "data/mock_data.sqlite",
		"table" => "people_editable",
		"column" => "comments",
		"id" => "id"
	);

?>
