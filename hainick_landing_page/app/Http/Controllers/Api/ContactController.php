<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContactController extends Controller
{
    use ConvertsToWebp;

    // GET /hainickkreatif/contact
    public function index()
    {
        $result = DB::table('contact')->get();
        return response()->json($result, 200);
    }

    // PUT /hainickkreatif/update-contact
    public function update(Request $request)
    {
        $fields = [];

        if ($request->hasFile('logo')) {
            $fields['logo'] = $this->convertToWebp($request->file('logo'));
        }
        if ($request->filled('instagram')) {
            $fields['instagram'] = $request->input('instagram');
        }
        if ($request->filled('gmail')) {
            $fields['gmail'] = $request->input('gmail');
        }
        if ($request->filled('phone_number1')) {
            $fields['phone_number1'] = $request->input('phone_number1');
        }
        if ($request->filled('phone_number2')) {
            $fields['phone_number2'] = $request->input('phone_number2');
        }

        if (empty($fields)) {
            return response()->json(['error' => 'Tidak ada data yang diperbarui'], 400);
        }

        DB::table('contact')->update($fields);

        return response()->json(['message' => 'Kontak berhasil diperbarui'], 200);
    }

    // DELETE /hainickkreatif/delete-contact
    public function destroy()
    {
        DB::table('contact')->delete();
        return response()->json(['message' => 'Kontak berhasil dihapus'], 200);
    }

    // GET /hainickkreatif/contact-form
    public function indexForm()
    {
        $result = DB::table('contact_form')->orderBy('id', 'desc')->get();
        return response()->json($result, 200);
    }

    // POST /hainickkreatif/create-contact-form
    public function storeForm(Request $request)
    {
        $firstName = trim((string) $request->input('first_name'));
        $lastName = trim((string) $request->input('last_name'));
        $email = trim((string) $request->input('email'));
        $message = trim((string) $request->input('message'));

        if (! $firstName) return response()->json(['error' => 'First name harus diisi'], 400);
        if (! $lastName) return response()->json(['error' => 'Last name harus diisi'], 400);
        if (! $email) return response()->json(['error' => 'Email harus diisi'], 400);
        if (! $message) return response()->json(['error' => 'Pesan harus diisi'], 400);

        $id = DB::table('contact_form')->insertGetId([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'message' => $message,
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Pesan berhasil dikirim!',
            'id' => $id,
        ], 201);
    }

    // DELETE /hainickkreatif/delete-contact-form/{id}
    public function destroyForm(int $id)
    {
        $affected = DB::table('contact_form')->where('id', $id)->delete();

        if ($affected === 0) {
            return response()->json(['error' => 'Pesan tidak ditemukan'], 404);
        }

        return response()->json(['message' => 'Pesan berhasil dihapus'], 200);
    }
}
