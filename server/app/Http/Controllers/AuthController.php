<?php

namespace App\Http\Controllers;
use Hash;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
  public function register(Request $request){


        try {
            $fields=$request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:8|confirmed',
                   ]);
            $user=User::create($fields);
            $token=$user->createToken($request->name);
            return response()->json([
             'user' => [
                'id' => $user->id,
                'name' => $user->name,

             ],                'token' => $token,
            ], 201);
            } catch (\Exception $e) {
                //if i do not add the try catch laravel dont return the errors when validating $filds
            return response()->json(['error' => $e->getMessage()], 500);
        }


  }

public function login(Request $request){
    try {
    $request->validate(['email'=>'required|email','password'=>'required']);
    $user=User::where('email',$request->email)->first();
        if(!$user || !Hash::check($request->password,$user->password)){
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);// 401 Unauthorized
        }
        $token=$user->createToken($request->password);
        return response()->json([
             'user' => [
                'id' => $user->id,
                'name' => $user->name,

             ],
             'token' => $token,
            ], 200); // 200 OK
     }catch (\Exception $e) {
            //if i do not add the try catch laravel dont return the errors when validating $filds
        return response()->json(['error' => $e->getMessage()], 500);
        }
}

public function logout(Request $request)
{
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Logged out successfully',
        ], 200); // 200 OK

}}
