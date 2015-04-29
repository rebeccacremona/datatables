$(document).ready(function() {
    
// 
// Inserts a placeholder table into the page's #table_container element
// 
    // Prep column filters
    if (OSC.filters !="none"){ 
      var t_footer = '<tfoot><tr>' + Array(OSC.table_columns.length+1).join( '<th><input type="text" aria-label="Table column filter: enter column-specific search text" placeholder="(all)" class="filter_box" /></th>') +'</tr></tfoot>';
    } else {
      var t_footer = "";
    }

    // Prep basic table html
    var t_html = '<h2>'+OSC.table_name+'</h2><div class="filter_wrapper">'+
    '<table id="'+OSC.table_id+'" class="table table-striped table-hover table-bordered" width="100%">' +
        '<caption></caption>'+ 
        "<thead></thead>" +
        t_footer +       
    '</table><a id="reset_filters" href="#">reset filters</a>';

    // Insert
    $('#table_container').html(t_html);


// Define which table control elements DataTables will draw
// ... and the surrounding div structure.
// ... https://datatables.net/reference/option/dom
// 
// This option makes divs like this: <"class">
// 
// Here: decline the built-in search box and create structure for the fancy footer.
// ... eg, "dom": 'tip', with all the Bootstrap structure, plus the fancy footer.
    
    var row_table = '<"row"<"col-sm-12"t>>'; 
    var row_mode_and_pagination = '<"row"<"col-sm-6 col-xs-12 col-sm-push-6"p><"col-sm-6 col-sm-pull-6 col-xs-12 table-mode">>';

    var row_filter_switch = '<"row"<"col-sm-12 filter-format">>';
    var row_export = '<"row"<"col-sm-12 export-table">>';
    var row_entries_length = '<"row"<"col-sm-12"l>>';

    var table_details = '<"table-details"'+ row_filter_switch + row_export + row_entries_length +'>';

    // Allow individual apps to override
    if (!OSC.dom) {
      OSC.dom = row_table + '<"table-footer"'+ row_mode_and_pagination + table_details + '>';
    }

// 
// Make the table a datatable
// ... relies on config specified in the "OSC" array
// ... which is set in this-app.js and/or above
// 
   
    var table = $('#'+OSC.table_id).DataTable( {
        "responsive": true,
        "deferRender": true,

        "data": OSC.data,
        "columns": OSC.table_columns,
        "dom": OSC.dom,

        "language": {
          "paginate": {
            "previous": "&lt;&lt;",
            "next": "&gt;&gt;"
          }
        },
        

        // This callback function adds the record's id as an id to each tr element
        "createdRow": function( row, data, dataIndex ) {
          var row_id = 'row_' + data.id;
          $(row).attr('id', row_id );
        },

        // 
        "drawCallback": function( settings ) {
          var info = this.api().page.info();
          OSC.dt.update_caption(info);
        },
        
    } )  

// ELEMENT: Add the mode switch
    // Technique from https://www.paypal-engineering.com/2014/01/15/a-sweet-toggle-switch/
    $("div.table-mode").html('<div id="table-mode-description">Mode:</div>' +
    '<div id="table-mode-instructions" tabindex="0" class="sr-only sr-only-focusable clearfix">To toggle the switch, press tab again, then use your up/down arrows.</div>' +
    '<div class="switch clearfix"><input type="radio" id="table-mode-basic" name="table-mode" value="basic" class="sr-only" aria-describedby="table-mode-description" />' +
    '<label for="table-mode-basic">Basic</label>' +
    '<input type="radio" id="table-mode-advanced" name="table-mode" value="advanced"   class="sr-only" aria-describedby="table-mode-description"/>' +
    '<label for="table-mode-advanced">Advanced</label></div>');

    // Event listener to toggle table modes
    $("input[name='table-mode']").change(function(e){
      if($(this).val() == 'advanced') {
          $(".table-details").show();
          if (OSC.filters != "none") {$("tfoot").show(); $("#reset_filters").show();}
      } else {
          $(".table-details").hide();
          if (OSC.filters == "basic") {$("tfoot").show(); $("#reset_filters").show();} else {$("tfoot").hide(); $("#reset_filters").hide();}
      }
    });
    
// ELEMENT: Add the filter format switch
    // Technique from https://www.paypal-engineering.com/2014/01/15/a-sweet-toggle-switch/
    
    if (OSC.filters != "none") {

      $("div.filter-format").html('<div id="table-filter-description">Filters:</div>' +
      '<div id="table-filter-instructions" tabindex="0" class="sr-only sr-only-focusable clearfix">To toggle the switch, press tab again, then use your up/down arrows.</div>' +
      '<div class="switch clearfix">'+
      '<input type="radio" id="table-filter-bool" name="table-filter" value="bool"  class="sr-only" aria-describedby="table-filter-description"/>' +
      '<label for="table-filter-bool">Bool</label>'+
      '<input type="radio" id="table-filter-regex" name="table-filter" value="regex" checked="checked" class="sr-only" aria-describedby="table-filter-description" />' +
      '<label for="table-filter-regex">Regex</label>'+
      '</div>');

    }

    OSC.dt.add_instructions();

// ELEMENT: Add an export button
     
      $("div.export-table").html('<form id="tsv_export_form" action ="file.tsv" method="get"><div id="export-table-description" aria-labels="export_tsv">Export:</div>' +
        '<button id="export_tsv" type="submit" class="btn btn-primary">TSV</button></form>');

    
// FEATURE: Load table in correct mode
    
    if (!OSC.advanced_mode) {
      $("#table-mode-basic").prop("checked", "checked").trigger("change");
    } else {
      $("#table-mode-advanced").prop("checked", "checked");
    }


// FEATURE: Apply the column searches

    if (OSC.filters !="none") {

      // For each column:
      table.columns().eq( 0 ).each( function ( colIdx ) {
        
        // When the filter input changes (on blur)
        $( 'input', table.column( colIdx ).footer() ).on( 'blur', function () {
            
          // Determine if boolean or regex search
          var type = ( $(".filter-format input[type='radio']:checked").val() );
          
          if (type == "bool"){
            var query = OSC.bool_to_regex(this.value);
          } else {
            var query = this.value;
          }

          // Deal with incomplete or invalid regex
          try {
            var regex = new RegExp(query);  
  
            // If it's a valid regex... 
            $(this).removeClass("invalid");
              // ...filter...
              table
                .column( colIdx )
                .search( query, true, false )
                .draw();
              
              // ...then push to browser history.
                // Prep search query portion
                if (OSC.search_string && OSC.search_string != "(all records)"){
                  var q_string = "q=" + encodeURIComponent(OSC.html_unescape(OSC.search_string));
                } else {
                  var q_string = "";
                }

                // Prep filters portion
                var f_string = "";
                var filters = table.settings()["0"].aoPreSearchCols;
                var columns = table.settings()["0"].aoColumns;
                for (var i=0, len=columns.length; i < len; i++){
                  var filter_string = filters[i].sSearch;
                  if (filter_string){
                    f_string +=  "&" + encodeURIComponent(columns[i].name) + "=" + encodeURIComponent(filter_string);
                  }
                }
                
                // Assemble and push
                if (q_string) {
                  var assembled = "?" + q_string + f_string;
                  history.pushState(null, "", assembled);
                } else if (f_string){
                  var assembled = "?" + f_string.slice(1);
                  history.pushState(null, "", assembled); 
                }
          }
          catch (err) {
            // ...but if it's invalid, add a css class that makes the field red instead.
            $(this).addClass("invalid");
          }

        } );
      } );

    }

// ELEMENT: Button to reset all the column filters at once

  $("#reset_filters").click(function(){
    event.preventDefault()
    
    $("#table_container tfoot input").val("");
    table.columns().search( '' ).draw();
    
    // ...then push to browser history
    if (OSC.search_string && OSC.search_string != "(all records)"){
      var q_string = "?q=" + encodeURIComponent(OSC.html_unescape(OSC.search_string));
    } else {
      var q_string = "/";
    }
    history.pushState(null, "", q_string);
  });

// FEATURE: Apply a global boolean search to the table

  // This is a bit of a hack...
  // ... anticipating one day we'll have true searching
  // ... not just filtering
  $("#global_search_form").submit(function(event){ 
        event.preventDefault(); 

        var input_element = $("#global_search");
        var input = input_element.val();
             
        // Update the search string (for the caption)
        if (input.trim() == "") {
          OSC.search_string = "(all records)";
        } else {
          OSC.search_string = OSC.html_escape(input);
        } 
          
        // Apply the search
        var query = OSC.bool_to_regex(input);
        table.search( query, true, false );
        
        // Blank the search box, reset filters, draw the table
        input_element.val("");
        $("#table_container tfoot input").val("");
        table.columns().search( '' ).draw();

        // Push to browser history
        var q_string = "?q=" + encodeURIComponent(input.trim());
        history.pushState(null, "", q_string);
              
        
    }); 


// FEATURE: export to TSV

  $("#export_tsv").click(function(){      
        // Prevent the form from submitting
        event.preventDefault();
        
        // Instead, export to tsv, and submit the form
        // ...in the ajax success callback function!
        OSC.dt.export_tsv(table);

  });

// FEATURE: search and filter from URL
  OSC.dt.load_from_URL(table);
  window.onpopstate = function(event) {OSC.dt.load_from_URL(table);};
    

// FEATURE: content editable
  // Event assigned this way since tds are created/destroyed when paged, filtered, etc.
  // https://www.datatables.net/examples/advanced_init/events_live.html
  $('#table_container tbody').on('blur', 'td[contenteditable=true]', function () {
        var id = this.id;
        var d = id.split('_');
        d.push($(this).html());
        d.push(OSC.editable[d[0]].path);
        d.push(OSC.editable[d[0]].table);

        // Format for POSTing to the save.php file
        var to_save = {'data': JSON.stringify(d)};

        // POST!
         var request = $.ajax({
            url: "save.php",
            type: "POST",
            data: to_save,  
            success: function(response){
              var r = $.parseJSON(response);
              if (r.error == true){
                console.error(r.message);
              } else {         
                table.cell("#" + id).data(d[2]);
              }
            }
          });

         request.fail(function( jqXHR, textStatus ) {
            alert( "Request failed: " + textStatus );
         });

    } );

  // Helper for correct rendering of tags
  $('#table_container tbody').on('focus', 'td.tags[contenteditable=true]', function () {
        $(this).html(OSC.reverse_parse_tags($(this).html()));
    } );


} )




