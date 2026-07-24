<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CreatorController extends Controller
{
    use ConvertsToWebp;

    // GET /hainickkreatif/creators
    public function index()
    {
        $result = DB::table('creators')->get();
        return response()->json($result, 200);
    }

    // POST /hainickkreatif/create-creators
   public function store(Request $request)
    {
        try {
            $name = $request->input('name');
            if (! $name) {
                return response()->json(['error' => 'Nama harus diisi'], 400);
            }

            $instagram = (int) ($request->input('followers_instagram') ?? 0);
            $tiktok = (int) ($request->input('followers_tiktok') ?? 0);
            $xFollowers = (int) ($request->input('followers_x') ?? 0);
            $urlIg = $request->input('url_instagram', '');
            $urlTiktok = $request->input('url_tiktok', '');
            $urlX = $request->input('url_x', '');


            $image = null;
            if ($request->hasFile('profile_image')) {
                $image = $this->convertToWebp($request->file('profile_image'));
            }

            $roles = '';
            if ($request->filled('roles')) {
                $roles = collect(explode(',', $request->input('roles')))
                    ->map(fn ($r) => trim($r))
                    ->filter()
                    ->implode(',');
            }

            $id = DB::table('creators')->insertGetId([
                'name' => $name,
                'profile_image' => $image,
                'followers_tiktok' => $tiktok,
                'followers_instagram' => $instagram,
                'followers_x' => $xFollowers,
                'url_instagram' => $urlIg,
                'url_tiktok' => $urlTiktok,
                'url_x' => $urlX,
                'roles' => $roles,
            ]);

            return response()->json([
                'message' => 'Creator berhasil ditambahkan',
                'id' => $id,
            ], 201);

        } catch (\Exception $e) {
            // This catches the fatal error and sends it to your API Tester
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    // PUT /hainickkreatif/update-creators/{id}
    public function update(Request $request, int $id)
    {
        $fields = [];

        if ($request->filled('name')) {
            $fields['name'] = $request->input('name');
        }
        $fields['followers_instagram'] = (int) ($request->input('followers_instagram') ?? 0);
        $fields['followers_tiktok'] = (int) ($request->input('followers_tiktok') ?? 0);
        $fields['followers_x'] = (int) ($request->input('followers_x') ?? 0);

        if ($request->filled('url_instagram')) {
            $fields['url_instagram'] = $request->input('url_instagram');
        }
        if ($request->filled('url_tiktok')) {
            $fields['url_tiktok'] = $request->input('url_tiktok');
        }
        if ($request->filled('url_x')) {
            $fields['url_x'] = $request->input('url_x');
        }
        if ($request->filled('roles')) {
            $roles = collect(explode(',', $request->input('roles')))
                ->map(fn ($r) => trim($r))
                ->filter()
                ->implode(',');
            $fields['roles'] = $roles;
        }

        if ($request->hasFile('profile_image')) {
            $fields['profile_image'] = $this->convertToWebp($request->file('profile_image'));
        }

        if (empty($fields)) {
            return response()->json(['error' => 'Tidak ada data yang diperbarui'], 400);
        }

        DB::table('creators')->where('id', $id)->update($fields);

        return response()->json(['message' => 'Creator berhasil diperbarui'], 200);
    }

    // DELETE /hainickkreatif/delete-creators/{id}
    public function destroy(int $id)
    {
        DB::table('creators')->where('id', $id)->delete();
        return response()->json(['message' => 'Creator berhasil dihapus'], 200);
    }

    // POST /hainickkreatif/create-role
    // NOTE: the original app used a MySQL SET() column and ALTER TABLE to add
    // new allowed values. That's modeled here as a simple comma-separated
    // "roles catalogue" check against the distinct roles already in use,
    // since Laravel migrations don't manage SET columns well. If you need
    // an actual dynamic SET column, run raw ALTER TABLE via DB::statement
    // as shown commented below.
    public function createRole(Request $request)
    {
        $newRole = $request->input('newRole');

        $columnType = DB::selectOne("SHOW COLUMNS FROM creators LIKE 'roles'");
        if (! $columnType) {
            return response()->json(['error' => 'Failed getting SET values'], 500);
        }

        // If your `roles` column truly is a SET(...) type in MySQL:
        preg_match('/^set\((.*)\)$/i', $columnType->Type, $matches);
        $values = isset($matches[1])
            ? array_map(fn ($v) => trim($v, "'"), explode(',', $matches[1]))
            : [];

        if (in_array($newRole, $values)) {
            return response()->json(['message' => 'Role already exists']);
        }

        $values[] = $newRole;
        $updatedSet = implode(',', array_map(fn ($v) => "'{$v}'", $values));

        DB::statement("ALTER TABLE creators MODIFY roles SET({$updatedSet})");

        return response()->json(['message' => 'Role added successfully']);
    }

    // PUT /hainickkreatif/remove-role/{id}
    public function removeRole(Request $request, int $id)
    {
        $roleToRemove = $request->input('role');

        $creator = DB::table('creators')->where('id', $id)->first();
        if (! $creator) {
            return response()->json(['error' => 'Creator tidak ditemukan'], 404);
        }

        $roleArray = $creator->roles
            ? array_filter(explode(',', $creator->roles), fn ($r) => $r !== $roleToRemove)
            : [];

        DB::table('creators')->where('id', $id)->update([
            'roles' => implode(',', $roleArray),
        ]);

        return response()->json(['message' => 'Role removed']);
    }
}
