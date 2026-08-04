<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SchoolProfileController extends Controller
{
    public function edit()
    {
        $school = Auth::user()->school;

        return Inertia::render('Operator/Profile/Edit', [
            'school' => $school,
        ]);
    }

    public function update(Request $request)
    {
        $school = Auth::user()->school;

        $request->validate([
            'name' => 'required|string|max:255',
            'npsn' => 'required|string|max:50|unique:schools,npsn,' . $school->id,
            'jenjang' => 'required|string|in:SD,SMP,SMA,SMK',
            'status_akreditasi' => 'required|string|max:10',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'headmaster_name' => 'nullable|string|max:255',
            'headmaster_nip' => 'nullable|string|max:50',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        $data = $request->only([
            'name', 'npsn', 'jenjang', 'status_akreditasi',
            'address', 'phone', 'email', 'headmaster_name', 'headmaster_nip',
        ]);

        if ($request->hasFile('logo')) {
            if ($school->logo_kop_path && Storage::disk('public')->exists($school->logo_kop_path)) {
                Storage::disk('public')->delete($school->logo_kop_path);
            }
            $path = $request->file('logo')->store('logos', 'public');
            $data['logo_kop_path'] = '/storage/' . $path;
        }

        $school->update($data);

        return redirect()->back()->with('success', 'Profil Sekolah dan Logo Kop Surat berhasil diperbarui.');
    }
}