// 
//  FUNCTIONS
// 

OSC.dt = {};

OSC.dt.update_caption = function(info){

    var sr_intro = '<span class="sr-only">'+ OSC.table_name +'</span>';

    OSC.filter_info = "Showing " + (info.start+1).toLocaleString() + " to " + info.end.toLocaleString() + 
    " of " + info.recordsDisplay.toLocaleString() + " records";
    var filter_span = "<span class='filter'>" + OSC.filter_info + "</span>";

    if(OSC.search_string){
      var search_info_span = "<span class='search'>Search Results for: " + OSC.search_string + "</span>";
      var new_cap = search_info_span + filter_span;
      $("a#reset_filters").css( "top",  "40px" );
    } else {
      var new_cap = filter_span;
      $("a#reset_filters").css( "top",  "23px" );
    }
    var caption = $("#table_container caption");
    
    caption.html(sr_intro + new_cap);       
       
}


OSC.dt.export_tsv = function(table){

  // Note: we can't use the simpler rows("applied").data
  // ... because values in certain columns might be undefined/null
  // ... and attributes with null values are skipped by JSON.stringify
  // Instead..... 

  // First, let's get the column headers
  // all lowercase for Excel... it objects to files that start with "ID"
  // https://support.microsoft.com/en-us/kb/323626
    var returned_rows = [];
    var headers = [];
    
    var header_nodes = table.columns().header();
    for (var i= 0, len = header_nodes.length; i < len; i++){
      headers.push(header_nodes[i].innerHTML.toLowerCase());
    }
    returned_rows.push(headers);
  
  // Then, get the indices of the currently displayed rows
  // (filtered records, all pages)
    var returned_indices = [];
    table
      .rows({search:'applied'})
      .every(function(table){
          returned_indices.push(this.index());
      })

  // Then, get the rendered values of the cells in each row
  // (i.e. the display value, not the data value)
    for (var i= 0, len = returned_indices.length; i < len; i++){
      var index = returned_indices[i];
      returned_rows.push(table.cells(index, "" , "").render('display').toArray());
    }

  // Format for POSTing to the export.php file
  var to_export = {'rows': JSON.stringify(returned_rows)};

  
  // POST!
  $.ajax({
    url: "tsv_export.php",
    type: "POST",
    data: to_export,  
    success: function(data){
      
      // On success, trigger the submission of the download form
      $("#tsv_export_form").submit();
    }
  });
}

