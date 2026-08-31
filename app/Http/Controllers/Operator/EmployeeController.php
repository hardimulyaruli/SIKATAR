<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $school = Auth::user()->school;

        $query = Employee::with('school')->where('school_id', $school->id ?? 0);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('nip', 'like', '%' . $request->search . '%');
            });
        }

        $employees = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Operator/Employees/Index', [
            'employees' => $employees,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Operator/Employees/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nip' => 'nullable|string|unique:employees,nip',
            'name' => 'required|string|max:255',
            'place_of_birth' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'status_pegawai' => 'required|in:PNS,CPNS,PPPK,Honorer',
            'cpns_date' => 'nullable|date',
            'pns_date' => 'nullable|date',
        ]);

        $school = Auth::user()->school;
        
        $employee = new Employee($request->all());
        $employee->school_id = $school->id;
        $employee->save();

        return redirect()->route('operator.employees.index')->with('success', 'Data pegawai berhasil ditambahkan.');
    }

    public function show(Employee $employee)
    {
        if ($employee->school_id !== auth()->user()->school_id) abort(403);

        $employee->load(['jobHistories', 'assets', 'assessments', 'attendances', 'creditScores', 'leaves', 'documents']);

        return Inertia::render('Operator/Employees/Show', [
            'employee' => $employee
        ]);
    }

    public function edit(Employee $employee)
    {
        $this->authorizeSchoolOwner($employee);

        return Inertia::render('Operator/Employees/Edit', [
            'employee' => $employee
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $this->authorizeSchoolOwner($employee);

        $request->validate([
            'nip' => 'nullable|string|unique:employees,nip,' . $employee->id,
            'name' => 'required|string|max:255',
            'place_of_birth' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'status_pegawai' => 'required|in:PNS,CPNS,PPPK,Honorer',
            'cpns_date' => 'nullable|date',
            'pns_date' => 'nullable|date',
        ]);

        $employee->update($request->all());

        return redirect()->route('operator.employees.show', $employee->id)->with('success', 'Data pegawai berhasil diperbarui.');
    }

    public function destroy(Employee $employee)
    {
        if ($employee->school_id !== auth()->user()->school_id) abort(403);
        $employee->delete();

        return redirect()->route('operator.employees.index')->with('success', 'Data pegawai berhasil dihapus.');
    }

    public function uploadDocument(Request $request, Employee $employee)
    {
        if ($employee->school_id !== auth()->user()->school_id) abort(403);

        $request->validate([
            'category' => 'required|string|max:255',
            'document_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
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
        $document = \App\Models\EmployeeDocument::with('employee')->findOrFail($documentId);
        if ($document->employee->school_id !== auth()->user()->school_id) abort(403);

        \Illuminate\Support\Facades\Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return redirect()->back()->with('success', 'Dokumen berhasil dihapus.');
    }

    private function authorizeSchoolOwner(Employee $employee)
    {
        $user = Auth::user();
        if ($user->role !== 'admin' && $employee->school_id !== $user->school_id) {
            abort(403, 'Akses ditolak.');
        }
    }
}
