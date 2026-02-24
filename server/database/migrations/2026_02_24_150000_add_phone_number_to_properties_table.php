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
        if (!Schema::hasColumn('properties', 'phone_number')) {
            Schema::table('properties', function (Blueprint $table) {
                $table->string('phone_number', 30)->nullable()->after('exact_address');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('properties', 'phone_number')) {
            Schema::table('properties', function (Blueprint $table) {
                $table->dropColumn('phone_number');
            });
        }
    }
};
