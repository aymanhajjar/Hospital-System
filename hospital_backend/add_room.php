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

if ($base64_url_signature === $signature) {
    $room = $_POST['room'];
    $department = $_POST['department'];

    $service = $mysqli->prepare('insert into user_rooms (user_id, room_id, 	datetime_entered) values(?,?,?)');
    $date = time();
    $service->bind_param('iis', $decoded_payload->id, $room, $date);
    $service->execute();
    $service->store_result();
    $response['status'] = 'added';
    echo json_encode($response);
} else {
    $response['status'] = 'wrong signature';
    echo json_encode($response);
}

function base64url_encode($str) {
    return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
}
?>