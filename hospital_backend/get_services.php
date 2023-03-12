<?php
header('Access-Control-Allow-Origin: *');
include('connection.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$patients= $mysqli->prepare('select s.id, u.name as patient, u2.name as employee, s.description, s.cost, d.name, s.approved from services s join users u on s.patient_id = u.id join users u2 on s.employee_id = u2.id join departments d on s.department_id = d.id');
$patients->execute();
$array = $patients->get_result();

$response = [];
while ($a = $array->fetch_assoc()) {
    $response[] = $a;
}
echo json_encode($response);

?>