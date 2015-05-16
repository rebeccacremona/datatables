<?php 

if ($_SERVER['HTTP_HOST'] != 'localhost:8888') {
  error_reporting(E_ERROR);

  // clue from https://api.drupal.org/comment/30788#comment-30788
  $cwd = getcwd();
  define('DRUPAL_ROOT', '/home/osc/prod/htdocs');
  chdir(DRUPAL_ROOT);
  global $base_url;
  $base_url = 'http://'.$_SERVER['HTTP_HOST'];
  require_once './includes/bootstrap.inc';
  drupal_bootstrap(DRUPAL_BOOTSTRAP_SESSION);
  // necessary?
  chdir($cwd);

  $json_user = array();
  $json_user['id'] = $user->uid;

  if ( $user->uid != 0 ) {
    $json_user['roles'] = $user->roles;
    $allowed = array('developer', 'staff', 'liaison');
    $flag = 0;
    foreach ($json_user['roles'] as $role) {
      //error_log($role);
      foreach ($allowed as $ok) {
	if ($role == $ok) {
          $flag = 1;
          //error_log("role is ok: " . $role);
	}
      }
    }
    if ($flag == 0) {
      //error_log("role is not ok");
      exit;
    }
  } else {
    //error_log("not logged in");
    exit;
  }
}
?>
