<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

// 1. RÉCUPÉRER LES PHASES
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id_projet'] ?? null;
    if ($id) {
        // On filtre par l'ID du projet que React nous envoie
        $stmt = $pdo->prepare("SELECT * FROM phase WHERE id_projet = ? ORDER BY dateFin ASC");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } else {
        echo json_encode([]);
    }
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // 1. Chercher le projet par 'id_projet' (et non 'code')
    $stmtBudget = $pdo->prepare("SELECT montant FROM projet WHERE id_projet = ?");
    $stmtBudget->execute([$data['id_projet']]);
    $projet = $stmtBudget->fetch();

    if (!$projet) {
        http_response_code(404);
        echo json_encode(["error" => "ID Projet " . $data['id_projet'] . " n'existe pas dans la table projet"]);
        exit;
    }


    $sql = "INSERT INTO phase (dateFin, montant, etatFacturation, etatRealisation, etatPayement, id_projet) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['dateFin'], 
        $data['montant'], 
        $data['etatFacturation'] ?? 'En attente', 
        $data['etatRealisation'] ?? 'Pas commencé', 
        $data['etatPayement'] ?? 'Non payé', 
        $data['id_projet'] // Doit être l'ID réel présent dans la table projet
    ]);
    
    echo json_encode(["message" => "Succès !"]);
}