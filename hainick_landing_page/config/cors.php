<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    // Daftarkan path 'api/*' dan 'hainickkreatif/*'
    'paths' => ['api/*', 'hainickkreatif/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Izinkan semua origin (*) untuk masa development agar tidak bentrok 127.0.0.1 vs localhost
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];