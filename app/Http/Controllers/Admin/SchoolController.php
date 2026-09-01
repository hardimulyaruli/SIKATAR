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

    public function store(Request $request)
    {
        $request->validate([
            'npsn' => 'required|string|max:20|unique:schools,npsn',
            'name' => 'required|string|max:255',
            'jenjang' => 'required|string|in:SD,SMP,SMA,SMK',
            'status_akreditasi' => 'nullable|string|max:10',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'headmaster_name' => 'nullable|string|max:255',
            'headmaster_nip' => 'nullable|string|max:50',
            // Operator Account details
            'operator_name' => 'required|string|max:255',
            'operator_email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $school = School::create([
            'npsn' => $request->npsn,
            'name' => $request->name,
            'jenjang' => $request->jenjang,
            'status_akreditasi' => $request->status_akreditasi ?? 'A',
            'address' => $request->address,
            'phone' => $request->phone,
            'email' => $request->email,
            'headmaster_name' => $request->headmaster_name,
            'headmaster_nip' => $request->headmaster_nip,
        ]);

        \App\Models\User::create([
            'name' => $request->operator_name,
            'email' => $request->operator_email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => 'operator',
            'school_id' => $school->id,
        ]);

        return redirect()->back()->with('success', 'Sekolah baru dan Akun Operator berhasil dibuat!');
    }

    public function storeUser(Request $request, School $school)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => 'operator',
            'school_id' => $school->id,
        ]);

        return redirect()->back()->with('success', 'Akun Operator baru untuk ' . $school->name . ' berhasil dibuat!');
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
