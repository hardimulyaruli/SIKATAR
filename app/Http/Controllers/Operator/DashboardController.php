<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\LetterApplication;
use App\Models\LetterTemplate;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $school = $user->school;

        $totalApplications = LetterApplication::where('school_id', $school->id ?? 0)->count();
        $pendingApplications = LetterApplication::where('school_id', $school->id ?? 0)->whereIn('status', ['submitted', 'under_review'])->count();
        $revisionApplications = LetterApplication::where('school_id', $school->id ?? 0)->where('status', 'revision_requested')->count();
        $approvedApplications = LetterApplication::where('school_id', $school->id ?? 0)->where('status', 'approved')->count();

        $recentApplications = LetterApplication::where('school_id', $school->id ?? 0)
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
        ]);
    }
}
