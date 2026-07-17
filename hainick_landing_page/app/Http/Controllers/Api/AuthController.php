<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    // GET /hainickkreatif/login
    public function login(Request $request)
    {
        $username = $request->query('username');
        $password = $request->query('password');

        $result = DB::table('login')
            ->where('username', $username)
            ->where('password', $password)
            ->first();

        if (! $result) {
            return response()->json(['error' => 'Username atau password salah!'], 401);
        }

        return response()->json(['message' => 'Login berhasil!'], 200);
    }
}
