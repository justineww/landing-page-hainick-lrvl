<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AuthController,
    CreatorController,
    WebsiteAssetController,
    UpdatesSectionController,
    TestimonialController,
    PhotocardController,
    ContactController,
    LogoController,
    OfficialTalentController
};

/*
|--------------------------------------------------------------------------
| API Routes — Prefixed with /hainickkreatif
|--------------------------------------------------------------------------
*/

Route::prefix('hainickkreatif')->group(function () {

    // ── AUTH ────────────────────────────────────────────────────────────
    Route::controller(AuthController::class)->group(function () {
        Route::match(['get', 'post'], '/login', 'login');
    });

    // ── CREATORS ────────────────────────────────────────────────────────
    Route::controller(CreatorController::class)->group(function () {
        Route::get('/creators', 'index');
        Route::post('/create-creators', 'store');
        Route::post('/create-role', 'createRole');
        Route::put('/update-creators/{id}', 'update');
        Route::put('/remove-role/{id}', 'removeRole');
        Route::delete('/delete-creators/{id}', 'destroy');
    });

    // ── OFFICIAL TALENTS ────────────────────────────────────────────────
    Route::controller(OfficialTalentController::class)->group(function () {
        Route::get('/load-official-talent', 'index');
        Route::post('/load-official-talent-desc/{id}', 'showDesc');
        Route::post('/create-official-talent', 'store');
        Route::post('/create-official-talent-desc', 'storeDesc');
        Route::put('/update-official-talent/{id}', 'update');
        Route::put('/update-official-talent-desc/{id}', 'updateDesc');
        Route::delete('/delete-official-talent/{id}', 'destroy');
    });

    // ── WEBSITE ASSETS ──────────────────────────────────────────────────
    Route::controller(WebsiteAssetController::class)->group(function () {
        Route::get('/hainick-assets', 'index');
        Route::post('/create-hainick-assets', 'store');
        Route::put('/update-hainick-assets/{image_type}', 'update');
        Route::delete('/delete-hainick-assets/{image_type}', 'destroy');
    });

    // ── UPDATES SECTION ─────────────────────────────────────────────────
    Route::controller(UpdatesSectionController::class)->group(function () {
        Route::get('/updates-section', 'index');
        Route::post('/create-updates-section-image', 'storeImage');
        Route::post('/create-updates-section-description', 'storeDescription');
        Route::put('/update-updates-section-image-by-id/{id}', 'updateImageById');
        Route::put('/update-updates-section-image/{image_type}', 'updateImageByType');
        Route::put('/update-updates-section-description', 'updateDescription');
        Route::put('/update-updates-section-status/{id}', 'updateStatus');
        Route::delete('/delete-updates-section/{id}', 'destroy');
        Route::delete('/delete-updates-section-description', 'destroyDescription');
    });

    // ── TESTIMONIALS ────────────────────────────────────────────────────
    Route::controller(TestimonialController::class)->group(function () {
        Route::get('/testimonials', 'index');
        Route::post('/create-testimonials', 'store');
        Route::put('/update-testimonials/{id}', 'update');
        Route::delete('/delete-testimonials/{id}', 'destroy');
    });

    // ── PHOTOCARDS ──────────────────────────────────────────────────────
    Route::controller(PhotocardController::class)->group(function () {
        Route::get('/creators-photocard', 'index');
        Route::get('/creators-photocard-statistics', 'statistics');
        Route::post('/seed-creators-photocard', 'seed');
        Route::post('/create-creators-photocard', 'store');
        Route::post('/create-creators-photocard-statistics', 'storeStatistics');
        Route::put('/update-creators-photocard/{id}', 'update');
        Route::put('/update-creators-photocard-statistics', 'updateStatistics');
        Route::delete('/delete-creators-photocard/{id}', 'destroy');
        Route::delete('/delete-creators-photocard-statistics', 'destroyStatistics');
    });

    // ── CONTACT ─────────────────────────────────────────────────────────
    Route::controller(ContactController::class)->group(function () {
        Route::get('/contact', 'index');
        Route::get('/contact-form', 'indexForm');
        Route::post('/create-contact-form', 'storeForm');
        Route::put('/update-contact', 'update');
        Route::delete('/delete-contact', 'destroy');
        Route::delete('/delete-contact-form/{id}', 'destroyForm');
    });

    // ── LOGOS ───────────────────────────────────────────────────────────
    Route::controller(LogoController::class)->group(function () {
        Route::get('/logos', 'index');
        Route::post('/load-logo', 'index');
        Route::post('/create-logo', 'store');
        Route::put('/update-logo/{id}', 'update');
        Route::delete('/delete-logo/{id}', 'destroy');
    });

});