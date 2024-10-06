<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('api-token');
            return [
                'status' => 200,
                'token' => $token->plainTextToken
            ];
        } else {
            return [
                'status' => 401,
                'message' => 'These credentials do not match our records.'
            ];
        }
    }

    public function logout()
    {
        if (Auth::check()) {
            $user = Auth::user();
            $user->tokens()->delete();
            return ['status' => 200];
        }
    }

    public function user(Request $request)
    {
        return $request->user();
    }
}
