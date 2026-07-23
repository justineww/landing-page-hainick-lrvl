<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WebsiteAssetController extends Controller
{
    use ConvertsToWebp;

    // GET /hainickkreatif/hainick-assets
    public function index()
    {
        $result = DB::table('website_assets')->get();
        return response()->json($result, 200);
    }

    // POST /hainickkreatif/create-hainick-assets
    public function store(Request $request)
    {
        $imageType = $request->input('image_type');
        if (! $imageType) {
            return response()->json(['error' => 'Tipe gambar harus diisi'], 400);
        }
        if ($request->hasFile('image_url')) {
            return response()->json(['error' => 'Gambar harus diunggah'], 400);
        }

        $image = $this->convertToWebp($request->file('image_url'));

        DB::table('website_assets')->insertGetId([
            'image_type' => $imageType,
            'image_url' => $image,
        ]);

        return response()->json([
            'message' => 'Hainick update berhasil ditambahkan',
            'imagetype' => $imageType,
            'imageUrl' => $image,
        ], 201);
    }

    // PUT /hainickkreatif/update-hainick-assets/{image_type}
    public function update(Request $request, string $imageType)
    {
        if (! $request->hasFile('image_url')) {
            return response()->json(['error' => 'Gambar harus diunggah'], 400);
        }

        $image = $this->convertToWebp($request->file('image_url'));

        DB::table('website_assets')
            ->where('image_type', $imageType)
            ->update(['image_url' => $image]);

        return response()->json(['message' => 'Gambar website berhasil diperbarui'], 200);
    }

    // DELETE /hainickkreatif/delete-hainick-assets/{image_type}
    public function destroy(string $imageType)
    {
        DB::table('website_assets')->where('image_type', $imageType)->delete();
        return response()->json(['message' => 'Hainick update berhasil dihapus'], 200);
    }
}
