<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        // Query data pegawai beserta relasi sekolah
        $query = Employee::with('school');

        // Filter pencarian berdasarkan nama pegawai, NIP, atau nama sekolah
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('nip', 'like', '%' . $request->search . '%')
                  ->orWhereHas('school', function ($sq) use ($request) {
                      $sq->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        // Filter spesifik berdasarkan ID sekolah
        if ($request->filled('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        // Filter spesifik berdasarkan status kepegawaian (PNS, PPPK, Honorer)
        if ($request->filled('status_pegawai')) {
            $query->where('status_pegawai', $request->status_pegawai);
        }

        // Pengurutan berbasis indeks ID dan pagination 15 data per halaman
        $employees = $query->orderBy('id', 'desc')->paginate(15)->withQueryString();
        $schools = School::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Employees/Index', [
            'employees' => $employees,
            'schools' => $schools,
            'filters' => $request->only(['search', 'school_id', 'status_pegawai']),
        ]);
    }

    public function create()
    {
        $schools = School::orderBy('name')->get();
        return Inertia::render('Admin/Employees/Create', [
            'schools' => $schools
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_id' => 'required|exists:schools,id',
            'nip' => 'nullable|string|unique:employees,nip',
            'name' => 'required|string|max:255',
            'place_of_birth' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'status_pegawai' => 'required|in:PNS,CPNS,PPPK,Honorer',
            'cpns_date' => 'nullable|date',
            'pns_date' => 'nullable|date',
        ]);

        $employee = new Employee($validated);
        if ($request->hasFile('photo')) {
            $employee->photo_path = $request->file('photo')->store('employee_photos', 'public');
        }
        $employee->save();

        return redirect()->route('admin.employees.index')->with('success', 'Data pegawai berhasil ditambahkan.');
    }

    public function show(Employee $employee)
    {
        $employee->load(['school', 'jobHistories', 'educations', 'kgbs', 'assessments', 'attendances', 'creditScores', 'leaves', 'documents']);

        return Inertia::render('Admin/Employees/Show', [
            'employee' => $employee
        ]);
    }

    public function edit(Employee $employee)
    {
        $schools = School::orderBy('name')->get();
        return Inertia::render('Admin/Employees/Edit', [
            'employee' => $employee,
            'schools' => $schools
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'school_id' => 'required|exists:schools,id',
            'nip' => 'nullable|string|unique:employees,nip,' . $employee->id,
            'name' => 'required|string|max:255',
            'place_of_birth' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'status_pegawai' => 'required|in:PNS,CPNS,PPPK,Honorer',
            'cpns_date' => 'nullable|date',
            'pns_date' => 'nullable|date',
        ]);

        if ($request->hasFile('photo')) {
            if ($employee->photo_path) {
                $oldDiskPath = str_replace('/storage/', '', $employee->photo_path);
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists($oldDiskPath)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($oldDiskPath);
                }
            }
            $validated['photo_path'] = $request->file('photo')->store('employee_photos', 'public');
        }
        unset($validated['photo']);

        $employee->update($validated);

        return redirect()->route('admin.employees.show', $employee->id)->with('success', 'Data pegawai berhasil diperbarui.');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()->route('admin.employees.index')->with('success', 'Data pegawai berhasil dihapus.');
    }

    public function uploadDocument(Request $request, Employee $employee)
    {
        $request->validate([
            'category' => 'required|string|max:255',
            'document_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
        ]);

        $file = $request->file('document_file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('employee_documents', $fileName, 'public');

        $employee->documents()->create([
            'category' => $request->category,
            'file_path' => $filePath,
            'file_name' => $file->getClientOriginalName(),
            'upload_date' => now(),
        ]);

        return redirect()->back()->with('success', 'Dokumen berhasil diunggah.');
    }

    public function deleteDocument(Request $request, $documentId)
    {
        $document = \App\Models\EmployeeDocument::findOrFail($documentId);
        \Illuminate\Support\Facades\Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return redirect()->back()->with('success', 'Dokumen berhasil dihapus.');
    }
}
