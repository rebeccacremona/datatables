$(document).ready(function() {   
// 
// Inserts a placeholder table into the page's #table_container element
// 
    // Prep column filters
    if (OSC.filters !="none"){ 
      var t_footer = '<tfoot><tr>' + Array(OSC.table_columns.length+1).join( '<td><form><input type="text" aria-label="Table column filter: enter column-specific search text" placeholder="(all)" class="filter_box" /></form></td>') +'</tr></tfoot>';
    } else {
      var t_footer = "";
    }

    // Prep basic table html
    if (OSC.headers_wrap){
      var classes = "table table-striped table-hover table-bordered  wrap_headers"
    } else {
      var classes = "table table-striped table-hover table-bordered  nowrap_headers"
    }

    var t_html = '<h2>'+OSC.table_name+'</h2><div class="filter_wrapper">'+
    '<table id="'+OSC.table_id+'" class="' + classes + '" width="100%">' +
        "<caption class='sr-only'>" + OSC.table_caption + "</caption>" +
        "<thead></thead>" +
        t_footer +       
    '</table><a role="button" id="reset_filters" href="#">reset filters</a>';

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
    
    
    if (OSC.table_controls=="top"){
      // Technique from http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
      OSC.load_css("osc/assets/datatables-top-controls.css");

      var div_mode_and_pagination = '<"table-mode col-lg-2 col-sm-6"><"col-lg-5 col-lg-push-5 col-sm-6 col-xs-12"p>';
      var div_filter_switch = '<"filter-format">';
      var div_export = '<"export-table">';
      var div_entries_length = '<""l>';
      var table_details = '<"table-details col-lg-5 col-lg-pull-5 col-sm-12"'+ div_entries_length + div_export + div_filter_switch +'>';
    
    } else {
      var row_mode_and_pagination = '<"row"<"col-sm-6 col-xs-12 col-sm-push-6"p><"col-sm-6 col-sm-pull-6 col-xs-12 table-mode">>';
      var row_filter_switch = '<"row"<"col-sm-12 filter-format">>';
      var row_export = '<"row"<"col-sm-12 export-table">>';
      var row_entries_length = '<"row"<"col-sm-12"l>>';
      var table_details = '<"table-details"' + row_filter_switch + row_export + row_entries_length + '>';
    
    }

    var row_table = '<"row"<"col-sm-12"t>>';
    var row_caption = '<"row"<"caption col-sm-12">>';
    
    
    // Allow individual apps to override
    if (!OSC.dom) {
      if (OSC.table_controls=="top"){
        OSC.dom = row_caption + '<"row table-footer"'+ div_mode_and_pagination + table_details + '>' + row_table ;
      } else {
        OSC.dom = row_caption + row_table + '<"table-footer"'+ row_mode_and_pagination + table_details + '>';
      }
    }

// 
// Make the table a datatable
// ... relies on config specified in the "OSC" array
// ... which is set in config.js, config.php and/or above
// 
   
    var table = $('#'+OSC.table_id).DataTable( {
        "responsive": OSC.responsive,
        "deferRender": true,

        "data": OSC.data,
        "columns": OSC.table_columns,
        "dom": OSC.dom,

        "language": {
          "lengthMenu": "Show _MENU_",
          "paginate": {
            "previous": "&lt;",
            "next": "&gt;"
          }
        },
        

        // This callback function adds the record's id as an id to each tr element
        "createdRow": function( row, data, dataIndex ) {
          var row_id = 'row_' + data.id;
          $(row).attr('id', row_id );
        },

        // 
        "drawCallback": function( settings ) {
          // update caption
          var info = this.api().page.info();
          OSC.dt.update_caption(info);
          // handle keyboard focus
          if(OSC.focus){
            OSC.focus.focus();
            delete OSC.focus;
          }
          // enable/disable child row buttons
          OSC.dt.child_btn();
          // fix the table paging buttons
          OSC.dt.pagination(); 
        },
        
    } )  

// ELEMENT: Add the mode switch
    // Technique from https://www.paypal-engineering.com/2014/01/15/a-sweet-toggle-switch/
    $("div.table-mode").attr("role", "menu").html('<div id="table-mode-description">Mode:</div>' +
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
     
      $("div.export-table").html('<form id="tsv_export_form" action ="tmp/export.tsv" method="get"><div id="export-table-description" aria-labels="export_tsv">Export:</div>' +
        '<button id="export_tsv" type="submit" class="btn btn-primary">TSV</button></form>');
   
// FEATURE: Load table in correct mode
    
    if (!OSC.advanced_mode) {
      $("#table-mode-basic").prop("checked", "checked").trigger("change");
    } else {
      $("#table-mode-advanced").prop("checked", "checked");
    }

// FEATURE: Disable advanced mode for sm screens, when using top buttons
// http://krasimirtsonev.com/blog/article/Using-media-queries-in-JavaScript-AbsurdJS-edition

    if(OSC.table_controls=="top"){
      var mq = window.matchMedia('all and (max-width: 758px)');
      if(mq.matches) {
          $("#table-mode-basic").prop("checked", "checked").trigger("change");
          $("div.table-mode").hide();
          // TO DO: decide what to do with filters specified via URL. Reset?
      } 

      mq.addListener(function(changed) {
          if(changed.matches) {
              $("#table-mode-basic").prop("checked", "checked").trigger("change");
              $("div.table-mode").hide();
          } else {
             $("div.table-mode").show();
          }
      });


    }

// FEATURE: Apply the column searches

    if (OSC.filters !="none") {

      // For each column:
      table.columns().eq( 0 ).each( function ( colIdx ) {
        
        // When a filter form is submitted
        $( 'form', table.column( colIdx ).footer() ).on( 'submit', function (event) {
          
          event.preventDefault();

          // Determine if boolean or regex search          
          var input = $("input", this).first();

          // Apply the filter
          var filter = OSC.dt.apply_filter(table, colIdx, input);
            
          // If it worked...
          if (filter) {
            table.draw();
              
            // ...then push to browser history.
            var q_string = OSC.dt.prep_url(table);
            history.pushState(null, "", q_string);

            // ... and set the keyboard focus back on the input element
            input.focus();          
          }
        
        } );
      
      } );

    }

 // FEATURE: Run the column filters when the filter button is clicked 
 $('#table_container tfoot').on('click', 'button.filter_all', function () {
    
    $("#table_container tfoot input").each(function(index){
       OSC.dt.apply_filter(table, index, $(this).first());
     });
    
  table.draw();
              
  // ...then push to browser history.
  var q_string = OSC.dt.prep_url(table);
  history.pushState(null, "", q_string);  

 });

// ELEMENT: Button to reset all the column filters at once

  $("#reset_filters").click(function(event){
    event.preventDefault();
    
    // blank the filter inputs, and remove any "invalid" flags
    $("#table_container tfoot input").val("");
    $("#table_container input").removeClass("invalid");
    
    // reset the datatables filters, redraw the table
    table.columns().search( '' ).draw(); 
    
    // then push to browser history
    var q_string = OSC.dt.prep_url(table);
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
        
        // Blank the search box, reset filters, prep keyboard focus, and draw the table
        OSC.focus = $("#table_container div.caption").first();
        input_element.val("");
        $("#table_container tfoot input").val("");
        table.columns().search( '' ).draw();

        // Push to browser history
        var q_string = OSC.dt.prep_url(table);
        history.pushState(null, "", q_string);
              
        
    }); 

// FEATURE: On "page" event, set the keyboard focus to the caption
  $('#'+ OSC.table_id).on( 'page.dt', function () {
      OSC.focus = $("#table_container div.caption").first();
  } );



// FEATURE: Capture sort order

  // You can't use the built in "sort" event: it fires on every draw.
  // $('#' + OSC.table_id).on( 'order.dt', function (e, settings) {
  //     alert("The table was sorted!");
  // } );
  // Apparently, there will be a dt event for this in DT 2.0
  // http://datatables.net/forums/discussion/5141/capturing-sort-event-on-table-heading

  $("#table_container thead th:not(.sorting_disabled)").on( 'click', function () {
      var q_string = OSC.dt.prep_url(table);
      history.pushState(null, "", q_string);
  } );

// FEATURE: Search and filter from URL
  OSC.dt.load_from_URL(table);
  window.onpopstate = function(event) {
    OSC.dt.load_from_URL(table);
  };

// FEATURE: Export to TSV

  $("#export_tsv").click(function(event){      
        // Prevent the form from submitting
        event.preventDefault();
        
        // Instead, export to tsv, and submit the form
        // ...in the ajax success callback function!
        OSC.dt.export_tsv(table);

  });

// FEATURE: Make specified content editable
  // Event assigned this way since tds are created/destroyed when paged, filtered, etc.
  // https://www.datatables.net/examples/advanced_init/events_live.html
  $('#table_container tbody').on('blur', 'td[contenteditable=true]', function () {
        var id = this.id;
        var d = id.split('_');
        var content = $(this).html()

        // check if content is just a br
        var blank = (content == '<br>');
        if (blank){
           content = "";
        }

        d.push(content);

        // check if content has changed...
        var changed = (table.row("#row_" + d[1]).data().values[d[0]] != content);
        
        if (changed){
          
          // Format for POSTing to the save.php file
          var to_save = {'data': JSON.stringify(d)};

          // POST!
           var request = $.ajax({
              url: "osc/services/datatables-save.php",
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
       
       } else {

        // re-render the cell, so that it displays exactly
        // ... how it did, before contenteditable was triggered
        $(this).html(table.cell("#" + id).render('display'));

       }

    } );

  // Helper for correct rendering of tags
  $('#table_container tbody').on('focus', 'td.tags[contenteditable=true]', function () {
        $(this).html(OSC.reverse_parse_tags($(this).html()));
    } );

// Hide the loading indicator
  $("div.loading").hide();


// FEATURE: UX/A11y helpers: 
//  1) add class to last column filter, and a filter button after it 
//  2) make child row toggles in first row real buttons
//  3) make the caption and pagination divs programmatically focusable
//  4) improve the pagination controls (should be via a plugin, but.... too hard!!)
// Doing it here, so that it happens AFTER "Responsive" redraws the table. No event handler assigned.
  OSC.dt.label_last_filter();
  OSC.dt.child_btn();
  OSC.dt.pagination();
  
  $("#table_container div.caption").attr("tabindex", "-1");
  $("#" + OSC.table_id + "_paginate").attr("tabindex", "-1").attr("role", "navigation").attr("aria-label", "table pages");

  // Redo when "Responsive" hides/shows a column 
  $('#'+OSC.table_id).on( 'column-visibility.dt', function ( e, settings, column, state ) {
      OSC.dt.label_last_filter();
      OSC.dt.child_btn();
      OSC.dt.pagination();
  } );

if (typeof OSC.custom == 'function') { OSC.custom(table); }

} )




// 
//  FUNCTIONS
// 

OSC.dt = {};

OSC.dt.update_caption = function(info){

    var caption = $("#table_container div.caption");

    var skip_link = '<a href="#template_table_paginate" class="sr-only sr-only-focusable" role="button" aria-label="Skip to table navigation">Skip to table navigation</a>';

    OSC.filter_info = "Showing " + (info.start+1).toLocaleString() + " to " + info.end.toLocaleString() + 
    " of " + info.recordsDisplay.toLocaleString() + " records";
    var filter_span = "<span class='filter'>" + OSC.filter_info + "</span>";

    if(OSC.search_string){
      var search_info_span = "<span class='search'>Search Results for: " + OSC.search_string + "</span>";
      var new_cap = search_info_span + filter_span;
      if (OSC.table_controls=="top"){
        caption.html(new_cap);
        $("a#reset_filters").css( "top",  "75px" );
      } else {
        caption.html(new_cap + skip_link);
        $("a#reset_filters").css( "top",  "40px" );
      }
    } else {
      var new_cap = filter_span;
      if (OSC.table_controls=="top"){;
        caption.html(new_cap);
        $("a#reset_filters").css( "top",  "55px" );
      } else {
        caption.html(new_cap + skip_link);
        $("a#reset_filters").css( "top",  "23px" )
      }
    }         
}

OSC.dt.apply_filter = function(table, colIdx, input){
  var type = ( $(".filter-format input[type='radio']:checked").val() );
  
  if (type == "bool"){
    var query = OSC.bool_to_regex(input.val());
  } else {
    var query = input.val();
  }

  // Deal with incomplete or invalid regex
  try {
    var regex = new RegExp(query);  

    // If it's a valid regex... 
    $(input).removeClass("invalid");
      // ...filter...
      table.column( colIdx ).search( query, true, false );
      return true;
      
  } catch (err) {
    // ...but if it's invalid, add a css class that makes the field red instead.
    $(input).addClass("invalid");
    return false;
  }

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
  request = $.ajax({
    url: "osc/services/datatables-tsv-export.php",
    type: "POST",
    data: to_export,  
    success: function(data){
      
      // On success, trigger the submission of the download form
      $("#tsv_export_form").submit();
    }
  });

  request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
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
    
    // Reset the filters and sorts
    $("#table_container tfoot input").val("");
    table.columns().search( '' );
    table.order.neutral();

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
    
    // Apply any filters and sorts.
    var f_and_s = params;
    if (!$.isEmptyObject(f_and_s)) {
      
      var sorts = [];
      for (var param in f_and_s){    
          
          // If it's a sort...
          if (param.slice(0,2)=="SS"){
            var col_name = param.slice(2);
            var column_index = table.column( col_name + ":name" ).index();
            // add to list of sorts to apply
            sorts.push([column_index, f_and_s[param]]);
          } 
          // If it's a filter...
          else {
            var col_name = param;
            var column = table.column( col_name + ":name" ); 
            // make the text display in the input element   
            $( column.footer() ).find("input").first().val(decodeURIComponent(f_and_s[col_name]));
            // apply the column search (but don't redraw the table)
            column.search( decodeURIComponent(f_and_s[col_name]), true, false );
          }          
      }

      // If there are any sorts, apply them (but don't redraw the table)
      if (sorts.length > 0 ){
        table.order(sorts);
      }
    } 
    
    // Finally, (re)draw the table
    table.draw();
  }
}

OSC.dt.add_instructions = function(){
  // Add instructions on how to format your queries
    var instructions = 
    '<div id="instructions" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">' +      
        '<div class="modal-dialog modal-lg">' +
        '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '<h2 class="modal-title" id="ModalLabel"> How to Search </h2>' +
          '</div>' +
        '<div class="modal-body"><ol>' +
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
        '</ol></div>' +
        '<div class="modal-footer">' +
          '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
        '</div>' +
      '</div></div></div>';

    $('body').append(instructions);
}

OSC.dt.prep_url = function(table){

  // Prep search query portion
  if (OSC.search_string && OSC.search_string != "(all records)"){
    var q_string = "q=" + encodeURIComponent(OSC.html_unescape(OSC.search_string));
  } else {
    var q_string = "";
  }

  // Prep filters and sorting portion
  var settings = table.settings()["0"];
  var columns = settings.aoColumns;

    // Filter portion
    var f_string = "";
    var filters = settings.aoPreSearchCols;
    for (var i=0, len=columns.length; i < len; i++){
      var filter_string = filters[i].sSearch;
      if (filter_string){
        f_string +=  "&" + encodeURIComponent(columns[i].name) + "=" + encodeURIComponent(filter_string);
      }
    }

  // Sorting portion
  var s_string = "";
  var sorting = table.order();
  for (var i=0, len=sorting.length; i < len; i++){
        var sorted_column = sorting[i][0];
        s_string +=  "&SS" + encodeURIComponent(columns[sorted_column].name) + "=" + sorting[i][1];  
  }
                
  // Assemble
  if (q_string && f_string && s_string){
    var state = "all";
  } else if (q_string && f_string){
    var state = "q&f";
  } else if (q_string && s_string){
    var state = "q&s";
  } else if (f_string && s_string){
    var state = "f&s";
  } else if (q_string){
    var state = "q";
  } else if (f_string){
    var state = "f";
  } else if (s_string){
    var state = "s";
  }

  switch (state) {
    case "all":
      var assembled = "?" + q_string + f_string + s_string;
      break;
    case "q&f":
      var assembled = "?" + q_string + f_string;
      break;
    case "q&s":
      var assembled = "?" + q_string + s_string;
      break;
    case "f&s":
      var assembled = "?" + f_string.slice(1) + s_string;
      break;
    case "q":
      var assembled = "?" + q_string;
      break;
    case "f":
      var assembled = "?" + f_string.slice(1);
      break;
    case "s":
      var assembled = "?" + s_string.slice(1);
      break;
  }

  return assembled;

}

// UX/A11y helper: add class to last column filter, and a filter button afterwards
OSC.dt.label_last_filter = function(){
    $('tfoot input').removeClass("last_filter").next('button.filter_all').remove();
    var button = '<button class="filter_all" type="button"  aria-label="Filter the table">' +
      '<span class="glyphicon glyphicon-filter" aria-hidden="true"></span>' +
      '</button>';
    $('tfoot input').last().addClass("last_filter").after(button); 
}

// UX/A11y helper: enable/disable the child row toggle buttons
OSC.dt.child_btn = function(){
  if($("table.dataTable").hasClass('collapsed')){
    $("button.child-control").prop('disabled', false);
  } else {
    $("button.child-control").prop('disabled', true);
  }
}

// UX/a11y helper: improve the pagination controls
OSC.dt.pagination = function(){
  
  var sr_most = '<span class="sr-only"> page </span>';
  var sr_active = '<span class="sr-only"> You are currently on page </span>';
  var sr_previous = '<span class="sr-only"> previous page';
  var sr_next = '<span class="sr-only"> next page';

  $("#" + OSC.table_id + "_paginate li").removeAttr("tabindex")
    .not('.active, .disabled, .previous, .next').children().prepend(sr_most);

  $("#" + OSC.table_id + "_paginate li.active").children().prepend(sr_active);
  $("#" + OSC.table_id + "_paginate li.previous").children().prepend(sr_previous);
  $("#" + OSC.table_id + "_paginate li.next").children().prepend(sr_next);
  // When you have lots of pages, and you are on page 5, there will be TWO ellipsis elements,
  // ...both with the same id. Not valid HTML! (It should be a class) This is a workaround.
  $("li[id='" + OSC.table_id + "_ellipsis']").attr("aria-hidden", true);
  
  $("#" + OSC.table_id + "_paginate a").attr("role", "button");
  
}

// The DataTables plugin that allows us to restore sorts to their default
// https://www.datatables.net/plug-ins/api/order.neutral%28%29
$.fn.dataTable.Api.register( 'order.neutral()', function () {
    return this.iterator( 'table', function ( s ) {
        s.aaSorting.length = 0;
        s.aiDisplay.sort( function (a,b) {
            return a-b;
        } );
        s.aiDisplayMaster.sort( function (a,b) {
            return a-b;
        } );
    } );
} );

// Accessibility ToDo:
// This still isn't being read properly......
// See if I can get a plain html table to read how I want, in VoiceOver and ChromeVox, and then see if I can replicate in DataTables