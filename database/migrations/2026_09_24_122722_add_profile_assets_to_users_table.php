<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add profile photo, signature, and stamp columns to users table
     * for Disdik admin accounts.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_photo_path')->nullable()->after('must_change_password');
            $table->string('signature_path')->nullable()->after('profile_photo_path');
            $table->string('stamp_path')->nullable()->after('signature_path');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['profile_photo_path', 'signature_path', 'stamp_path']);
        });
    }
};
