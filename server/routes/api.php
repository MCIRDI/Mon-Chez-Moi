<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PropertyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return "KHADMET BSAHTEK";
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Authentication
Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::post('/logout',[AuthController::class,'logout'])->middleware(('auth:sanctum'));
//properties
Route::get('/properties',[PropertyController::class,'index']);
Route::get('/properties/{id}',[PropertyController::class,'show']);
Route::post('/properties', [PropertyController::class, 'store'])->middleware(('auth:sanctum'));//create a property
Route::put('/properties/{id}', [PropertyController::class, 'update'])->middleware(('auth:sanctum')); // update a property
Route::delete('/properties/{id}', [PropertyController::class, 'destroy'])->middleware(('auth:sanctum'));//delete a property
Route::get('/properties/filter', [PropertyController::class, 'getFilteredProperties']);
