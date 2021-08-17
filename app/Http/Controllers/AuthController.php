<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\User;

class AuthController extends Controller
{

    public function register(Request $request) 
    {
        $request->validate([
            'name'     => 'required',
            'email'    => 'required|email',
            'password' => 'required_with:confirmPassword|same:confirmPassword|min:8',
            'confirmPassword' => 'min:8'
        ]);

        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'user_type' => $request->role
        ]);
        $user->save();

        return response()->json(['message'=>'success']);
    }

    public function login(Request $request) 
    {
        $request->validate([
            'email'    => 'required|email|exists:users,email',
            'password' => 'required|min:8'
        ]);

        if ($token = Auth::attempt(['email' => $request->email, 'password' => $request->password]))
        {
            return response()->json([
                'user' => Auth::user(),
                'token' => $token
            ]);
        } 

        return response()->json(['errorResult'=>'unauthorized']);
    }

    public function checkUser()
    {
        if (Auth::check() === false) return response()->json([], 403);

        return ['user' => Auth::user()];
    }
}
