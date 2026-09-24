<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EditAuthorization;
use App\Models\DeletionRequest;
use App\Services\EmployeeExportService;
use App\Services\RetirementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request, RetirementService $retirementService)
    {
        // Jika user yang login adalah Staf Dinas, arahkan otomatis ke halaman pegawai Admin
        if (in_array(Auth::user()->role, ['staff_kepala', 'staff_biasa', 'admin'])) {
            return redirect()->route('admin.employees.index');
        }

        $school = Auth::user()->school;
        $schoolId = $school->id ?? 0;

        // Otomatis sinkronkan & arsipkan pegawai yang telah melewati batas usia pensiun (60 tahun)
        $retirementService->syncRetirements($schoolId);

        // Ambil daftar pegawai yang mendekati masa pensiun (tahun terakhir, usia 59-60 tahun)
        $approachingEmployees = $retirementService->getApproachingRetirementEmployees($schoolId);

        // Query data pegawai aktif khusus untuk sekolah operator tersebut
        $query = Employee::with(['school', 'deletionRequests' => function ($q) {
            $q->where('status', 'pending')->latest();
        }])->where('school_id', $schoolId);

        // Filter pencarian berdasarkan nama pegawai atau NIP
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('nip', 'like', '%' . $request->search . '%');
            });
        }

        // Filter pensiun & status kepegawaian
        $filter = $request->input('filter', 'all');
        if ($filter === 'approaching_pension' || $filter === 'pension') {
            $cutoffStart = now()->subYears(RetirementService::RETIREMENT_AGE);
            $cutoffEnd = now()->subYears(RetirementService::RETIREMENT_AGE - RetirementService::APPROACHING_YEARS);
            $query->whereBetween('date_of_birth', [$cutoffStart, $cutoffEnd]);
        } elseif ($filter === 'pns') {
            $query->where('status_pegawai', 'PNS');
        } elseif ($filter === 'pppk') {
            $query->where('status_pegawai', 'PPPK');
        } elseif ($filter === 'honorer') {
            $query->whereNotIn('status_pegawai', ['PNS', 'PPPK']);
        }

        // Pengurutan berbasis indeks ID dan pagination 15 data per halaman
        $employees = $query->orderBy('id', 'desc')->paginate(15)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json([
                'employees' => $employees,
                'filters' => $request->only(['search', 'filter']),
                'approachingPensionEmployees' => $approachingEmployees,
                'approachingPensionCount' => $approachingEmployees->count(),
            ]);
        }

        return Inertia::render('Operator/Employees/Index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'filter']),
            'approachingPensionEmployees' => $approachingEmployees,
            'approachingPensionCount' => $approachingEmployees->count(),
        ]);
    }

    /**
     * Export data kepegawaian sekolah operator ke file Excel (.xlsx).
     */
    public function export(Request $request, EmployeeExportService $exportService)
    {
        $school = Auth::user()->school;
        return $exportService->export($request->only(['status_pegawai', 'search']), $school);
    }

    public function create()
    {
        return Inertia::render('Operator/Employees/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
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

        if ($validated['status_pegawai'] === 'Honorer') {
            $validated['nip'] = null;
            $validated['cpns_date'] = null;
            $validated['pns_date'] = null;
        } elseif ($validated['status_pegawai'] === 'PPPK') {
            $validated['cpns_date'] = null;
            $validated['pns_date'] = null;
        } elseif ($validated['status_pegawai'] === 'CPNS') {
            $validated['pns_date'] = null;
        }

        $school = Auth::user()->school;
        
        $employee = new Employee($validated);
        $employee->school_id = $school->id;

        if ($request->hasFile('photo')) {
            $employee->photo_path = $request->file('photo')->store('employee_photos', 'public');
        }

        $employee->save();

        return redirect()->route('operator.employees.index')->with('success', 'Data pegawai berhasil ditambahkan.');
    }

    public function show(Employee $employee)
    {
        if ($employee->school_id !== auth()->user()->school_id) abort(403);

        $employee->load(['jobHistories', 'educations', 'kgbs', 'assessments', 'attendances', 'creditScores', 'leaves', 'documents']);

        return Inertia::render('Operator/Employees/Show', [
            'employee' => $employee
        ]);
    }

    public function edit(Employee $employee)
    {
        $this->authorizeSchoolOwner($employee);

        // Check if edit authorization (surat perintah) exists for this employee in active session
        $sessionAuthId = session()->get('edit_authorized_employee_' . $employee->id);
        $editAuthorization = null;

        if ($sessionAuthId) {
            $editAuthorization = EditAuthorization::where('id', $sessionAuthId)
                ->where('employee_id', $employee->id)
                ->where('school_id', Auth::user()->school_id)
                ->first();
        }

        return Inertia::render('Operator/Employees/Edit', [
            'employee' => $employee,
            'editAuthorization' => $editAuthorization,
        ]);
    }

    public function storeEditAuthorization(Request $request, Employee $employee)
    {
        $this->authorizeSchoolOwner($employee);

        $request->validate([
            'surat_perintah' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'notes' => 'nullable|string|max:500',
        ]);

        $file = $request->file('surat_perintah');
        $fileName = time() . '_surat_perintah_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('edit_authorizations', $fileName, 'public');

        $auth = EditAuthorization::create([
            'employee_id' => $employee->id,
            'user_id' => Auth::id(),
            'school_id' => Auth::user()->school_id,
            'document_path' => $filePath,
            'document_name' => $file->getClientOriginalName(),
            'notes' => $request->notes,
        ]);

        // Mark authorization active for this specific edit session
        session(['edit_authorized_employee_' . $employee->id => $auth->id]);

        return redirect()->back()->with('success', 'Surat Perintah berhasil diunggah. Silakan edit data pegawai.');
    }

    public function update(Request $request, Employee $employee)
    {
        $this->authorizeSchoolOwner($employee);

        // Verify edit authorization exists in active session
        $sessionAuthId = session()->get('edit_authorized_employee_' . $employee->id);
        $hasAuthorization = false;

        if ($sessionAuthId) {
            $hasAuthorization = EditAuthorization::where('id', $sessionAuthId)
                ->where('employee_id', $employee->id)
                ->where('school_id', Auth::user()->school_id)
                ->exists();
        }

        if (!$hasAuthorization) {
            return redirect()->route('operator.employees.edit', $employee->id)->withErrors([
                'authorization' => 'Anda harus mengunggah Surat Perintah dari Kepala Sekolah terlebih dahulu.'
            ]);
        }

        $validated = $request->validate([
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

        if ($validated['status_pegawai'] === 'Honorer') {
            $validated['nip'] = null;
            $validated['cpns_date'] = null;
            $validated['pns_date'] = null;
        } elseif ($validated['status_pegawai'] === 'PPPK') {
            $validated['cpns_date'] = null;
            $validated['pns_date'] = null;
        } elseif ($validated['status_pegawai'] === 'CPNS') {
            $validated['pns_date'] = null;
        }

        if ($request->hasFile('photo')) {
            if ($employee->photo_path) {
                $oldDiskPath = str_replace('/storage/', '', $employee->photo_path);
                if (Storage::disk('public')->exists($oldDiskPath)) {
                    Storage::disk('public')->delete($oldDiskPath);
                }
            }
            $validated['photo_path'] = $request->file('photo')->store('employee_photos', 'public');
        }
        unset($validated['photo']);

        $employee->update($validated);

        // Consume the session authorization so future edits require a fresh Surat Perintah
        session()->forget('edit_authorized_employee_' . $employee->id);

        return redirect()->route('operator.employees.show', $employee->id)->with('success', 'Data pegawai berhasil diperbarui.');
    }

    public function archivedIndex(Request $request, RetirementService $retirementService)
    {
        if (in_array(Auth::user()->role, ['staff_kepala', 'staff_biasa', 'admin'])) {
            return redirect()->route('admin.employees.index');
        }

        $school = Auth::user()->school;
        $schoolId = $school->id ?? 0;

        // Pastikan sinkronisasi pegawai pensiun berjalan
        $retirementService->syncRetirements($schoolId);

        $query = Employee::onlyTrashed()
            ->with(['school', 'deletionRequests' => function ($q) {
                $q->latest();
            }])
            ->where('school_id', $schoolId);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('nip', 'like', '%' . $request->search . '%');
            });
        }

        // Filter berdasarkan kategori arsip (Pensiun vs Pengajuan Hapus/Mutasi)
        $reasonFilter = $request->input('reason', 'all');
        if ($reasonFilter === 'pension') {
            $query->where('archived_reason', 'like', '%Pensiun%');
        } elseif ($reasonFilter === 'deletion') {
            $query->where(function ($q) {
                $q->whereNull('archived_reason')
                  ->orWhere('archived_reason', 'not like', '%Pensiun%');
            });
        }

        $employees = $query->orderBy('deleted_at', 'desc')->paginate(15)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json([
                'employees' => $employees,
                'filters' => $request->only(['search', 'reason']),
            ]);
        }

        return Inertia::render('Operator/Employees/Archived', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'reason']),
        ]);
    }

    public function deleteConfirm(Employee $employee)
    {
        $this->authorizeSchoolOwner($employee);

        // Check if there is already a pending deletion request
        $existing = DeletionRequest::where('employee_id', $employee->id)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return redirect()->route('operator.employees.index')->withErrors([
                'deletion' => 'Pengajuan penghapusan untuk pegawai ini sudah pernah diajukan dan sedang menunggu persetujuan.'
            ]);
        }

        return Inertia::render('Operator/Employees/Delete', [
            'employee' => $employee,
        ]);
    }

    public function requestDeletion(Request $request, Employee $employee)
    {
        $this->authorizeSchoolOwner($employee);

        // Check if there is already a pending deletion request
        $existing = DeletionRequest::where('employee_id', $employee->id)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return redirect()->route('operator.employees.index')->withErrors([
                'deletion' => 'Pengajuan penghapusan untuk pegawai ini sudah pernah diajukan dan sedang menunggu persetujuan.'
            ]);
        }

        $request->validate([
            'surat_perintah' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'reason' => 'required|string|max:1000',
        ]);

        $file = $request->file('surat_perintah');
        $fileName = time() . '_hapus_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('deletion_requests', $fileName, 'public');

        DeletionRequest::create([
            'employee_id' => $employee->id,
            'user_id' => Auth::id(),
            'school_id' => Auth::user()->school_id,
            'document_path' => $filePath,
            'document_name' => $file->getClientOriginalName(),
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return redirect()->route('operator.employees.index')->with('success', 'Pengajuan penghapusan berhasil dikirim. Menunggu persetujuan Admin/Dinas.');
    }

    public function destroy(Employee $employee)
    {
        return redirect()->back()->withErrors([
            'deletion' => 'Penghapusan data pegawai harus melalui pengajuan persetujuan dengan Surat Perintah Kepala Sekolah.'
        ]);
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

        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return redirect()->back()->with('success', 'Dokumen berhasil dihapus.');
    }

    private function authorizeSchoolOwner(Employee $employee)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['staff_kepala', 'staff_biasa', 'admin']) && $employee->school_id !== $user->school_id) {
            abort(403, 'Akses ditolak.');
        }
    }
}
