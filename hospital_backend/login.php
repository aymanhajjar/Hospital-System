<?php
header('Access-Control-Allow-Origin: *');
include('connection.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$email = $_POST['email'];
$password = $_POST['password'];

$query = $mysqli->prepare('select u.id,u.name,u.password,ut.name from users u join user_types ut on u.usertype_id = ut.id where email=?');
$query->bind_param('s', $email);
$query->execute();

$query->store_result();
$num_rows = $query->num_rows();
$query->bind_result($id, $name, $hashed_password, $user_type);
$query->fetch();
$response = [];

if($num_rows > 0) {
    if(password_verify($password, $hashed_password)) {
        $jwt_token = generateJWT($id, $user_type);
        $response['status'] = 'logged in as ' . $user_type;
        $response['type'] = $user_type;
        $response['jwt'] = $jwt_token;
        echo json_encode($response);
    }} else {
        $response['status'] = 'failed to log in';
        echo json_encode($response);
    }

function generateJWT($id, $user_type) {
    $header = [
        'typ' => 'JWT',
        'alg' => 'HS256'
    ];

    $payload = [
        'id' => $id,
        'type' => $user_type,
        'iat' => time(),
        'exp' => time() + 60*60
    ];

    $secret_key = 'oD4#4Z7#Qk1nL@&n65mGc$5S';

    $headers_encoded = base64url_encode(json_encode($header));
    $payload_encoded = base64url_encode(json_encode($payload));
	
	$signature = hash_hmac('SHA256', "$headers_encoded.$payload_encoded", $secret_key, true);
	$signature_encoded = base64url_encode($signature);
	
	$jwt = "$headers_encoded.$payload_encoded.$signature_encoded";

    return $jwt;
}

function base64url_encode($str) {
    return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
}
?>