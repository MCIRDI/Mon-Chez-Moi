<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PropertyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Authentication
Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::post('/logout',[AuthController::class,'logout'])->middleware(('auth:sanctum'));
//properties
Route::get('/properties',[PropertyController::class,'index']);
Route::get('/MyProperties',[PropertyController::class,'myProperties'])->middleware(('auth:sanctum'));

Route::get('/properties/filter', [PropertyController::class, 'getFilteredProperties']);


Route::get('/properties/{id}',[PropertyController::class,'show']);
Route::post('/properties', [PropertyController::class, 'store'])->middleware(('auth:sanctum'));//create a property
Route::put('/properties/{id}', [PropertyController::class, 'update'])->middleware(('auth:sanctum')); // update a property
Route::delete('/properties/{id}', [PropertyController::class, 'destroy'])->middleware(('auth:sanctum'));//delete a property
Route::get('/favorites', [PropertyController::class, 'getUserFavorites']);Route::post('/properties', [PropertyController::class, 'store'])->middleware(('auth:sanctum'));//create a property
Route::post('/storeFavorites', [PropertyController::class, 'storeFavorites'])->middleware(('auth:sanctum'));
Route::delete('/removeFromFavorites/{id}', [PropertyController::class, 'removeFromFavorites'])->middleware('auth:sanctum');
