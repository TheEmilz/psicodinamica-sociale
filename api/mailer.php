<?php
// api/mailer.php — minimal SMTP mailer (no external dependencies)
// Uses TLS on port 587 (STARTTLS) via IONOS SMTP

require_once __DIR__ . '/config.php';

/**
 * Send an HTML email via IONOS SMTP.
 *
 * @param string $to      Recipient address
 * @param string $subject Subject line
 * @param string $html    HTML body
 * @param string $replyTo Optional Reply-To address
 * @return bool           True on success
 */
function smtp_send(string $to, string $subject, string $html, string $replyTo = ''): bool {
    // In locale (o quando disabilitato) non inviamo email reali: logghiamo e basta.
    if (defined('MAIL_DISABLED') && MAIL_DISABLED) {
        error_log("[MAIL_DISABLED] To: {$to} | Subject: {$subject}");
        return true;
    }

    $host     = SMTP_HOST;
    $port     = SMTP_PORT;
    $user     = SMTP_USER;
    $pass     = SMTP_PASS;
    $from     = MAIL_FROM;
    $fromName = MAIL_FROM_NAME;

    $boundary = md5(uniqid((string)mt_rand(), true));

    // Build RFC 2822 message
    $headers  = "Date: " . date('r') . "\r\n";
    $headers .= "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <{$from}>\r\n";
    $headers .= "To: {$to}\r\n";
    if ($replyTo !== '') $headers .= "Reply-To: {$replyTo}\r\n";
    $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: base64\r\n";
    $headers .= "X-Mailer: PsicodinamicaSociale/1.0\r\n";

    $body = chunk_split(base64_encode($html));

    try {
        // Connect
        $socket = fsockopen("tcp://{$host}", $port, $errno, $errstr, 10);
        if (!$socket) throw new RuntimeException("Connect failed: {$errstr} ({$errno})");

        stream_set_timeout($socket, 10);

        $read = function() use ($socket): string {
            $buf = '';
            while (!feof($socket)) {
                $line = fgets($socket, 515);
                $buf .= $line;
                if (isset($line[3]) && $line[3] === ' ') break; // last line of response
            }
            return $buf;
        };

        $send = function(string $cmd) use ($socket, $read): string {
            fwrite($socket, $cmd . "\r\n");
            return $read();
        };

        $read(); // banner
        $send("EHLO " . gethostname());
        $send("STARTTLS");

        // Upgrade to TLS
        stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);

        $send("EHLO " . gethostname());
        $send("AUTH LOGIN");
        $send(base64_encode($user));
        $resp = $send(base64_encode($pass));

        if (!str_starts_with(trim($resp), '235')) {
            fclose($socket);
            error_log("smtp_send: AUTH failed — " . trim($resp));
            return false;
        }

        $send("MAIL FROM: <{$from}>");
        $send("RCPT TO: <{$to}>");
        $send("DATA");
        fwrite($socket, $headers . "\r\n" . $body . "\r\n.\r\n");
        $resp = $read();
        $send("QUIT");
        fclose($socket);

        if (!str_starts_with(trim($resp), '250')) {
            error_log("smtp_send: DATA rejected — " . trim($resp));
            return false;
        }

        return true;

    } catch (Throwable $e) {
        error_log("smtp_send exception: " . $e->getMessage());
        if (isset($socket) && is_resource($socket)) fclose($socket);
        return false;
    }
}
