<?php
// 1. Les autorisations CORS d'abord
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// 2. Importation (Vérifie bien que le fichier s'appelle config.php)
require_once 'config.php'; 

// 3. Sécurité : Si $pdo n'existe pas, on arrête tout proprement
if (!isset($pdo)) {
    echo json_encode(["error" => "Variable PDO introuvable. Verifie l'import de config.php"]);
    exit;
}

// 4. Lecture des organismes
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM Orgnisme");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (Exception $e) {
        echo json_encode(["error" => "Erreur SQL : " . $e->getMessage()]);
    }
}

// 5. Création d'un organisme
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if(!empty($data['nom'])) {
        try {
            $sql = "INSERT INTO Orgnisme (codeOrg, nom) VALUES (?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['codeOrg'], $data['nom']]);
            echo json_encode(["status" => "success"]);
        } catch (Exception $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
}
?>