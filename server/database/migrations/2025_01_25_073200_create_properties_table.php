<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->constrained('users')->onDelete('cascade');
        //  $table->string('image')->nullable();
            $table->enum('type', ['House', 'Villa', 'Appartement', 'Boutique']);
            $table->enum('rent_or_sale', ['rent', 'sale']);
            $table->float('price');
            $table->string('state');
            $table->string('municipality');
            $table->string('exact_address'); //adress inside the munipality
            $table->integer('space');// Space in square meters
            $table->integer('number_rooms');// Number of rooms
            $table->integer('floor');//number of floors if it is a villa or house, and in wich  floor it is if it a apartment or shop
            $table->text('description')->nullable();
            $table->json('features')->nullable(); //(e.g., Livret foncier, Zone commerciale, Électricité, Gaz, Jardin, Chauffage central, Eau)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
