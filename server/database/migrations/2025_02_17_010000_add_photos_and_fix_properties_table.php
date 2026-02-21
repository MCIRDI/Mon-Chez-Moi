<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('photo1')->nullable()->after('id_user');
            $table->string('photo2')->nullable()->after('photo1');
            $table->string('photo3')->nullable()->after('photo2');
        });

        // Fix the enum values for PostgreSQL - convert to VARCHAR with CHECK constraint
        DB::statement("ALTER TABLE properties ALTER COLUMN type TYPE VARCHAR(20)");
        DB::statement("ALTER TABLE properties ADD CONSTRAINT check_properties_type CHECK (type IN ('House', 'Villa', 'Apartment', 'Shop', 'Appartement', 'Boutique'))");
        
        // Make floor nullable
        Schema::table('properties', function (Blueprint $table) {
            $table->integer('floor')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['photo1', 'photo2', 'photo3']);
        });

        // Remove check constraint for PostgreSQL
        DB::statement("ALTER TABLE properties DROP CONSTRAINT IF EXISTS check_properties_type");
        
        Schema::table('properties', function (Blueprint $table) {
            $table->integer('floor')->nullable(false)->change();
        });
    }
};
