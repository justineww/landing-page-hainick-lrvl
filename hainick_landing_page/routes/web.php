<?php

use Illuminate\Support\Facades\Route;

// Tangkap semua route dan serahkan ke React
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '.*');