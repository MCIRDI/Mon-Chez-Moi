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
