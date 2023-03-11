<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    $host = "localhost";
    $db_user = "root";
    $db_pass = null;
    $db_name = "hospital_db";
    $mysqli = new mysqli($host, $db_user, $db_pass, $db_name);
?>