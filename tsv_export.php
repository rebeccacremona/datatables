<?php 
$rows = json_decode($_POST["rows"]);

$file = fopen('file.tsv', 'w');

foreach($rows as $row) {
	fputcsv($file, $row, "\t", "\"");
}

fclose($file);

echo "Exported";

?> 