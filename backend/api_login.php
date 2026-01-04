<?php
// Autoriser React à communiquer avec PHP
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

require 'config.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($data)) {
    
    $login = trim($data['login']);
    $password_saisi = $data['password'];
    
    // --- MODE SECOURS (Si vous voulez entrer sans BDD) ---
    // Si vous tapez admin01 / admin123, on force le passage même si la BDD échoue
    if ($login === "admin01" && $password_saisi === "admin123") {
        echo json_encode([
            "status" => "success",
            "id_user" => 1,
            "login" => "admin01",
            "role" => "admin"
        ]);
        exit;
    }

    try {
        // Tentative via la table 'utilisateurs'
        $sql = "SELECT id_user, login, password, role FROM utilisateurs WHERE login = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$login]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $authenticated = false;
            if ($password_saisi === $user['password'] || password_verify($password_saisi, $user['password'])) {
                $authenticated = true;
            }

            if ($authenticated) {
                echo json_encode([
                    "status" => "success",
                    "id_user" => $user['id_user'],
                    "login" => $user['login'],
                    "role" => $user['role']
                ]);
                exit;
            }
        }
    } catch (Exception $e) {
        // En cas d'erreur SQL (table manquante par exemple), on ne bloque pas si c'est le compte admin secours
    }

    // Échec définitif
    http_response_code(401);
    echo json_encode([
        "status" => "error", 
        "error" => "Identifiants incorrects (Mode Secours: admin01 / admin123)"
    ]);
    
} else {
    echo json_encode(["status" => "error", "error" => "Aucune donnée reçue"]);
}
?>