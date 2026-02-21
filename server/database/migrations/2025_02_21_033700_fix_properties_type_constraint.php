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
        // Drop the old constraint
        DB::statement("ALTER TABLE properties DROP CONSTRAINT IF EXISTS check_properties_type");
        
        // Add new constraint with both English and French spellings
        DB::statement("ALTER TABLE properties ADD CONSTRAINT check_properties_type CHECK (type IN ('House', 'Villa', 'Apartment', 'Shop', 'Appartement', 'Boutique'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the new constraint
        DB::statement("ALTER TABLE properties DROP CONSTRAINT IF EXISTS check_properties_type");
        
        // Add back the old constraint (French only)
        DB::statement("ALTER TABLE properties ADD CONSTRAINT check_properties_type CHECK (type IN ('House', 'Villa', 'Appartement', 'Boutique'))");
    }
};
