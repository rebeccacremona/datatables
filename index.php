<!DOCTYPE html>
<html lang="en">
  
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>OSC DataTables Template</title>

    <?php 
    include('osc/services/drupal-auth.php');
    include('include_in_head.html'); 
    ?>
   
  </head>
  
  <body>
    <a href="#content" class="sr-only sr-only-focusable">Skip to main content</a>
  	<nav class="navbar navbar-default">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#"><img height="40" alt="Harvard DASH logo" src="img/dash_logo.gif"></a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home <span class="sr-only">(current)</span></a></li>
            <li><a href="#">Elsewhere</a></li>
          </ul>
          <form id="global_search_form" class="navbar-form navbar-right" role="search">
            <p class="help navbar-text navbar-right" tabindex="0" data-toggle="modal" data-target="#instructions" aria-label="search help" role="button">?</p>
            <div class="form-group">
              <input type="text" id="global_search" class="form-control" placeholder="Search" aria-label="Enter table search terms...">
            </div>
            <button id="global_search_submit" type="submit" class="btn btn-default">Search</button>
          </form>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>

    <div id="content" tabindex="-1">

        <div class="jumbotron">
          <div class="container">
            <h1>DataTables with Bootstrap</h1>
            <p>A sample DataTable as used by the Harvard Library Office for Scholarly Communication</p>
            <a href="#" class="btn btn-primary">Get the code</a>
          </div>
        </div>
    	
      <div class="loading">...loading...</div>
      
      <!-- 
      For a full-width table, set class="container-fluid"
      For a fixed width container (width determined by Bootstrap, depending on viewport size), set class="container"
      For wide tables, container-fluid is recommended.  
      -->
      <div id="table_container" class="container">
      </div> 

  	</div>

    <?php include('include_in_foot.html') ?>

    <footer></footer>
    
  </body>
</html>
