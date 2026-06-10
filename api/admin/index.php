<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Gestione Slot — Admin</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 16px; color: #1f2937; }
  h1 { font-size: 1.4rem; margin-bottom: 24px; }
  form { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px; }
  input, select { border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 12px; font-size: 14px; }
  button { background: #f97316; color: #fff; border: none; border-radius: 8px; padding: 8px 18px; font-size: 14px; cursor: pointer; }
  button:hover { background: #ea580c; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #e5e7eb; }
  th { background: #f9fafb; font-weight: 600; }
  .del { background: #ef4444; font-size: 12px; padding: 4px 10px; }
  .del:hover { background: #dc2626; }
  #msg { font-size: 13px; color: #059669; margin-bottom: 16px; }
  .badge-free { color: #059669; } .badge-booked { color: #6b7280; }
</style>
</head>
<body>
<?php
require_once dirname(__DIR__) . '/helpers.php';

// ── Basic auth via session ────────────────────────────────────────────────────
session_start();
// Password presa da config.php (costante ADMIN_PASS); fallback a getenv per server
// che usano variabili d'ambiente. Mai lasciare il default in produzione.
$admin_pass = defined('ADMIN_PASS') ? ADMIN_PASS : (getenv('ADMIN_PASS') ?: 'changeme');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['admin_pass'])) {
    if ($_POST['admin_pass'] === $admin_pass) {
        $_SESSION['admin'] = true;
    } else {
        $login_error = 'Password errata.';
    }
}

if ($_GET['logout'] ?? false) {
    session_destroy();
    header('Location: index.php');
    exit;
}

if (empty($_SESSION['admin'])):
?>
<h1>Accesso admin</h1>
<?php if (!empty($login_error)): ?><p style="color:#ef4444"><?= htmlspecialchars($login_error) ?></p><?php endif; ?>
<form method="post" style="flex-direction:column;max-width:280px">
  <input type="password" name="admin_pass" placeholder="Password" required>
  <button type="submit" style="margin-top:8px">Accedi</button>
</form>
<?php else: ?>
<h1>Gestione Slot</h1>
<p><a href="?logout=1">Esci</a></p>
<div id="msg"></div>

<?php
$db = get_db();

// ── Handle add ────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add'])) {
    $date = sanitize_string($_POST['date'] ?? '', 10);
    $time = sanitize_string($_POST['time'] ?? '', 8);
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) && preg_match('/^\d{2}:\d{2}$/', $time)) {
        $db->prepare('INSERT INTO slots (slot_date, slot_time) VALUES (:d,:t)')
           ->execute([':d' => $date, ':t' => $time . ':00']);
        $msg = 'Slot aggiunto.';
    }
}

// ── Handle delete ─────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete'])) {
    $id = filter_var($_POST['slot_id'] ?? 0, FILTER_VALIDATE_INT);
    if ($id > 0) {
        $db->prepare('DELETE FROM slots WHERE id = :id AND is_booked = 0')
           ->execute([':id' => $id]);
        $msg = 'Slot eliminato.';
    }
}
?>

<?php if (!empty($msg)): ?><p style="color:#059669;margin-bottom:12px"><?= htmlspecialchars($msg) ?></p><?php endif; ?>

<form method="post">
  <input type="date" name="date" required>
  <input type="time" name="time" step="900" required>
  <button type="submit" name="add">Aggiungi slot</button>
</form>

<table>
<thead><tr><th>Data</th><th>Ora</th><th>Stato</th><th></th></tr></thead>
<tbody>
<?php
$rows = $db->query("SELECT * FROM slots WHERE slot_date >= CURRENT_DATE ORDER BY slot_date, slot_time LIMIT 200")->fetchAll();
foreach ($rows as $row):
    $booked = (bool)$row['is_booked'];
?>
<tr>
  <td><?= htmlspecialchars($row['slot_date']) ?></td>
  <td><?= htmlspecialchars(substr($row['slot_time'], 0, 5)) ?></td>
  <td><?= $booked ? '<span class="badge-booked">Prenotato</span>' : '<span class="badge-free">Libero</span>' ?></td>
  <td><?php if (!$booked): ?>
    <form method="post" style="margin:0">
      <input type="hidden" name="slot_id" value="<?= (int)$row['id'] ?>">
      <button type="submit" name="delete" class="del" onclick="return confirm('Eliminare questo slot?')">Elimina</button>
    </form>
  <?php endif; ?></td>
</tr>
<?php endforeach; ?>
</tbody>
</table>
<?php endif; ?>
</body>
</html>
