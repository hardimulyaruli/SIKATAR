<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information including photo, signature, and stamp.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Update profile assets (photo, signature, stamp) for Disdik admin accounts.
     */
    public function updateAssets(Request $request): RedirectResponse
    {
        $user = $request->user();

        $request->validate([
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'signature'     => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'stamp'         => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        // Handle Profile Photo
        if ($request->boolean('delete_photo')) {
            if ($user->profile_photo_path) {
                $oldDiskPath = str_replace('/storage/', '', $user->profile_photo_path);
                if (Storage::disk('public')->exists($oldDiskPath)) {
                    Storage::disk('public')->delete($oldDiskPath);
                }
            }
            $user->profile_photo_path = null;
        } elseif ($request->hasFile('profile_photo')) {
            if ($user->profile_photo_path) {
                $oldDiskPath = str_replace('/storage/', '', $user->profile_photo_path);
                if (Storage::disk('public')->exists($oldDiskPath)) {
                    Storage::disk('public')->delete($oldDiskPath);
                }
            }
            $path = $request->file('profile_photo')->store('profile-photos', 'public');
            $user->profile_photo_path = '/storage/' . $path;
        }

        // Handle Signature
        if ($request->boolean('delete_signature')) {
            if ($user->signature_path) {
                $oldDiskPath = str_replace('/storage/', '', $user->signature_path);
                if (Storage::disk('public')->exists($oldDiskPath)) {
                    Storage::disk('public')->delete($oldDiskPath);
                }
            }
            $user->signature_path = null;
        } elseif ($request->hasFile('signature')) {
            if ($user->signature_path) {
                $oldDiskPath = str_replace('/storage/', '', $user->signature_path);
                if (Storage::disk('public')->exists($oldDiskPath)) {
                    Storage::disk('public')->delete($oldDiskPath);
                }
            }
            $path = $request->file('signature')->store('signatures', 'public');
            $user->signature_path = '/storage/' . $path;
        }

        // Handle Stamp
        if ($request->boolean('delete_stamp')) {
            if ($user->stamp_path) {
                $oldDiskPath = str_replace('/storage/', '', $user->stamp_path);
                if (Storage::disk('public')->exists($oldDiskPath)) {
                    Storage::disk('public')->delete($oldDiskPath);
                }
            }
            $user->stamp_path = null;
        } elseif ($request->hasFile('stamp')) {
            if ($user->stamp_path) {
                $oldDiskPath = str_replace('/storage/', '', $user->stamp_path);
                if (Storage::disk('public')->exists($oldDiskPath)) {
                    Storage::disk('public')->delete($oldDiskPath);
                }
            }
            $path = $request->file('stamp')->store('stamps', 'public');
            $user->stamp_path = '/storage/' . $path;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('success', 'Foto profil, tanda tangan, dan cap berhasil diperbarui.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        abort(403, 'Fitur penghapusan akun tidak diaktifkan.');
    }
}