OSC.dt.load_from_URL = function(table){

  // Read in parameters from URL
  var params = OSC.parse_URL();

  if ($.isEmptyObject(params)){
   
    // Reset everything
    OSC.search_string = undefined;
    table.search( "", true, false );
    $("#table_container tfoot input").val("");
    table.columns().search( '' ).draw();
  
  } else {
    
    // Reset the filters
    $("#table_container tfoot input").val("");
    table.columns().search( '' );

    // Apply any global search...
    if (params["q"]) {
      var q = decodeURIComponent(params["q"]);
      var search_query = OSC.bool_to_regex(q);
      delete params["q"];
      table.search( search_query, true, false );

      // ...remembering to update the search string (for the caption).
      if (q.trim() == "") {
        OSC.search_string = "(all records)";
      } else {
        OSC.search_string = OSC.html_escape(q);
      }
    
    // ... or clear the global search.
    } else {
      OSC.search_string = "(all records)";
      table.search( "", true, false );
    }
    
    // Apply any filters.
    var filters = params;
    if (!$.isEmptyObject(filters)) {
      for (var col_name in filters){    
          var column = table.column( col_name + ":name" ); 
          
          // make the text display in the input element   
          $( column.footer() ).children().first().val(decodeURIComponent(filters[col_name]));
          // apply the column search (but don't redraw the table)
          column.search( decodeURIComponent(filters[col_name]), true, false );
      }
    } 
    
    // Finally, (re)draw the table
    table.draw();
  }
}

