<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PropertyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is running',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0'
    ]);
});

// Database connection test endpoint
Route::get('/db-test', function () {
    try {
        // Debug: Show all environment variables
        $envVars = [
            'DB_CONNECTION' => env('DB_CONNECTION'),
            'DB_HOST' => env('DB_HOST'),
            'DB_PORT' => env('DB_PORT'),
            'DB_DATABASE' => env('DB_DATABASE'),
            'DB_USERNAME' => env('DB_USERNAME'),
            'DB_PASSWORD' => env('DB_PASSWORD') ? '***SET***' : 'NOT_SET',
        ];
        
        // Test database connection
        \DB::connection()->getPdo();
        $databaseName = \DB::connection()->getDatabaseName();
        
        // Test if users table exists
        $usersTableExists = \Schema::hasTable('users');
        
        // Test if migrations table exists
        $migrationsTableExists = \Schema::hasTable('migrations');
        
        return response()->json([
            'database_connection' => 'success',
            'database_name' => $databaseName,
            'users_table_exists' => $usersTableExists,
            'migrations_table_exists' => $migrationsTableExists,
            'environment_variables' => $envVars,
            'db_config' => [
                'driver' => config('database.default'),
                'connection' => config('database.connections.pgsql.host'),
                'port' => config('database.connections.pgsql.port'),
                'database' => config('database.connections.pgsql.database'),
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'database_connection' => 'failed',
            'error' => $e->getMessage(),
            'environment_variables' => [
                'DB_CONNECTION' => env('DB_CONNECTION'),
                'DB_HOST' => env('DB_HOST'),
                'DB_PORT' => env('DB_PORT'),
                'DB_DATABASE' => env('DB_DATABASE'),
                'DB_USERNAME' => env('DB_USERNAME'),
                'DB_PASSWORD' => env('DB_PASSWORD') ? '***SET***' : 'NOT_SET',
            ],
            'db_config' => [
                'driver' => config('database.default'),
                'connection' => config('database.connections.pgsql.host'),
                'port' => config('database.connections.pgsql.port'),
                'database' => config('database.connections.pgsql.database'),
            ]
        ], 500);
    }
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Authentication
Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::post('/logout',[AuthController::class,'logout'])->middleware(('auth:sanctum'));
Route::post('/forgot-password',[AuthController::class,'forgotPassword']);
Route::post('/reset-password',[AuthController::class,'resetPassword']);
//properties
Route::get('/properties',[PropertyController::class,'index']);
Route::get('/MyProperties',[PropertyController::class,'myProperties'])->middleware(('auth:sanctum'));

Route::get('/properties/filter', [PropertyController::class, 'getFilteredProperties']);


Route::get('/properties/{id}',[PropertyController::class,'show']);
Route::post('/properties', [PropertyController::class, 'store'])->middleware(('auth:sanctum'));//create a property
Route::match(['put', 'post'], '/properties/{id}', [PropertyController::class, 'update'])->middleware(('auth:sanctum')); // update a property
Route::delete('/properties/{id}', [PropertyController::class, 'destroy'])->middleware(('auth:sanctum'));//delete a property
Route::get('/favorites', [PropertyController::class, 'getUserFavorites'])->middleware('auth:sanctum');
Route::post('/storeFavorites', [PropertyController::class, 'storeFavorites'])->middleware(('auth:sanctum'));
Route::delete('/removeFromFavorites/{id}', [PropertyController::class, 'removeFromFavorites'])->middleware('auth:sanctum');
