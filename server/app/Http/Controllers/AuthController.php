<?php

namespace App\Http\Controllers;
use Hash;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use App\Notifications\PasswordResetNotification;

class AuthController extends Controller
{
  public function register(Request $request){

        try {
            \Log::info('Registration attempt', ['request_data' => $request->all()]);
            
            $fields=$request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:8|confirmed',
                   ]);
            
            \Log::info('Validation passed', ['fields' => $fields]);
            
            // Hash the password
            $fields['password'] = bcrypt($fields['password']);
            
            \Log::info('Password hashed, creating user');
            
            $user=User::create($fields);
            
            \Log::info('User created successfully', ['user_id' => $user->id]);
            
            $token=$user->createToken($request->name);
            
            \Log::info('Token created successfully');
            
            return response()->json([
             'user' => [
                'id' => $user->id,
                'name' => $user->name,

             ],                'token' => $token,
            ], 201);
            } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed', ['errors' => $e->errors(), 'request_data' => $request->all()]);
            return response()->json([
                'error' => 'Validation failed', 
                'details' => $e->errors(),
                'request_data' => $request->all()
            ], 422);
        } catch (\Throwable $e) {
            \Log::error('Registration error', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
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
     }catch (\Throwable $e) {
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
}

public function forgotPassword(Request $request)
{
    try {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();
        
        // Generate password reset token
        $token = Str::random(60);
        
        // Store the token in password_resets table
        \DB::table('password_resets')->updateOrInsert(
            ['email' => $user->email],
            [
                'email' => $user->email,
                'token' => bcrypt($token),
                'created_at' => now()
            ]
        );

        // Send the password reset notification
        $user->notify(new PasswordResetNotification($token));
        
        return response()->json([
            'message' => 'Password reset instructions have been sent to your email address.',
        ], 200);
        
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'message' => 'The provided email address was not found in our system.',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Throwable $e) {
        \Log::error('Password reset error: ' . $e->getMessage());
        return response()->json([
            'message' => 'An error occurred while processing your request.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

public function resetPassword(Request $request)
{
    try {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        // Find the password reset record
        $resetRecord = \DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'Invalid password reset token.',
            ], 422);
        }

        // Verify the token (check against the hashed token)
        if (!Hash::check($request->token, $resetRecord->token)) {
            return response()->json([
                'message' => 'Invalid password reset token.',
            ], 422);
        }

        // Check if token has expired (default 60 minutes)
        $expiresAt = now()->subMinutes(config('auth.passwords.users.expire', 60));
        if ($resetRecord->created_at < $expiresAt) {
            // Delete expired token
            \DB::table('password_resets')
                ->where('email', $request->email)
                ->delete();
            
            return response()->json([
                'message' => 'Password reset token has expired. Please request a new one.',
            ], 422);
        }

        // Update the user's password
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the password reset record
        \DB::table('password_resets')
            ->where('email', $request->email)
            ->delete();
        
        return response()->json([
            'message' => 'Password has been reset successfully.',
        ], 200);
        
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'message' => 'Validation failed.',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Throwable $e) {
        \Log::error('Password reset error: ' . $e->getMessage());
        return response()->json([
            'message' => 'An error occurred while resetting your password.',
            'error' => $e->getMessage(),
        ], 500);
    }
}
}
