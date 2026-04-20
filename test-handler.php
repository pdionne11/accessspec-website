<?php
/**
 * TEST RAPIDE — à supprimer après vérification
 * Accéder à : https://votre-site.com/test-mail.php
 */
$ok = mail(
    'access.spec@hotmail.com',
    'Test envoi Access Spec',
    'Si vous recevez ce message, mail() fonctionne sur ce serveur.',
    "From: access.spec@hotmail.com\r\nContent-Type: text/plain; charset=UTF-8"
);

echo $ok
    ? '<p style="color:green;font-family:sans-serif">✅ mail() fonctionne — vérifiez votre boîte (et le dossier spam).</p>'
    : '<p style="color:red;font-family:sans-serif">❌ mail() est désactivé ou mal configuré sur ce serveur.</p>';
