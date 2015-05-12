// 
// OSC Datatables Config
// 
    
    // OSC.data is configured in config.php

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

    // Table controls:
    // ... top
    // ... bottom
    // ... (undefined defaults to bottom)
    OSC.table_controls = "bottom";

    // Permit column headers to wrap:
    // ... true
    // ... false
    OSC.headers_wrap = false;

    // Responsive?
    // (collapses columns to toggling child rows, when you run out of room)
    // ... true
    // ... false
    OSC.responsive = false;

    // Best practices, defining columns:
    // ... Always include a "defaultContent" attribute. (It's sort/searchable.)
    // ... Always include a "name" attribute. It must be unique. It must not be "q" or start with "SS".
    // ... For performance, specify non-orderable (non-sorting) where possible.
    // ... But, if you disable sort on the first column, do sort by another column by default.
    // ... Please don't specify non-searchable in particular columns.
    // ... To make editable: 
    // ... ... for tag functionality, className must include "tags".
    // ... ... the id created in cellcallback must be formatted 'fieldname_' + rowData.id
    // ... ... supply the db path, table name, and column name in config.php
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
            "render": {
                "display": function(data, type, row, meta){
                    // UX/A11y helper: this column toggles children rows. Make it real buttons, instead of just css buttons
                    return '<button type="button" class="child-control btn-link">' + data + '</button>';            
                }
            }
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
            "className": "tags",
            "createdCell": function( cell, cellData, rowData, rowIndex, colIndex ) {       
              var cell_id = 'tags_' + rowData.id;
              $(cell).attr('id', cell_id ).attr('contenteditable', "true" );
            },
            "render": {
                "display": function( data, type, full, meta) {
                    return OSC.parse_tags(data);
                },
                "filter": function (data, type, full, meta){
                    return OSC.filter_tags(data);
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
