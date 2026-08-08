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
            'received_date' => 'nullable|string',
            'received_by_name' => 'nullable|string',
            'received_by_title' => 'nullable|string',
            'received_by_nip' => 'nullable|string',
        ]);

        $updateData = [
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ];

        if ($request->status === 'approved') {
            if (!$request->filled('official_letter_number')) {
                $template = \App\Models\LetterTemplate::where('code', $application->template_code)->first();
                $classCode = $template->classification_code ?? '800.1.3.2';
                $sequence = str_pad(rand(100, 9999), 4, '0', STR_PAD_LEFT);
                $updateData['official_letter_number'] = "{$classCode}/{$sequence}-Sekre/" . date('Y');
            } else {
                $updateData['official_letter_number'] = $request->official_letter_number;
            }
            $updateData['approved_at'] = now();

            // Save verification receipt details in form_data_json
            $formData = $application->form_data_json ?? [];
            if ($request->filled('received_by_name') || $request->filled('received_date')) {
                $formData['received_date'] = $request->received_date ?? date('d F Y');
                $formData['received_by_name'] = $request->received_by_name;
                $formData['received_by_title'] = $request->received_by_title;
                $formData['received_by_nip'] = $request->received_by_nip;
                $updateData['form_data_json'] = $formData;
            }
        }

        $application->update($updateData);

        return redirect()->back()->with('success', 'Status pengajuan berhasil diperbarui.');
    }
}
