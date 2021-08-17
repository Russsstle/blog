<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
class UserController extends Controller
{
    public function getUsers() {
        return User::get();
    }

    public function getUsersById(Request $request) {
        return User::findOrFail($request->id);
    }
   
    public function updateUserById(Request $request) {
        $request->validate([
            'name'  => 'required',
            'email' => 'required',
            'role'  => 'required'
        ]);

       
        $user = user::find($request->id);
      
        $user->name = $request->name;
        $user->email = $request->email;
        $user->user_type = $request->role;
        $user->save();
    
        return response()->json(['message'=>'User Successfully Updated']);
    }

    public function deleteUserById(Request $request) {
        return User::with(['comments', 'articles'])->findOrFail($request->id)->delete();
    }
}
