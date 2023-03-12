<?php
header('Access-Control-Allow-Origin: *');
include('connection.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$full_name = $_POST['full_name'];
$email = $_POST['email'];
$dob = $_POST['date_of_birth'];
$password = $_POST['password'];
$user_type = $_POST['user_type'];
$gender = $_POST['gender'];

if($user_type == 'employee') {
    $ssn = $_POST['ssn'];
    $position = $_POST['position'];
    $date_joined = $_POST['date_joined'];
    $hospital = $_POST['hospital'];
    if($hospital == 'no') {
        $hospital_id = 1;
    } else {
        $hos_query = $mysqli->prepare('select id from hospitals where name = ?');
        $hos_query->bind_param('s', $hospital);
        $hos_query->execute();
        $hos_query->store_result();
        $hos_query->bind_result($hospital_id);
        $hos_query->fetch();
    }
}

$check_email = $mysqli->prepare('select email from users where email=?');
$check_email->bind_param('s', $email);
$check_email->execute();
$check_email->store_result();
$email_exists = $check_email->num_rows();

if($email_exists > 0) {
    $response['status'] = 'email already exists';
    echo json_encode($response);
} else {

    // if(strlen($password) >= 8 && preg_match('/[A-Z]/', $password) && preg_match('/\d/', $password) && preg_match('/[!@#$%^&*()\-_=+{};:,<.>]/', $password)
    // && preg_match('/[a-z]/', $password)) {
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $query = $mysqli->prepare('insert into users(name, email, password, date_of_birth, gender, usertype_id) values(?,?,?,?,?,?)');

        $usertype_id = $mysqli->prepare('select id from user_types where name = ?');
        $usertype_id->bind_param('s', $user_type);
        $usertype_id->execute();
        $usertype_id->store_result();
        $usertype_id->bind_result($id);
        $usertype_id->fetch();

        $query->bind_param('sssssi', $full_name, $email, $hashed_password, $dob, $gender, $id);
        $query->execute();
        $user_id = $mysqli->insert_id;

        $jwt_token = generateJWT($user_id, $user_type);

        if($user_type == 'employee') { 
            $emp_info = $mysqli->prepare('insert into employees_info (user_id, ssn, date_joined, position, hospital_id) values(?,?,?,?,?)');
            
            $get_id = $mysqli->prepare('select id from users where name = ?');
            $get_id->bind_param('s', $full_name);
            $get_id->execute();
            $get_id->store_result();
            $get_id->bind_result($user_id);
            $get_id->fetch();

            $emp_info->bind_param('isssi', $user_id, $ssn, $date_joined, $position, $hospital_id);
            $emp_info->execute();  
        }
        $response['status'] = 'user added';
        $response['jwt'] = $jwt_token;
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