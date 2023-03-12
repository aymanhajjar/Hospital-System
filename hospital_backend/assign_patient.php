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
    $patient_id = $_POST['patient_id'];
    $hospital_id = $_POST['hospital_id'];

    $check_patient = $mysqli->prepare('select user_id from hospital_users where user_id=?');
    $check_patient->bind_param('i', $patient_id);
    $check_patient->execute();
    $check_patient->store_result();
    $patient_exists = $check_patient->num_rows();

    if($patient_exists> 0) {
        $update_hospital = $mysqli->prepare('update hospital_users set is_active=?, date_left= ? where user_id=?');
        $date_left = time();
        $is_active = 'false';
        $update_hospital->bind_param('ssi', $is_active, $date_left, $patient_id);
        $update_hospital->execute();

        $update_hospital = $mysqli->prepare('insert into hospital_users (hospital_id, user_id, is_active, date_joined) values (?,?,?,?)');
        $date_joined = time();
        $is_active = 'true';
        $update_hospital->bind_param('iiss', $hospital_id, $patient_id, $is_active, $date_joined);
        $update_hospital->execute();

        $response['status'] = 'entry updated and new entry added';
        echo json_encode($response);
    } else {
        $update_hospital = $mysqli->prepare('insert into hospital_users (hospital_id, user_id, is_active, date_joined) values (?,?,?,?)');
        $date_joined = time();
        $is_active = 'true';
        $update_hospital->bind_param('iiss', $hospital_id, $patient_id, $is_active, $date_joined);
        $update_hospital->execute();

        $response['status'] = 'entry added';
        echo json_encode($response);
    }
} else {
    $response['status'] = 'wrong signature';
    echo json_encode($response);
}

$current_time = time();
$expiration_time = $decoded_payload->exp;
if ($expiration_time < $current_time) {
    $response['status'] = 'expired token';
    echo json_encode($response);
}


function base64url_encode($str) {
    return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
}
?>