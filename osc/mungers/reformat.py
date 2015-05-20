def main():
	import json

	# config
	convert = "data.json"
	id_key = "sid"

	# action
	json_data = open(convert)
	data = json.load(json_data)
	reformatted_data = []
	
	for record in data:
		new_record = {}
		new_record["values"] = {}

		new_record["id"] = record[id_key]
		record.pop(id_key, None)
		for item in record:
			new_record["values"][item] = record[item]
		reformatted_data.append(new_record)
	
	target= open("data_reformatted.json", "w")
	target.write(json.dumps(reformatted_data))
	target.close()
	print ("converted!")

main()