<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeletionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DeletionRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = DeletionRequest::with(['employee', 'user', 'school', 'reviewer']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('employee', function ($eq) use ($search) {
                    $eq->where('name', 'like', "%{$search}%")
                       ->orWhere('nip', 'like', "%{$search}%");
                })->orWhereHas('school', function ($sq) use ($search) {
                    $sq->where('name', 'like', "%{$search}%");
                });
            });
        }

        $requests = $query->orderByRaw("FIELD(status, 'pending', 'approved', 'rejected')")
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        if ($request->wantsJson()) {
            return response()->json([
                'requests' => $requests,
                'filters' => $request->only(['search', 'status']),
            ]);
        }

        return Inertia::render('Admin/DeletionRequests/Index', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function approve(Request $request, DeletionRequest $deletionRequest)
    {
        if ($deletionRequest->status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'Pengajuan ini sudah pernah diproses.']);
        }

        $employee = $deletionRequest->employee;

        if ($employee && !$employee->trashed()) {
            $employee->archived_reason = $deletionRequest->reason;
            $employee->save();
            $employee->delete();
        }

        $deletionRequest->update([
            'status' => 'approved',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'admin_notes' => $request->admin_notes,
        ]);

        return redirect()->back()->with('success', 'Pengajuan penghapusan disetujui. Data pegawai berhasil diarsipkan.');
    }

    public function reject(Request $request, DeletionRequest $deletionRequest)
    {
        if ($deletionRequest->status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'Pengajuan ini sudah pernah diproses.']);
        }

        $request->validate([
            'admin_notes' => 'required|string|max:500',
        ], [
            'admin_notes.required' => 'Mohon berikan alasan penolakan pengajuan.',
        ]);

        $deletionRequest->update([
            'status' => 'rejected',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'admin_notes' => $request->admin_notes,
        ]);

        return redirect()->back()->with('success', 'Pengajuan penghapusan berhasil ditolak.');
    }
}
