<?php
header('Access-Control-Allow-Origin: *');
include('connection.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$patients= $mysqli->prepare('select u.name as user_name, h.name, hu.date_joined, hu.date_left from hospital_users hu join users u on hu.user_id = u.id join hospitals h on h.id = hu.hospital_id');
$patients->execute();
$array = $patients->get_result();
$response = [];
while ($a = $array->fetch_assoc()) {
    $response[] = $a;
}
echo json_encode($response);

?>