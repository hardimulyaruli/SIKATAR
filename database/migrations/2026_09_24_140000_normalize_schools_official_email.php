<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Normalizes school official emails by removing the 'operator.' login prefix,
     * ensuring school email reflects institutional contact rather than operator login account.
     */
    public function up(): void
    {
        DB::table('schools')
            ->where('email', 'like', 'operator.%')
            ->chunkById(100, function ($schools) {
                foreach ($schools as $school) {
                    $cleanEmail = preg_replace('/^operator\./i', '', $school->email);
                    DB::table('schools')
                        ->where('id', $school->id)
                        ->update(['email' => $cleanEmail]);
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reverse needed as stripping the operator prefix restores institutional school emails.
    }
};
