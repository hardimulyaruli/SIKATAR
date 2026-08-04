<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\LetterApplication;
use App\Models\LetterTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $school = Auth::user()->school;

        $query = LetterApplication::with(['school', 'user'])
            ->where('school_id', $school->id ?? 0);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('application_number', 'like', '%' . $request->search . '%')
                  ->orWhere('subject', 'like', '%' . $request->search . '%')
                  ->orWhere('letter_name', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $applications = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Operator/Applications/Index', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(Request $request)
    {
        $school = Auth::user()->school;
        $templates = LetterTemplate::all();
        $selectedTemplate = null;

        if ($request->filled('template_code')) {
            $selectedTemplate = LetterTemplate::where('code', $request->template_code)->first();
        }

        if (!$selectedTemplate && $templates->count() > 0) {
            $selectedTemplate = $templates->first();
        }

        return Inertia::render('Operator/Applications/Create', [
            'school' => $school,
            'templates' => $templates,
            'selectedTemplate' => $selectedTemplate,
        ]);
    }

    public function store(Request $request)
    {
        $school = Auth::user()->school;

        $request->validate([
            'template_code' => 'required|string',
            'letter_name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'recipient' => 'required|string|max:255',
            'body_content' => 'required|string',
            'form_data' => 'nullable|array',
        ]);

        $appNumber = 'APP-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));

        $application = LetterApplication::create([
            'application_number' => $appNumber,
            'school_id' => $school->id,
            'user_id' => Auth::id(),
            'template_code' => $request->template_code,
            'letter_name' => $request->letter_name,
            'subject' => $request->subject,
            'recipient' => $request->recipient,
            'body_content' => $request->body_content,
            'form_data_json' => $request->form_data ?? [],
            'status' => 'submitted',
        ]);

        return redirect()->route('operator.applications.show', $application->id)
            ->with('success', 'Pengajuan surat berhasil dikirim ke Dinas Pendidikan KBB.');
    }

    public function show(LetterApplication $application)
    {
        $this->authorizeSchoolOwner($application);
        $application->load(['school', 'user']);

        return Inertia::render('Operator/Applications/Show', [
            'application' => $application,
            'school' => Auth::user()->school,
        ]);
    }

    public function update(Request $request, LetterApplication $application)
    {
        $this->authorizeSchoolOwner($application);

        $request->validate([
            'subject' => 'required|string|max:255',
            'recipient' => 'required|string|max:255',
            'body_content' => 'required|string',
            'form_data' => 'nullable|array',
        ]);

        $application->update([
            'subject' => $request->subject,
            'recipient' => $request->recipient,
            'body_content' => $request->body_content,
            'form_data_json' => $request->form_data ?? [],
            'status' => 'submitted',
            'admin_notes' => null,
        ]);

        return redirect()->back()->with('success', 'Perbaikan pengajuan surat berhasil dikirim ulang.');
    }

    private function authorizeSchoolOwner(LetterApplication $application)
    {
        $user = Auth::user();
        if ($user->role !== 'admin' && $application->school_id !== $user->school_id) {
            abort(403, 'Akses ditolak.');
        }
    }
}
