<?php 
$rows = json_decode($_POST["rows"]);

$file = fopen('../tmp/export.tsv', 'w');

foreach($rows as $row) {
	fputcsv($file, $row, "\t", "\"");
}

fclose($file);

echo "Exported";

?> 