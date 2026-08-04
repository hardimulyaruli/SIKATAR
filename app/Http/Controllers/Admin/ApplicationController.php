<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LetterApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = LetterApplication::with(['school', 'user']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('application_number', 'like', '%' . $request->search . '%')
                  ->orWhere('subject', 'like', '%' . $request->search . '%')
                  ->orWhere('letter_name', 'like', '%' . $request->search . '%')
                  ->orWhereHas('school', function ($sq) use ($request) {
                      $sq->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $applications = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(LetterApplication $application)
    {
        $application->load(['school', 'user']);

        return Inertia::render('Admin/Applications/Show', [
            'application' => $application,
        ]);
    }

    public function updateStatus(Request $request, LetterApplication $application)
    {
        $request->validate([
            'status' => 'required|in:submitted,under_review,revision_requested,approved,rejected',
            'admin_notes' => 'nullable|string',
            'official_letter_number' => 'nullable|string',
        ]);

        $updateData = [
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ];

        if ($request->status === 'approved') {
            $updateData['official_letter_number'] = $request->official_letter_number ?? ('421/' . rand(100, 999) . '-Disdik/' . date('Y'));
            $updateData['approved_at'] = now();
        }

        $application->update($updateData);

        return redirect()->back()->with('success', 'Status pengajuan berhasil diperbarui.');
    }
}
