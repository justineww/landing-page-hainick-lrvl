<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TestimonialController extends Controller
{
    use ConvertsToWebp;

    // GET /hainickkreatif/testimonials
    public function index()
    {
        $result = DB::table('testimonials')->get();
        return response()->json($result, 200);
    }

    // POST /hainickkreatif/create-testimonials
    public function store(Request $request)
    {
        $name = $request->input('name');
        $testimonial = $request->input('testimonial');

        $image = null;
        if ($request->hasFile('profile_image')) {
            $image = $this->convertToWebp($request->file('profile_image'));
        }

        $id = DB::table('testimonials')->insertGetId([
            'profile_image' => $image,
            'testimonial' => $testimonial,
            'name' => $name,
        ]);

        return response()->json([
            'message' => 'Testimonial berhasil ditambahkan',
            'id' => $id,
        ], 201);
    }

    // PUT /hainickkreatif/update-testimonials/{id}
    public function update(Request $request, int $id)
    {
        $fields = [];

        if ($request->filled('name')) {
            $fields['name'] = $request->input('name');
        }
        if ($request->filled('testimonial')) {
            $fields['testimonial'] = $request->input('testimonial');
        }
        if ($request->hasFile('profile_image')) {
            $fields['profile_image'] = $this->convertToWebp($request->file('image'));
        }

        if (empty($fields)) {
            return response()->json(['error' => 'Tidak ada data yang diperbarui'], 400);
        }

        DB::table('testimonials')->where('id', $id)->update($fields);

        return response()->json(['message' => 'Testimonial berhasil diperbarui'], 200);
    }

    // DELETE /hainickkreatif/delete-testimonials/{id}
    public function destroy(int $id)
    {
        DB::table('testimonials')->where('id', $id)->delete();
        return response()->json(['message' => 'Testimonial berhasil dihapus'], 200);
    }
}
