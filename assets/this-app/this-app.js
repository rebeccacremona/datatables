// 
// OSC Datatables Config
// 
    
    // OSC.data is configured in data.php, and loaded in the document head

    OSC.table_id = "template_table";
    OSC.table_name = "The Table";  

    // Column filters: 
    // ... basic (appears on page load), 
    // ... advanced (appears in advanced mode),
    // ... none
    OSC.filters = "basic";

    // Load in advanced mode:
    // ... true/false
    OSC.advanced_mode = false;


    // Best practices, defining columns:
    // ... Always include a "defaultContent" attribute. (It's sort/searchable.)
    // ... Always include a "name" attribute. It must be unique. It must not be "q".
    // ... For performance, specify non-orderable (non-sorting) where possible.
    // ... Please don't specify non-searchable in particular columns.
    // ... To make editable:
    // ... ... className must include "edit". 
    // ... ... for tag functionality, className must include "tags".
    // ... ... the id created in cellcallback must be formatted 'fieldname_' + rowData.id
    // ... ... supply the db path and table name in OSC.editable[fieldname].path and OSC.editable[fieldname].table
    // ... If you care, configure what'll happen at small screen sizes.
    // ... ... https://datatables.net/extensions/responsive/classes
    // ... Hidden columns don't work with the Responsive plugin. Instead,
    // ... ... you can make it a permanent child row by adding className: "none". 
    // ... ... or disapper it with className: "never". But,
    // ... ... consider whether you really need a column. Access the data object directly.
    // ... If slow to load, try reducing number of columns.
    OSC.table_columns = [
        {
            "title": "ID",
            "name": "id", 
            "data": "id", 
            "defaultContent": "(unknown)",
            "orderable": true,
        },
        { 
            "title": "Last Name",
            "name": "last_name", 
            "data": "values.last_name", 
            "defaultContent": "(unknown)",
            "orderable": true,
        },
        { 
            "title": "First Name",
            "name": "first_name", 
            "data": "values.first_name", 
            "defaultContent": "(unknown)",
            "orderable": true,
        },
        { 
            "title": "Email",
            "name": "email", 
            "data": "values.email", 
            "defaultContent": "(unknown)",
            "orderable": false,
        },    
        { 
            "title": "OA Faculty", 
            "name": "oa_faculty",
            "data": "values.OA_faculty?", 
            "defaultContent": "(unknown)",
            "orderable": false,
        },
        { 
            "title": "AA", 
            "name": "aa",
            "data": "values.aa", 
            "defaultContent": "(unknown)",
            "orderable": false,
        },
        { 
            "title": "Comments",
            "name": "comments", 
            "data": "values.comments",
            "render": function(data, type, row, meta){
                return OSC.breaks_to_br(data);
            },
            "defaultContent": "",
            "orderable": false,
            "className": "comments edit",
            "createdCell": function( cell, cellData, rowData, rowIndex, colIndex ) {       
              var cell_id = 'comments_' + rowData.id;
              $(cell).attr('id', cell_id ).attr('contenteditable', "true" );
            }, 
        },
        { 
            "title": "Tags",
            "name":"tags", 
            "data": "values.tags",
            "defaultContent": "",
            "orderable": false,
            "className": "tags edit",
            "createdCell": function( cell, cellData, rowData, rowIndex, colIndex ) {       
              var cell_id = 'tags_' + rowData.id;
              $(cell).attr('id', cell_id ).attr('contenteditable', "true" );
            },
            "render": {
                "display": function( data, type, full, meta) {
                    return OSC.parse_tags(data);
                }
            },
        },
        { 
            "title": "Special",
            "name": "special", 
            "data": "values.special",
            "defaultContent": "(unknown)",
            "orderable": false,
        },
    ];

    OSC.editable = {
        "tags": {
            "path": "data/mock_data.sqlite",
            "table":"people_editable",
        },
        "comments": {
            "path": "data/mock_data.sqlite",
            "table":"people_editable",
        },
    };