OSC.dt.add_instructions = function(){
  // Add instructions on how to format your queries
    var instructions = 
    '<div id="instructions"><div>' +      
        '<span class="close"><a href="#" onclick="OSC.dt.overlay()">x</a></span>' +
        '<h2> How to Search </h2>' +
        '<ol>' +
          '<li>' +
           '<p>' +
            'Please wrap each search term in double quotes, and capitalize operators.' +
            '</p>' +
            '<ul>' +
             '<li> "spam" </li>' +
             '<li> "spam" AND "eggs"</li>' +
              '<li> &nbsp;NOT "beans"</li>' +
              '<li> "tomatoes" OR "bacon" OR "potatoes"</li>' +
              '<li> "healthy" OR NOT "tasty"</li>' +
              '<li> "fried eggs" AND "toast" NOT "spam (spam, spam...)"</li>' +
            '</ul>' +
          '</li>' +

          '<li>' +
           '<p>' +
            'You can use parentheses to group terms.... so long as they aren\'t nested.' + 
            '</p>' +
            '<ul>' +
             '<li> ("ham" OR "bacon") AND ("spam")</li>' +
              '<li> ("tomatoes" AND "beans") OR ("spam")</li>' +
              '<li> ("eggs" AND "toast") NOT ("spam" OR "bacon")</li>' +
              '<li class="not-allowed">("eggs" AND ("toast" OR "bacon")) AND ("spam")</li>' +
            '</ul>' +
          '</li>' +

          '<li>' +
           '<p>' +
             'If you use parentheses once, please use them everywhere.' +
            '</p>' +
            '</p>' +
            '<ul>' +
             ' <li class="not-allowed">"eggs" OR ("biscuits" AND "gravy")</li>' +
              '<li>("eggs") OR ("biscuits" AND "gravy")</li>' +
            '</ul>' +
          '</li>' +
        '</ol>' +
        '<p class="close"><a href="#" onclick="OSC.dt.overlay()">Click here to close</a></p>' +
      '</div></div>';

    $('body').append(instructions);
}

// show/hide the instructions
OSC.dt.overlay = function() {
  el = document.getElementById("instructions");
  el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

// Accessibility ToDo:
// Add a callback on redraw, that sets the keyboard focus.... somewhere sensible.
// Child row buttons are not accessible.
// The aria live wrapper element needs to be present on page load, I think.
// Add aria tags that annouce when the sorting has changed.
// See if I can fix the paging interface.
// See if I can get a plain html table to read how I want, in VoiceOver, and then see if I can replicate in DataTables