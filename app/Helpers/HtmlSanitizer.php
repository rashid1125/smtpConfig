<?php 
# app/Helpers/HtmlSanitizer.php
function sanitizeHtml($dirtyHtml) {
    $config = HTMLPurifier_Config::createDefault();
    $config->set('HTML.Allowed', 'br');
    $purifier = new HTMLPurifier($config);
    return $purifier->purify($dirtyHtml);
}