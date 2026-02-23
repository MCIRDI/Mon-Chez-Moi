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
        Schema::table('properties', function (Blueprint $table) {
            $table->longText('photo1_data')->nullable()->after('photo1');
            $table->string('photo1_mime', 120)->nullable()->after('photo1_data');
            $table->longText('photo2_data')->nullable()->after('photo2');
            $table->string('photo2_mime', 120)->nullable()->after('photo2_data');
            $table->longText('photo3_data')->nullable()->after('photo3');
            $table->string('photo3_mime', 120)->nullable()->after('photo3_data');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'photo1_data',
                'photo1_mime',
                'photo2_data',
                'photo2_mime',
                'photo3_data',
                'photo3_mime',
            ]);
        });
    }
};

