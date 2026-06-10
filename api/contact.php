<?php
// api/contact.php — POST: receive contact form, send email notification
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/mailer.php';

set_cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$body = get_json_body();

$name    = sanitize_string($body['name']    ?? '', 200);
$email   = sanitize_email($body['email']   ?? '');
$phone   = sanitize_phone($body['phone']   ?? '');
$message = sanitize_string($body['message'] ?? '', 2000);

if ($name === '' || $email === '') {
    json_response(['error' => 'Nome ed email sono obbligatori.'], 422);
}

// ── Store in DB ───────────────────────────────────────────────────────────────
try {
    $db = get_db();
    $stmt = $db->prepare(
        'INSERT INTO contacts (name, email, phone, message)
         VALUES (:name, :email, :phone, :message)'
    );
    $stmt->execute([
        ':name'    => $name,
        ':email'   => $email,
        ':phone'   => $phone,
        ':message' => $message,
    ]);
} catch (PDOException $e) {
    error_log('contact.php DB error: ' . $e->getMessage());
    json_response(['error' => 'Errore interno. Riprova più tardi.'], 500);
}

// ── Send email notification ───────────────────────────────────────────────────
$subject  = "Nuovo contatto — Psicodinamica Sociale";
$body_html = "
<h2>Nuovo messaggio dal sito</h2>
<p><strong>Nome:</strong> " . htmlspecialchars($name) . "</p>
<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
<p><strong>Telefono:</strong> " . htmlspecialchars($phone ?: '—') . "</p>
<p><strong>Messaggio:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>
";

// Non blocchiamo la risposta se la mail fallisce: il record è già nel DB
smtp_send(MAIL_TO, $subject, $body_html, $email);

json_response(['ok' => true]);
