<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StaffUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@disdik.kbb.go.id'],
            [
                'name' => 'Kepala Staf Disdik KBB',
                'password' => Hash::make('password'),
                'role' => 'staff_kepala',
                'school_id' => null,
            ]
        );

        User::firstOrCreate(
            ['email' => 'staff@disdik.kbb.go.id'],
            [
                'name' => 'Staf Verifikator Disdik',
                'password' => Hash::make('password'),
                'role' => 'staff_biasa',
                'school_id' => null,
            ]
        );
    }
}
