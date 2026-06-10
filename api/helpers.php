<?php
// ─── Shared helpers ───────────────────────────────────────────────────────────
// Carica prima l'eventuale config locale (test in locale), poi quella di default.
if (is_file(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
}
require_once __DIR__ . '/config.php';

// ── CORS ──────────────────────────────────────────────────────────────────────
function set_cors_headers(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === ALLOWED_ORIGIN) {
        header("Access-Control-Allow-Origin: {$origin}");
    }
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Vary: Origin');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// ── JSON response ─────────────────────────────────────────────────────────────
function json_response(mixed $data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}

// ── Input sanitization ────────────────────────────────────────────────────────
function sanitize_string(mixed $val, int $maxLen = 500): string {
    if (!is_string($val)) return '';
    return mb_substr(strip_tags(trim($val)), 0, $maxLen);
}

function sanitize_email(mixed $val): string {
    $clean = filter_var(trim((string)$val), FILTER_SANITIZE_EMAIL);
    return filter_var($clean, FILTER_VALIDATE_EMAIL) ? $clean : '';
}

function sanitize_phone(mixed $val): string {
    $clean = preg_replace('/[^\d\s\+\-\(\)]/', '', (string)$val);
    return mb_substr($clean, 0, 30);
}

// ── PDO connection (lazy singleton) ───────────────────────────────────────────
function get_db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $opts = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        if (DB_DRIVER === 'sqlite') {
            // ── SQLite (test in locale) ───────────────────────────────────────
            $path = DB_SQLITE_PATH;
            if (!is_dir(dirname($path))) {
                @mkdir(dirname($path), 0777, true);
            }
            $pdo = new PDO('sqlite:' . $path, null, null, $opts);
            $pdo->exec('PRAGMA foreign_keys = ON');
            init_sqlite_schema($pdo);
        } else {
            // ── MySQL (produzione IONOS) ──────────────────────────────────────
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $opts);
        }
    }
    return $pdo;
}

// ── Crea le tabelle in SQLite se non esistono (solo locale) ───────────────────
function init_sqlite_schema(PDO $db): void {
    $db->exec(
        'CREATE TABLE IF NOT EXISTS slots (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            slot_date  TEXT    NOT NULL,
            slot_time  TEXT    NOT NULL,
            is_booked  INTEGER NOT NULL DEFAULT 0,
            created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
        )'
    );
    $db->exec(
        'CREATE TABLE IF NOT EXISTS bookings (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            slot_id    INTEGER NOT NULL,
            name       TEXT    NOT NULL,
            email      TEXT    NOT NULL,
            phone      TEXT    NOT NULL,
            created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (slot_id) REFERENCES slots(id)
        )'
    );
    $db->exec(
        'CREATE TABLE IF NOT EXISTS contacts (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT    NOT NULL,
            email      TEXT    NOT NULL,
            phone      TEXT    NOT NULL DEFAULT \'\',
            message    TEXT,
            created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
        )'
    );
    $db->exec(
        'CREATE TABLE IF NOT EXISTS applications (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            name             TEXT    NOT NULL,
            email            TEXT    NOT NULL,
            phone            TEXT    NOT NULL DEFAULT \'\',
            experience_years TEXT    NOT NULL DEFAULT \'\',
            analysis_years   TEXT    NOT NULL DEFAULT \'\',
            supervision      TEXT    NOT NULL DEFAULT \'\',
            portfolio        TEXT    NOT NULL DEFAULT \'\',
            message          TEXT,
            created_at       TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
        )'
    );
}

// ── Read JSON body ────────────────────────────────────────────────────────────
function get_json_body(): array {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    try {
        $data = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        return is_array($data) ? $data : [];
    } catch (JsonException) {
        return [];
    }
}
