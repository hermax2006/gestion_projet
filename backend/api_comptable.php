<?php
require 'config.php';

// Action : Modifier l'état de paiement ou de facturation
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    try {
        // Le comptable change l'état d'une phase précise
        $sql = "UPDATE Phase SET etatFacturation = ?, etatPayement = ? WHERE id_phase = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['etatFacturation'], // ex: 'Facturée'
            $data['etatPayement'],    // ex: 'Payé'
            $data['id_phase']
        ]);
        
        echo json_encode(["success" => "Mise à jour financière effectuée"]);
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

// Action : Recherche par période (pour les statistiques du Directeur et du Comptable)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['debut']) && isset($_GET['fin'])) {
    $sql = "SELECT * FROM Phase WHERE dateDeb >= ? AND dateFin <= ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_GET['debut'], $_GET['fin']]);
    echo json_encode($stmt->fetchAll());
}
?>