<?php
// On force les headers AVANT TOUT
header("Access-Control-Allow-Origin: *"); // Autorise TOUT le monde (pour le dev)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Réponse immédiate pour le Preflight (le truc qui bloque dans ta console)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (isset($data['login']) && isset($data['password'])) {
    $login = $data['login'];
    $mdp = $data['password'];

    $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE login = ?");
    $stmt->execute([$login]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // TEST DE SECOURS : On accepte "1234" peu importe le hash
    if ($user && ($mdp === "1234" || password_verify($mdp, $user['password']))) {
        echo json_encode([
            "success" => true,
            "role" => $user['role'],
            "username" => $user['login']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Identifiants incorrects"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Donnees incompletes"]);
}