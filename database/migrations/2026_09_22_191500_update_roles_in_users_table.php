<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing admin users to staff_kepala
        DB::table('users')
            ->where('role', 'admin')
            ->update(['role' => 'staff_kepala']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('users')
            ->where('role', 'staff_kepala')
            ->update(['role' => 'admin']);
    }
};
