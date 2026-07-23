<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    // Menerima request GET maupun POST dari /hainickkreatif/login
    public function login(Request $request)
    {
        // Gunakan input() agar bisa membaca dari POST JSON body maupun GET Query String
        $username = $request->input('username', $request->query('username'));
        $password = $request->input('password', $request->query('password'));

        if (!$username || !$password) {
            return response()->json([
                'success' => false,
                'error' => 'Username dan password tidak boleh kosong!'
            ], 400);
        }

        $result = DB::table('login')
            ->where('username', $username)
            ->where('password', $password)
            ->first();

        if (!$result) {
            return response()->json([
                'success' => false,
                'error' => 'Username atau password salah!'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil!',
            'token' => 'session_' . md5($result->username . time()), // Token dummy agar auth frontend terisi
            'user' => [
                'username' => $result->username
            ]
        ], 200);
    }
}