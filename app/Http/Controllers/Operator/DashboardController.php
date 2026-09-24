<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\LetterApplication;
use App\Models\LetterTemplate;
use App\Services\RetirementService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(RetirementService $retirementService)
    {
        $user = Auth::user();
        $school = $user->school;
        $schoolId = $school->id ?? 0;

        // Otomatis sinkronisasi pegawai yang telah mencapai batas usia pensiun
        $retirementService->syncRetirements($schoolId);

        // Ambil daftar pegawai yang mendekati masa pensiun (tahun terakhir, usia 59-60)
        $approachingEmployees = $retirementService->getApproachingRetirementEmployees($schoolId);

        $totalApplications = LetterApplication::where('school_id', $schoolId)->count();
        $pendingApplications = LetterApplication::where('school_id', $schoolId)->whereIn('status', ['submitted', 'under_review'])->count();
        $revisionApplications = LetterApplication::where('school_id', $schoolId)->where('status', 'revision_requested')->count();
        $approvedApplications = LetterApplication::where('school_id', $schoolId)->where('status', 'approved')->count();

        $recentApplications = LetterApplication::where('school_id', $schoolId)
            ->latest()
            ->take(5)
            ->get();

        $templates = LetterTemplate::all();

        return Inertia::render('Operator/Dashboard', [
            'school' => $school,
            'stats' => [
                'total' => $totalApplications,
                'pending' => $pendingApplications,
                'revision' => $revisionApplications,
                'approved' => $approvedApplications,
            ],
            'recent_applications' => $recentApplications,
            'templates' => $templates,
            'approachingPensionEmployees' => $approachingEmployees,
            'approachingPensionCount' => $approachingEmployees->count(),
        ]);
    }
}
