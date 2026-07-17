<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UpdatesSectionController extends Controller
{
    use ConvertsToWebp;

    // GET /hainickkreatif/updates-section
    public function index()
    {
        $result = DB::table('updates_section')->get();
        return response()->json($result, 200);
    }

    // POST /hainickkreatif/create-updates-section-image
    public function storeImage(Request $request)
    {
        $imageType = $request->input('image_type');
        $isActive = $request->has('is_active') ? (int) $request->input('is_active') : 0;

        if (! $imageType) {
            return response()->json(['error' => 'Tipe gambar harus diisi'], 400);
        }
        if (! $request->hasFile('image_url')) {
            return response()->json(['error' => 'Gambar harus diunggah'], 400);
        }

        $image = $this->convertToWebp($request->file('image_url'));

        $id = DB::table('updates_section')->insertGetId([
            'image_type' => $imageType,
            'image_url' => $image,
            'is_active' => $isActive,
        ]);

        return response()->json([
            'message' => 'Updates section berhasil ditambahkan',
            'id' => $id,
            'imagetype' => $imageType,
            'imageUrl' => $image,
        ], 201);
    }

    // POST /hainickkreatif/create-updates-section-description
    public function storeDescription(Request $request)
    {
        $description = $request->input('description');

        $id = DB::table('updates_section')->insertGetId([
            'description' => $description,
        ]);

        return response()->json([
            'message' => 'Deskripsi updates section berhasil ditambahkan',
            'id' => $id,
        ], 201);
    }

    // PUT /hainickkreatif/update-updates-section-image-by-id/{id}
    public function updateImageById(Request $request, int $id)
    {
        if (! $request->hasFile('image_url')) {
            return response()->json(['error' => 'Gambar harus diunggah'], 400);
        }

        $image = $this->convertToWebp($request->file('image_url'));

        DB::table('updates_section')->where('id', $id)->update(['image_url' => $image]);

        return response()->json([
            'message' => 'Gambar updates section berhasil diperbarui',
            'imageUrl' => $image,
        ], 200);
    }

    // PUT /hainickkreatif/update-updates-section-image/{image_type}
    public function updateImageByType(Request $request, string $imageType)
    {
        if (! $request->hasFile('image_url')) {
            return response()->json(['error' => 'Gambar harus diunggah'], 400);
        }

        $image = $this->convertToWebp($request->file('image_url'));

        DB::table('updates_section')->where('image_type', $imageType)->update(['image_url' => $image]);

        return response()->json(['message' => 'Gambar updates section berhasil diperbarui'], 200);
    }

    // PUT /hainickkreatif/update-updates-section-description
    public function updateDescription(Request $request)
    {
        $description = $request->input('description');
        $imageType = $request->input('image_type');
        $id = $request->input('id');

        if (! $description) {
            return response()->json(['error' => 'Deskripsi harus diisi'], 400);
        }

        if ($id) {
            DB::table('updates_section')->where('id', $id)->update(['description' => $description]);
            return response()->json(['message' => 'Deskripsi updates section berhasil diperbarui'], 200);
        }

        if ($imageType) {
            DB::table('updates_section')->where('image_type', $imageType)->update(['description' => $description]);
            return response()->json(['message' => 'Deskripsi updates section berhasil diperbarui'], 200);
        }

        return response()->json(['error' => 'ID atau image_type harus diisi'], 400);
    }

    // PUT /hainickkreatif/update-updates-section-status/{id}
    public function updateStatus(Request $request, int $id)
    {
        $isActive = $request->input('is_active');
        $imageType = $request->input('image_type');

        if ($isActive === null) {
            return response()->json(['error' => 'is_active harus diisi'], 400);
        }

        DB::table('updates_section')->where('id', $id)->update([
            'is_active' => (int) $isActive,
            'image_type' => $imageType,
        ]);

        return response()->json(['message' => 'Status updates section berhasil diperbarui'], 200);
    }

    // DELETE /hainickkreatif/delete-updates-section/{id}
    public function destroy(int $id)
    {
        DB::table('updates_section')->where('id', $id)->delete();
        return response()->json(['message' => 'Update section berhasil dihapus'], 200);
    }

    // DELETE /hainickkreatif/delete-updates-section-description
    public function destroyDescription()
    {
        DB::table('updates_section')->whereNotNull('description')->delete();
        return response()->json(['message' => 'Deskripsi update section berhasil dihapus'], 200);
    }
}
