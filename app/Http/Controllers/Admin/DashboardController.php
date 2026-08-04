<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\LetterApplication;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalSchools = School::count();
        $totalApplications = LetterApplication::count();
        $pendingApplications = LetterApplication::whereIn('status', ['submitted', 'under_review'])->count();
        $revisionApplications = LetterApplication::where('status', 'revision_requested')->count();
        $approvedApplications = LetterApplication::where('status', 'approved')->count();

        $recentApplications = LetterApplication::with('school', 'user')
            ->latest()
            ->take(6)
            ->get();

        $schoolsSummary = School::withCount('letterApplications')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_schools' => $totalSchools,
                'total_applications' => $totalApplications,
                'pending_applications' => $pendingApplications,
                'revision_applications' => $revisionApplications,
                'approved_applications' => $approvedApplications,
            ],
            'recent_applications' => $recentApplications,
            'schools_summary' => $schoolsSummary,
        ]);
    }
}
