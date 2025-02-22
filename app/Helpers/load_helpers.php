<?php
// load_helpers.php
foreach (glob(dirname(__FILE__) . '/*.php') as $file) {
    if ($file !== dirname(__FILE__) . '/load_helpers.php') { // prevent including this file
        require_once $file;
    }
}