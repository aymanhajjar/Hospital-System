<?php
header('Access-Control-Allow-Origin: *');
include('connection.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$dep = $_GET['dep_id'];

$rooms= $mysqli->prepare('select id, room_number from rooms where department_id = ?');
$rooms->bind_param('i', $dep);
$rooms->execute();

$array = $rooms->get_result();
$response = [];
while ($a = $array->fetch_assoc()) {
    $response[] = $a;
}
echo json_encode($response);

?>