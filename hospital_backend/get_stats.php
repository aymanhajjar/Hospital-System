<?php
header('Access-Control-Allow-Origin: *');
include('connection.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$number_of_males= $mysqli->prepare('select count(*) as n_males from users where gender = "male" and usertype_id = (select id from user_types where name="employee")');
$number_of_males->execute();
$array = $number_of_males->get_result();
$row = $array->fetch_assoc();
$count_males = $row['n_males'];

$number_of_females= $mysqli->prepare('select count(*) as n_females from users where gender = "female" and usertype_id = (select id from user_types where name="employee")');
$number_of_females->execute();
$array = $number_of_females->get_result();
$row = $array->fetch_assoc();
$count_females = $row['n_females'];

$number_of_patients= $mysqli->prepare('select h.name, count(hu.user_id) as entry_count
from hospital_users hu join hospitals h on hu.hospital_id = h.id where is_active = "true"
GROUP BY hospital_id;');
$number_of_patients->execute();
$array = $number_of_patients->get_result();
while ($a = $array->fetch_assoc()) {
    $hospitals[] = $a;
}

$response = array('count_females' => $count_females, 'count_males' => $count_males, 'hospitals' => $hospitals);

echo json_encode($response);

?>