<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LogoController extends Controller
{
    use ConvertsToWebp;

    // GET /hainickkreatif/logos
    // POST /hainickkreatif/load-logo (kept for compatibility, same behavior)
    public function index()
    {
        $result = DB::table('logo')->orderBy('id', 'asc')->get();
        return response()->json($result, 200);
    }

    // POST /hainickkreatif/create-logo
    public function store(Request $request)
    {
        if (! $request->hasFile('logo')) {
            return response()->json(['error' => 'Logo harus diunggah'], 400);
        }

        $image = $this->convertToWebp($request->file('logo'));

        $id = DB::table('logo')->insertGetId(['image_url' => $image]);

        return response()->json([
            'message' => 'Logo berhasil ditambahkan',
            'id' => $id,
        ], 201);
    }

    // PUT /hainickkreatif/update-logo/{id}
    public function update(Request $request, int $id)
    {
        if (! $request->hasFile('logo')) {
            return response()->json(['error' => 'Logo harus diunggah'], 400);
        }

        $logo = $this->convertToWebp($request->file('logo'));

        $affected = DB::table('logo')->where('id', $id)->update(['image_url' => $logo]);

        if ($affected === 0) {
            return response()->json(['error' => 'Logo tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Logo berhasil diperbarui',
            'imageUrl' => $logo,
        ], 200);
    }

    // DELETE /hainickkreatif/delete-logo/{id}
    public function destroy(int $id)
    {
        DB::table('logo')->where('id', $id)->delete();
        return response()->json(['message' => 'Logo berhasil dihapus'], 200);
    }
}
