<?php
header('Access-Control-Allow-Origin: *');
include('connection.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$headers = apache_request_headers();
$jwt = $headers['Authorization'];

$secret_key = 'oD4#4Z7#Qk1nL@&n65mGc$5S';

$jwt_elements = explode('.', $jwt);
$encoded_header = $jwt_elements[0];
$encoded_payload = $jwt_elements[1];
$encoded_signature = $jwt_elements[2];

$header = base64_decode($encoded_header);
$payload = base64_decode($encoded_payload);
$decoded_payload = json_decode($payload);
$signature = $encoded_signature;

$base64_url_header = base64url_encode($header);
$base64_url_payload = base64url_encode($payload);
$verified_signature = hash_hmac('SHA256', $base64_url_header . "." . $base64_url_payload, $secret_key, true);
$base64_url_signature = base64url_encode($verified_signature);

if ($base64_url_signature === $signature && $decoded_payload->type == 'admin') {
    $employee_id = $_POST['employee_id'];
    $hospital_id = $_POST['hospital_id'];

    $check_emp = $mysqli->prepare('select user_id from employees_info where user_id=? and hospital_id = ?');
    $check_emp->bind_param('ii', $employee_id, $hospital_id);
    $check_emp->execute();
    $check_emp->store_result();
    $emp_exists = $check_emp->num_rows();

    if($emp_exists == 0) {
        $check_emp = $mysqli->prepare('select user_id, ssn, date_joined, position from employees_info where user_id=?');
        $check_emp->bind_param('i', $employee_id);
        $check_emp->execute();
        $check_emp->store_result();
        $check_emp->bind_result($user_id, $ssn, $date_joined, $position);
        $check_emp->fetch();
        $add_hospital = $mysqli->prepare('insert into employees_info (user_id, ssn, date_joined, position, hospital_id) values (?,?,?,?,?)');
        $add_hospital->bind_param('isssi', $employee_id, $ssn, $date_joined, $position, $hospital_id);
        $add_hospital->execute();


        $response['status'] = 'entry udpated';
        echo json_encode($response);
    }
}

function base64url_encode($str) {
    return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
}
?>