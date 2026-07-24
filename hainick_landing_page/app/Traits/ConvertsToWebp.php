<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\image\Format;

/**
 * Mirrors the Node.js `convertToWebp` helper:
 * - saves the uploaded file
 * - converts it to .webp (quality 80)
 * - deletes the original
 * - returns a public URL path, e.g. "/storage/uploads/169999999.webp"
 *
 * Requires: composer require intervention/image
 * Requires: php artisan storage:link (to expose storage/app/public as /storage)
 */
trait ConvertsToWebp
{
    protected function convertToWebp(UploadedFile $file): string
    {
        ini_set('memory_limit', '512M');
        
        $filename = time() . '_' . uniqid() . '.webp';

        // Encode directly from the uploaded file's temp path — no need to
        // persist the original at all, which keeps behavior equivalent to
        // "convert then delete original" in one step.
        $encoded = Image::decode($file->getRealPath())->encodeUsingFormat(Format::WEBP, quality: 80);

        Storage::disk('public')->put('uploads/' . $filename, (string) $encoded);

        return '/storage/uploads/' . $filename;
    }
}
