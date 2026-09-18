<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ForceChangePasswordController extends Controller
{
    /**
     * Tampilkan form ganti password wajib (pertama kali login).
     */
    public function show()
    {
        return Inertia::render('Auth/ForceChangePassword');
    }

    /**
     * Proses perubahan password.
     */
    public function update(Request $request)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = $request->user();

        // Pastikan password baru berbeda dari yang lama
        if (Hash::check($request->password, $user->password)) {
            return back()->withErrors([
                'password' => 'Password baru tidak boleh sama dengan password lama.',
            ]);
        }

        $user->update([
            'password' => $request->password,
            'must_change_password' => false,
        ]);

        $role = $user->role;
        return redirect($role === 'admin' ? '/admin/dashboard' : '/operator/dashboard')
            ->with('success', 'Password berhasil diubah! Selamat datang di SIKATAR.');
    }
}
