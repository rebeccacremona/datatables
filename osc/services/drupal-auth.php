<?php 

if ($_SERVER['HTTP_HOST'] != 'localhost:8888') {
  error_reporting(E_ERROR);

  define('DRUPAL_ROOT', '/home/osc/prod/htdocs');
  require_once DRUPAL_ROOT . '/includes/bootstrap.inc';
  drupal_bootstrap(DRUPAL_BOOTSTRAP_SESSION);

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
