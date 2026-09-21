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
            'signature' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'stamp' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        $data = $request->only([
            'name', 'npsn', 'jenjang', 'status_akreditasi',
            'address', 'phone', 'email', 'headmaster_name', 'headmaster_nip',
        ]);

        if ($request->hasFile('logo')) {
            if ($school->logo_kop_path) {
                $oldDiskPath = str_replace('/storage/', '', $school->logo_kop_path);
                if (Storage::disk('public')->exists($oldDiskPath)) {
                    Storage::disk('public')->delete($oldDiskPath);
                }
            }
            $path = $request->file('logo')->store('logos', 'public');
            $data['logo_kop_path'] = '/storage/' . $path;
        }

        if ($request->hasFile('signature')) {
            if ($school->signature_path) {
                $oldDiskPath = str_replace('/storage/', '', $school->signature_path);
                if (Storage::disk('public')->exists($oldDiskPath)) {
                    Storage::disk('public')->delete($oldDiskPath);
                }
            }
            $path = $request->file('signature')->store('signatures', 'public');
            $data['signature_path'] = '/storage/' . $path;
        }

        if ($request->hasFile('stamp')) {
            if ($school->stamp_path) {
                $oldDiskPath = str_replace('/storage/', '', $school->stamp_path);
                if (Storage::disk('public')->exists($oldDiskPath)) {
                    Storage::disk('public')->delete($oldDiskPath);
                }
            }
            $path = $request->file('stamp')->store('stamps', 'public');
            $data['stamp_path'] = '/storage/' . $path;
        }

        $school->update($data);

        return redirect()->back()->with('success', 'Profil Sekolah, Logo Kop, Tanda Tangan, dan Cap Stempel berhasil diperbarui.');
    }
}
