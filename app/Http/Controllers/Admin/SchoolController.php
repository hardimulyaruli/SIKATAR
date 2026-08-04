<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolController extends Controller
{
    public function index(Request $request)
    {
        $query = School::withCount('letterApplications');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('npsn', 'like', '%' . $request->search . '%')
                  ->orWhere('address', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('jenjang')) {
            $query->where('jenjang', $request->jenjang);
        }

        $schools = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Schools/Index', [
            'schools' => $schools,
            'filters' => $request->only(['search', 'jenjang']),
        ]);
    }

    public function show(School $school)
    {
        $school->load(['users', 'letterApplications' => function ($q) {
            $q->latest();
        }]);

        return Inertia::render('Admin/Schools/Show', [
            'school' => $school,
        ]);
    }
}
