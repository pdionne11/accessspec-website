<?php
/**
 * Access Spec Telecommunications — Formulaire de contact
 * Envoie les données du formulaire + photos jointes à info@accessspec.com
 */

header('Content-Type: application/json; charset=UTF-8');

// Mode test GET — ouvrir contact-handler.php?test=1 dans le navigateur
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['test'])) {
    $ok  = mail('info@accessspec.com', 'Test formulaire Access Spec', 'Test envoi OK', 'From: info@accessspec.com');
    $err = error_get_last();
    echo json_encode([
        'test'              => true,
        'success'           => $ok,
        'error'             => $err['message'] ?? null,
        'file_uploads'      => ini_get('file_uploads'),
        'upload_max_filesize' => ini_get('upload_max_filesize'),
        'post_max_size'     => ini_get('post_max_size'),
        'upload_tmp_dir'    => ini_get('upload_tmp_dir'),
    ]);
    exit;
}

// Refus des requêtes non-POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// ── NETTOYAGE ──────────────────────────────────────────────────
function clean(string $val): string {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

$prenom      = clean($_POST['prenom']      ?? '');
$nom         = clean($_POST['nom']         ?? '');
$entreprise  = clean($_POST['entreprise']  ?? '') ?: 'N/A';
$telephone   = clean($_POST['telephone']   ?? '');
$email       = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$type_app    = clean($_POST['type_appareil'] ?? '');
$marque      = clean($_POST['marque']      ?? '');
$description = clean($_POST['description'] ?? '');
$type_dem    = clean($_POST['type_demande'] ?? 'reparabilite');

// ── VALIDATION ─────────────────────────────────────────────────
$errors = [];
if (!$prenom)      $errors[] = 'Prénom manquant.';
if (!$nom)         $errors[] = 'Nom manquant.';
if (!$telephone)   $errors[] = 'Téléphone manquant.';
if (!$type_app)    $errors[] = 'Type d\'appareil manquant.';
if (!$marque)      $errors[] = 'Marque manquante.';
if (!$description) $errors[] = 'Description manquante.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Courriel invalide.';

if ($errors) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// ── CONSTRUCTION DU COURRIEL ───────────────────────────────────
$type_label = $type_dem === 'estimation'
    ? 'Estimation officielle du coût'
    : 'Évaluation de réparabilité';

$destinataire = 'info@accessspec.com';
$sujet        = '=?UTF-8?B?' . base64_encode("[{$type_label}] {$type_app} — {$marque}") . '?=';

$corps  = "Type de demande : {$type_label}\r\n\r\n";
$corps .= "──── COORDONNÉES ────\r\n";
$corps .= "Nom        : {$prenom} {$nom}\r\n";
$corps .= "Entreprise : {$entreprise}\r\n";
$corps .= "Téléphone  : {$telephone}\r\n";
$corps .= "Courriel   : {$email}\r\n\r\n";
$corps .= "──── ÉQUIPEMENT ────\r\n";
$corps .= "Type  : {$type_app}\r\n";
$corps .= "Marque: {$marque}\r\n\r\n";
$corps .= "──── DESCRIPTION ────\r\n";
$corps .= "{$description}\r\n";

// ── PIÈCES JOINTES (photos) ────────────────────────────────────
$boundary   = '----=_Part_' . md5(uniqid('', true));
$types_ok   = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
$taille_max = 5 * 1024 * 1024; // 5 Mo par fichier
$pieces     = [];

if (!empty($_FILES['attachment']['name'][0])) {
    $fichiers = $_FILES['attachment'];
    $nb = count($fichiers['name']);

    for ($i = 0; $i < $nb; $i++) {
        if ($fichiers['error'][$i] !== UPLOAD_ERR_OK) continue;
        if ($fichiers['size'][$i]  >  $taille_max)    continue;

        $type_mime = mime_content_type($fichiers['tmp_name'][$i]);
        if (!in_array($type_mime, $types_ok, true)) continue;

        $pieces[] = [
            'nom'     => basename($fichiers['name'][$i]),
            'type'    => $type_mime,
            'contenu' => chunk_split(base64_encode(file_get_contents($fichiers['tmp_name'][$i]))),
        ];
    }
}

// ── EN-TÊTES & CORPS MIME ──────────────────────────────────────
$entetes  = "From: Site Web Access Spec <info@accessspec.com>\r\n";
$entetes .= "Reply-To: {$prenom} {$nom} <{$email}>\r\n";
$entetes .= "MIME-Version: 1.0\r\n";
$entetes .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";

$message  = "--{$boundary}\r\n";
$message .= "Content-Type: text/plain; charset=UTF-8\r\n";
$message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$message .= $corps . "\r\n";

foreach ($pieces as $p) {
    $message .= "--{$boundary}\r\n";
    $message .= "Content-Type: {$p['type']}; name=\"{$p['nom']}\"\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n";
    $message .= "Content-Disposition: attachment; filename=\"{$p['nom']}\"\r\n\r\n";
    $message .= $p['contenu'] . "\r\n";
}

$message .= "--{$boundary}--";

// ── ENVOI ──────────────────────────────────────────────────────
$ok = mail($destinataire, $sujet, $message, $entetes);
if ($ok) {
    echo json_encode(['success' => true, 'fichiers' => count($pieces)]);
} else {
    $err = error_get_last();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur mail: ' . ($err['message'] ?? 'inconnue')]);
}
