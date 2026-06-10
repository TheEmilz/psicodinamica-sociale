<?php
// api/apply.php — POST: ricezione candidatura "Lavora con noi" (psicoterapeuti)
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/mailer.php';

set_cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$body = get_json_body();

$name       = sanitize_string($body['name']       ?? '', 200);
$email      = sanitize_email($body['email']      ?? '');
$phone      = sanitize_phone($body['phone']      ?? '');
$experience = sanitize_string($body['experience'] ?? '', 50);
$analysis   = sanitize_string($body['analysis']   ?? '', 50);
$supervision = sanitize_string($body['supervision'] ?? '', 50);
$portfolio  = sanitize_string($body['portfolio']  ?? '', 500);
$message    = sanitize_string($body['message']    ?? '', 3000);

if ($name === '' || $email === '') {
    json_response(['error' => 'Nome ed email sono obbligatori.'], 422);
}

// ── Store in DB ───────────────────────────────────────────────────────────────
try {
    $db = get_db();
    $stmt = $db->prepare(
        'INSERT INTO applications (name, email, phone, experience_years, analysis_years, supervision, portfolio, message)
         VALUES (:name, :email, :phone, :experience, :analysis, :supervision, :portfolio, :message)'
    );
    $stmt->execute([
        ':name'        => $name,
        ':email'       => $email,
        ':phone'       => $phone,
        ':experience'  => $experience,
        ':analysis'    => $analysis,
        ':supervision' => $supervision,
        ':portfolio'   => $portfolio,
        ':message'     => $message,
    ]);
} catch (PDOException $e) {
    error_log('apply.php DB error: ' . $e->getMessage());
    json_response(['error' => 'Errore interno. Riprova più tardi.'], 500);
}

// ── Send email notification ───────────────────────────────────────────────────
$subject  = "Nuova candidatura — Lavora con noi";
$body_html = "
<h2>Nuova candidatura (Lavora con noi)</h2>
<p><strong>Nome:</strong> " . htmlspecialchars($name) . "</p>
<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
<p><strong>Telefono:</strong> " . htmlspecialchars($phone ?: '—') . "</p>
<p><strong>Anni di esperienza clinica:</strong> " . htmlspecialchars($experience ?: '—') . "</p>
<p><strong>Anni di analisi personale:</strong> " . htmlspecialchars($analysis ?: '—') . "</p>
<p><strong>Supervisione continuativa:</strong> " . htmlspecialchars($supervision ?: '—') . "</p>
<p><strong>CV / profilo:</strong> " . htmlspecialchars($portfolio ?: '—') . "</p>
<p><strong>Messaggio:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>
";

// Non blocchiamo la risposta se la mail fallisce: il record è già nel DB
smtp_send(MAIL_TO, $subject, $body_html, $email);

json_response(['ok' => true]);
