<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

require_once 'config.php';

// LISTER LES PROJETS
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // On sélectionne l'identifiant numérique 'id_projet'
    $sql = "SELECT id_projet, nom, montant FROM projet"; 
    $stmt = $pdo->query($sql);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// CRÉER UN PROJET
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    try {
        $sql = "INSERT INTO Projet (nom, description, date_debut, montant, id_organisme) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['nom'], 
            $data['description'] ?? '', 
            $data['date_debut'], 
            $data['montant'], 
            $data['id_organisme']
        ]);
        echo json_encode(["status" => "success"]);
    } catch (PDOException $e) {
        header("HTTP/1.1 500 Internal Server Error");
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>