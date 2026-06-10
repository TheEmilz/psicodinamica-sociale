<?php
// api/booking.php — POST: book an available slot
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/mailer.php';

set_cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$body   = get_json_body();
$slotId = filter_var($body['slotId'] ?? 0, FILTER_VALIDATE_INT);
$name   = sanitize_string($body['name']  ?? '', 200);
$email  = sanitize_email($body['email']  ?? '');
$phone  = sanitize_phone($body['phone']  ?? '');

if (!$slotId || $slotId <= 0 || $name === '' || $email === '' || $phone === '') {
    json_response(['error' => 'Dati mancanti o non validi.'], 422);
}

try {
    $db = get_db();
    $db->beginTransaction();

    // Lock the row and verify it's still available.
    // FOR UPDATE solo su MySQL; SQLite blocca l'intero DB nella transazione.
    $lock = DB_DRIVER === 'mysql' ? ' FOR UPDATE' : '';
    $stmt = $db->prepare(
        'SELECT id, slot_date, slot_time FROM slots
         WHERE id = :id AND is_booked = 0' . $lock
    );
    $stmt->execute([':id' => $slotId]);
    $slot = $stmt->fetch();

    if (!$slot) {
        $db->rollBack();
        json_response(['error' => 'Slot non disponibile o già prenotato.'], 409);
    }

    // Mark as booked
    $db->prepare('UPDATE slots SET is_booked = 1 WHERE id = :id')
       ->execute([':id' => $slotId]);

    // Save booking record
    $stmt2 = $db->prepare(
        'INSERT INTO bookings (slot_id, name, email, phone)
         VALUES (:slot_id, :name, :email, :phone)'
    );
    $stmt2->execute([
        ':slot_id' => $slotId,
        ':name'    => $name,
        ':email'   => $email,
        ':phone'   => $phone,
    ]);

    $db->commit();

    // ── Email to therapist ───────────────────────────────────────────────────
    $date_str  = $slot['slot_date'] . ' alle ' . substr($slot['slot_time'], 0, 5);
    $notif_html = "
<h2>Nuova prenotazione</h2>
<p><strong>Data/Ora:</strong> {$date_str}</p>
<p><strong>Paziente:</strong> " . htmlspecialchars($name) . "</p>
<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
<p><strong>Telefono:</strong> " . htmlspecialchars($phone) . "</p>
";
    smtp_send(MAIL_TO, "Nuova prenotazione — {$date_str}", $notif_html, $email);

    // ── Confirmation email to patient ────────────────────────────────────────
    $confirm_html = "
<h2>Prenotazione confermata</h2>
<p>Ciao " . htmlspecialchars($name) . ",</p>
<p>La tua seduta è stata prenotata per il <strong>{$date_str}</strong>.</p>
<p>Riceverai un link per la videochiamata prima della seduta.</p>
<p>Per qualsiasi necessità rispondi a questa email.</p>
<br>
<p><em>Psicodinamica Sociale</em></p>
";
    smtp_send($email, 'Conferma prenotazione — Psicodinamica Sociale', $confirm_html);

    json_response(['ok' => true]);

} catch (PDOException $e) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('booking.php DB error: ' . $e->getMessage());
    json_response(['error' => 'Errore interno. Riprova più tardi.'], 500);
}
