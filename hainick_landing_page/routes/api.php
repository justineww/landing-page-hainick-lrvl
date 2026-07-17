<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CreatorController;
use App\Http\Controllers\Api\WebsiteAssetController;
use App\Http\Controllers\Api\UpdatesSectionController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\PhotocardController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\LogoController;
use App\Http\Controllers\Api\OfficialTalentController;

/*
|--------------------------------------------------------------------------
| API Routes — all prefixed with /hainickkreatif, matching the original
| Express app's /api routes.
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('api-tester');
});


Route::prefix('hainickkreatif')->group(function () {

    // ── LOGIN ──────────────────────────────────────────────────────────
    Route::get('/login', [AuthController::class, 'login']);

    // ── LOAD (GET) ─────────────────────────────────────────────────────
    Route::get('/creators', [CreatorController::class, 'index']);
    Route::get('/load-official-talent', [OfficialTalentController::class, 'index']);
    Route::get('/hainick-assets', [WebsiteAssetController::class, 'index']);
    Route::get('/updates-section', [UpdatesSectionController::class, 'index']);
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::get('/creators-photocard', [PhotocardController::class, 'index']);
    Route::get('/creators-photocard-statistics', [PhotocardController::class, 'statistics']);
    Route::get('/contact', [ContactController::class, 'index']);
    Route::get('/contact-form', [ContactController::class, 'indexForm']);
    Route::get('/logos', [LogoController::class, 'index']);

    // ── SEED ───────────────────────────────────────────────────────────
    Route::post('/seed-creators-photocard', [PhotocardController::class, 'seed']);

    // ── Legacy POST "load" endpoints (kept for compatibility) ──────────
    Route::post('/load-logo', [LogoController::class, 'index']);
    Route::post('/load-official-talent-desc/{id}', [OfficialTalentController::class, 'showDesc']);

    // ── CREATE (POST) ────────────────────────────────────────────────────
    Route::post('/create-contact-form', [ContactController::class, 'storeForm']);
    Route::post('/create-creators', [CreatorController::class, 'store']);
    Route::post('/create-hainick-assets', [WebsiteAssetController::class, 'store']);
    Route::post('/create-updates-section-image', [UpdatesSectionController::class, 'storeImage']);
    Route::post('/create-updates-section-description', [UpdatesSectionController::class, 'storeDescription']);
    Route::post('/create-testimonials', [TestimonialController::class, 'store']);
    Route::post('/create-role', [CreatorController::class, 'createRole']);
    Route::post('/create-creators-photocard', [PhotocardController::class, 'store']);
    Route::post('/create-creators-photocard-statistics', [PhotocardController::class, 'storeStatistics']);
    Route::post('/create-logo', [LogoController::class, 'store']);
    Route::post('/create-official-talent', [OfficialTalentController::class, 'store']);
    Route::post('/create-official-talent-desc', [OfficialTalentController::class, 'storeDesc']);

    // ── UPDATE (PUT) ─────────────────────────────────────────────────────
    Route::put('/update-creators/{id}', [CreatorController::class, 'update']);
    Route::put('/remove-role/{id}', [CreatorController::class, 'removeRole']);
    Route::put('/update-hainick-assets/{image_type}', [WebsiteAssetController::class, 'update']);
    Route::put('/update-updates-section-image-by-id/{id}', [UpdatesSectionController::class, 'updateImageById']);
    Route::put('/update-updates-section-image/{image_type}', [UpdatesSectionController::class, 'updateImageByType']);
    Route::put('/update-updates-section-description', [UpdatesSectionController::class, 'updateDescription']);
    Route::put('/update-updates-section-status/{id}', [UpdatesSectionController::class, 'updateStatus']);
    Route::put('/update-testimonials/{id}', [TestimonialController::class, 'update']);
    Route::put('/update-creators-photocard/{id}', [PhotocardController::class, 'update']);
    Route::put('/update-creators-photocard-statistics', [PhotocardController::class, 'updateStatistics']);
    Route::put('/update-contact', [ContactController::class, 'update']);
    Route::put('/update-logo/{id}', [LogoController::class, 'update']);
    Route::put('/update-official-talent/{id}', [OfficialTalentController::class, 'update']);
    Route::put('/update-official-talent-desc/{id}', [OfficialTalentController::class, 'updateDesc']);

    // ── DELETE ─────────────────────────────────────────────────────────
    Route::delete('/delete-creators/{id}', [CreatorController::class, 'destroy']);
    Route::delete('/delete-hainick-assets/{image_type}', [WebsiteAssetController::class, 'destroy']);
    Route::delete('/delete-updates-section/{id}', [UpdatesSectionController::class, 'destroy']);
    Route::delete('/delete-updates-section-description', [UpdatesSectionController::class, 'destroyDescription']);
    Route::delete('/delete-testimonials/{id}', [TestimonialController::class, 'destroy']);
    Route::delete('/delete-creators-photocard/{id}', [PhotocardController::class, 'destroy']);
    Route::delete('/delete-creators-photocard-statistics', [PhotocardController::class, 'destroyStatistics']);
    Route::delete('/delete-contact', [ContactController::class, 'destroy']);
    Route::delete('/delete-contact-form/{id}', [ContactController::class, 'destroyForm']);
    Route::delete('/delete-logo/{id}', [LogoController::class, 'destroy']);
    Route::delete('/delete-official-talent/{id}', [OfficialTalentController::class, 'destroy']);
});
