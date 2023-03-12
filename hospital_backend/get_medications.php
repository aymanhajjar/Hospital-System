<?php
header('Access-Control-Allow-Origin: *');
include('connection.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$hospitals= $mysqli->prepare('select id, name, cost from medications');
$hospitals->execute();

$array = $hospitals->get_result();
$response = [];
while ($a = $array->fetch_assoc()) {
    $response[] = $a;
}
echo json_encode($response);

?>