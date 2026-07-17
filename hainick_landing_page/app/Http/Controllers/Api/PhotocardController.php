<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PhotocardController extends Controller
{
    use ConvertsToWebp;

    // GET /hainickkreatif/creators-photocard
    public function index()
    {
        $result = DB::table('creators_photocard')->orderBy('id', 'asc')->get();
        return response()->json($result, 200);
    }

    // GET /hainickkreatif/creators-photocard-statistics
    public function statistics()
    {
        $result = DB::table('creators_photocard_statistics')->limit(1)->get();
        return response()->json($result, 200);
    }

    // POST /hainickkreatif/seed-creators-photocard
    public function seed()
    {
        $photoInserted = 0;
        for ($i = 1; $i <= 20; $i++) {
            $exists = DB::table('creators_photocard')->where('id', $i)->exists();
            if (! $exists) {
                DB::table('creators_photocard')->insert(['id' => $i, 'image_url' => null]);
                $photoInserted++;
            }
        }

        $statsExists = DB::table('creators_photocard_statistics')->exists();
        $statsInserted = 0;
        if (! $statsExists) {
            DB::table('creators_photocard_statistics')->insert([
                'creators' => '25',
                'brand' => '100',
                'projects' => '+78',
            ]);
            $statsInserted = 1;
        }

        return response()->json([
            'message' => "Seed selesai! {$photoInserted} row photocard dibuat, statistik: "
                . ($statsInserted > 0 ? 'row default ditambahkan' : 'sudah ada, dilewati') . '.',
            'photocard_inserted' => $photoInserted,
            'stats_inserted' => $statsInserted,
        ], 200);
    }

    // POST /hainickkreatif/create-creators-photocard
    public function store(Request $request)
    {
        $image = null;
        if ($request->hasFile('image_url')) {
            $image = $this->convertToWebp($request->file('image_url'));
        }

        $id = DB::table('creators_photocard')->insertGetId(['image_url' => $image]);

        return response()->json([
            'message' => 'Creators photocard berhasil ditambahkan',
            'id' => $id,
        ], 201);
    }

    // POST /hainickkreatif/create-creators-photocard-statistics
    public function storeStatistics(Request $request)
    {
        $id = DB::table('creators_photocard_statistics')->insertGetId([
            'creators' => $request->input('creators'),
            'brand' => $request->input('brand'),
            'projects' => $request->input('projects'),
        ]);

        return response()->json([
            'message' => 'Creators photocard statistics berhasil ditambahkan',
            'id' => $id,
        ], 201);
    }

    // PUT /hainickkreatif/update-creators-photocard/{id}
    public function update(Request $request, int $id)
    {
        if (! $request->hasFile('image_url')) {
            return response()->json(['error' => 'Gambar harus diunggah'], 400);
        }

        $image = $this->convertToWebp($request->file('image_url'));

        $affected = DB::table('creators_photocard')->where('id', $id)->update(['image_url' => $image]);

        if ($affected === 0) {
            return response()->json([
                'error' => "Row id={$id} tidak ditemukan di creators_photocard. Jalankan seed terlebih dahulu.",
            ], 404);
        }

        return response()->json([
            'message' => 'Creators photocard berhasil diperbarui',
            'imageUrl' => $image,
        ], 200);
    }

    // PUT /hainickkreatif/update-creators-photocard-statistics
    public function updateStatistics(Request $request)
    {
        $creators = $request->input('creators');
        $brand = $request->input('brand');
        $projects = $request->input('projects');

        if ($creators === null && $brand === null && $projects === null) {
            return response()->json(['error' => 'Tidak ada data yang dikirim'], 400);
        }

        $fields = [];
        if ($creators !== null) $fields['creators'] = $creators;
        if ($brand !== null) $fields['brand'] = $brand;
        if ($projects !== null) $fields['projects'] = $projects;

        $affected = DB::table('creators_photocard_statistics')->update($fields);

        if ($affected === 0) {
            return response()->json([
                'error' => 'Tidak ada row di creators_photocard_statistics. Jalankan seed terlebih dahulu.',
            ], 404);
        }

        return response()->json(['message' => 'Creators photocard statistics berhasil diperbarui'], 200);
    }

    // DELETE /hainickkreatif/delete-creators-photocard/{id}
    public function destroy(int $id)
    {
        DB::table('creators_photocard')->where('id', $id)->delete();
        return response()->json(['message' => 'Creators photocard berhasil dihapus'], 200);
    }

    // DELETE /hainickkreatif/delete-creators-photocard-statistics
    public function destroyStatistics()
    {
        DB::table('creators_photocard_statistics')->delete();
        return response()->json(['message' => 'Creators photocard statistics berhasil dihapus'], 200);
    }
}
