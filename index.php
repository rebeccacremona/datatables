<!DOCTYPE html>
<html lang="en">
  
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>OSC DataTables Template</title>

    <?php include('include_in_head.html') ?>
   
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
          <a class="navbar-brand" href="#"><img height="40" alt="Harvard DASH" src="img/dash_logo.gif"></a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home <span class="sr-only">(current)</span></a></li>
            <li><a href="#">Elsewhere</a></li>
          </ul>
          <form id="global_search_form" class="navbar-form navbar-right" role="search">
            <p class="help navbar-text navbar-right" tabindex="-1" onclick="OSC.dt.overlay()">?</p>
            <div class="form-group">
              <label for="global_search" class="sr-only">Search Table</label>
              <input type="text" id="global_search" class="form-control" placeholder="Search">
            </div>
            <button id="global_search_submit" type="submit" class="btn btn-default">Search</button>
          </form>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>

    <div id="content" tabindex="-1">

        <div class="jumbotron">
          <div class="container">
            <h1>OSC DataTables with Bootstrap</h1>
            <p>A template OSC DataTable, with all the bells and whistles, embedded in a Bootstrap page. With a Jumbotron because.... because everybody needs a Jumbotron.</p>
            <p id="reset"><a class="btn btn-primary btn-lg" href="#" role="button">Do Nothing!</a></p>
          </div>
        </div>
    	
      <div class="loading">...loading...</div>
      
      <div id="table_container" class="container">
      </div> 

  	</div>

    <?php include('include_in_foot.html') ?>
    
  </body>
</html>
