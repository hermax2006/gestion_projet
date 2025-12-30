<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

// 1. RÉCUPÉRER LES PHASES
if ($method === 'GET') {
    $id_proj = $_GET['id_projet'] ?? null;
    if ($id_proj) {
        // On récupère les phases d'un projet spécifique
        $stmt = $pdo->prepare("SELECT * FROM phase WHERE id_projet = ?");
        $stmt->execute([$id_proj]);
    } else {
        // Ou toutes les phases
        $stmt = $pdo->query("SELECT * FROM phase");
    }
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// 2. AJOUTER UNE PHASE
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // 1. On récupère le budget total du projet
    $stmtBudget = $pdo->prepare("SELECT montant FROM projet WHERE id_proj = ?");
    $stmtBudget->execute([$data['id_projet']]);
    $projet = $stmtBudget->fetch();
    $budgetTotal = $projet['montant'];

    // 2. On calcule la somme des phases déjà existantes
    $stmtSomme = $pdo->prepare("SELECT SUM(montant) as total FROM phase WHERE id_projet = ?");
    $stmtSomme->execute([$data['id_projet']]);
    $sommeActuelle = $stmtSomme->fetch()['total'] ?? 0;

    // 3. Vérification
    if (($sommeActuelle + $data['montant']) > $budgetTotal) {
        http_response_code(400); // Erreur client
        echo json_encode(["error" => "Le budget total du projet est dépassé !"]);
        exit;
    }

    // 4. Si c'est bon, on insère
    $sql = "INSERT INTO phase (dateFin, montant, etatFacturation, etatRealisation, etatPayement, id_projet) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['dateFin'], $data['montant'], $data['etatFacturation'], 
        $data['etatRealisation'], $data['etatPayement'], $data['id_projet']
    ]);
    
    echo json_encode(["message" => "Phase ajoutée avec succès"]);
}