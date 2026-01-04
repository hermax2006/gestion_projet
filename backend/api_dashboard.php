<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once 'config.php';

try {
    // On utilise une jointure (LEFT JOIN) pour lier les projets aux phases
    // SUM(ph.montant) calcule le total des phases pour chaque projet
    $query = "SELECT 
                p.id_projet as id_proj, 
                p.nom, 
                p.montant as budget_total, 
                IFNULL(SUM(ph.montant), 0) as budget_consomme 
              FROM projet p
              LEFT JOIN phase ph ON p.id_projet = ph.id_projet
              GROUP BY p.id_projet";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $projets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($projets);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}