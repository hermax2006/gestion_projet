<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once 'config.php';

try {
    // Changement : "FROM projet" (singulier) au lieu de "FROM projets"
    $query = "SELECT code as id_proj, nom, montant as budget_total, 0 as budget_consomme FROM projet";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $projets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($projets);
} catch (PDOException $e) {
    http_response_code(500);
    // On affiche l'erreur réelle pour t'aider à débugger
    echo json_encode(["error" => $e->getMessage()]);
}