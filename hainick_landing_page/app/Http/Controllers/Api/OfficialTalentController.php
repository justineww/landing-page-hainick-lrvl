<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OfficialTalentController extends Controller
{
    use ConvertsToWebp;

    // POST /hainickkreatif/load-official-talent
    public function index()
    {
        $result = DB::table('official_talent')->get();
        return response()->json($result, 200);
    }

    // POST /hainickkreatif/create-official-talent
    public function store(Request $request)
    {
        if (! $request->hasFile('image_url')) {
            return response()->json(['error' => 'Gambar harus diunggah'], 400);
        }

        $imageUrl = $this->convertToWebp($request->file('image_url'));

        $id = DB::table('official_talent')->insertGetId(['image_url' => $imageUrl]);

        return response()->json([
            'message' => 'Gambar berhasil ditambahkan',
            'id' => $id,
        ], 201);
    }

    // PUT /hainickkreatif/update-official-talent/{id}
    public function update(Request $request, int $id)
    {
        if (! $request->hasFile('image_url')) {
            return response()->json(['error' => 'Image harus diunggah'], 400);
        }

        $image = $this->convertToWebp($request->file('image_url'));

        $affected = DB::table('official_talent')->where('id', $id)->update(['image_url' => $image]);

        if ($affected === 0) {
            return response()->json(['error' => 'Image official talent tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Image official talent berhasil diperbarui',
            'imageUrl' => $image,
        ], 200);
    }

    // DELETE /hainickkreatif/delete-official-talent/{id}
    public function destroy(int $id)
    {
        DB::table('official_talent')->where('id', $id)->delete();
        return response()->json(['message' => 'Official talent berhasil dihapus'], 200);
    }

    // ── official_talent_desc (talent_id-keyed) ────────────────────────────

    // POST /hainickkreatif/load-official-talent-desc/{id}
    public function showDesc(int $id)
    {
        $result = DB::table('official_talent_desc')->where('talent_id', $id)->get();
        return response()->json($result, 200);
    }

    // POST /hainickkreatif/create-official-talent-desc
    public function storeDesc(Request $request)
    {
        $id = DB::table('official_talent_desc')->insertGetId([
            'image_url' => $request->input('image_url'),
            'nama' => $request->input('nama'),
            'bio' => $request->input('bio'),
            'followers_ig' => $request->input('followers_ig'),
            'followers_tiktok' => $request->input('followers_tiktok'),
            'followers_twitter' => $request->input('followers_twitter'),
            'tinggi' => $request->input('tinggi'),
            'berat' => $request->input('berat'),
            'umur' => $request->input('umur'),
        ]);

        return response()->json([
            'message' => 'Deskripsi Talent berhasil ditambahkan',
            'id' => $id,
        ], 201);
    }

    // PUT /hainickkreatif/update-official-talent-desc/{id}
    public function updateDesc(Request $request, int $id)
    {
        $fields = [];
        foreach ([
            'image_url', 'nama', 'bio', 'followers_ig',
            'followers_tiktok', 'followers_twitter', 'tinggi', 'berat', 'umur',
        ] as $key) {
            if ($request->input($key) !== null) {
                $fields[$key] = $request->input($key);
            }
        }

        if (empty($fields)) {
            return response()->json(['error' => 'Tidak ada data yang diperbarui'], 400);
        }

        DB::table('official_talent_desc')->where('talent_id', $id)->update($fields);

        return response()->json(['message' => 'Official talent berhasil diperbarui'], 200);
    }
}
