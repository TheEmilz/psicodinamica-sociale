<?php
// api/slots.php — GET: list available slots | POST: create slot (admin)
require_once __DIR__ . '/helpers.php';

set_cors_headers();

$method = $_SERVER['REQUEST_METHOD'];

// ── GET /api/slots.php — public list of available slots ───────────────────────
if ($method === 'GET') {
    try {
        $db = get_db();
        $stmt = $db->query(
            "SELECT id, slot_date AS `date`, slot_time AS `time`
             FROM slots
             WHERE is_booked = 0
               AND slot_date >= CURRENT_DATE
             ORDER BY slot_date, slot_time
             LIMIT 60"
        );
        $slots = $stmt->fetchAll();

        // Format dates for Italian locale
        foreach ($slots as &$s) {
            $dt = new DateTime($s['date']);
            $s['date'] = strftime_italian($dt);
            $s['time'] = substr($s['time'], 0, 5); // HH:MM
        }
        unset($s);

        json_response($slots);
    } catch (PDOException $e) {
        error_log('slots.php GET error: ' . $e->getMessage());
        json_response(['error' => 'Errore interno'], 500);
    }
}

// ── POST /api/slots.php — admin: add a slot ───────────────────────────────────
if ($method === 'POST') {
    // Simple API-key auth: the admin must send X-Admin-Key header
    $admin_key = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
    $expected  = defined('ADMIN_KEY') ? ADMIN_KEY : (getenv('ADMIN_KEY') ?: '');
    if ($expected === '' || $admin_key !== $expected) {
        json_response(['error' => 'Unauthorized'], 401);
    }

    $body = get_json_body();
    $date = sanitize_string($body['date'] ?? '', 10); // YYYY-MM-DD
    $time = sanitize_string($body['time'] ?? '', 8);  // HH:MM or HH:MM:SS

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || !preg_match('/^\d{2}:\d{2}/', $time)) {
        json_response(['error' => 'Formato data/ora non valido. Usa YYYY-MM-DD e HH:MM'], 422);
    }

    try {
        $db   = get_db();
        $stmt = $db->prepare(
            'INSERT INTO slots (slot_date, slot_time, is_booked)
             VALUES (:date, :time, 0)'
        );
        $stmt->execute([':date' => $date, ':time' => $time]);
        json_response(['ok' => true, 'id' => (int)$db->lastInsertId()], 201);
    } catch (PDOException $e) {
        error_log('slots.php POST error: ' . $e->getMessage());
        json_response(['error' => 'Errore interno'], 500);
    }
}

json_response(['error' => 'Method not allowed'], 405);

// ── Helper: Italian date string ───────────────────────────────────────────────
function strftime_italian(DateTime $dt): string {
    $days   = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    $months = ['', 'gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
    return $days[(int)$dt->format('w')] . ' ' . $dt->format('j') . ' ' . $months[(int)$dt->format('n')];
}
