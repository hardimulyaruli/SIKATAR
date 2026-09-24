<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Services\DukService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DukController extends Controller
{
    protected DukService $dukService;

    public function __construct(DukService $dukService)
    {
        $this->dukService = $dukService;
    }

    /**
     * Display the DUK PNS listing.
     */
    public function index(Request $request)
    {
        // Pastikan urutan DUK sudah diinisialisasi jika masih ada PNS yang duk_order-nya null
        $hasNullDuk = DB::table('employees')
            ->where('status_pegawai', 'PNS')
            ->whereNull('deleted_at')
            ->whereNull('duk_order')
            ->exists();

        if ($hasNullDuk) {
            $this->dukService->resetBknOrder();
        }

        $query = Employee::query()
            ->with([
                'school:id,name',
                'jobHistories' => function ($q) {
                    $q->orderBy('is_active', 'desc')->orderBy('id', 'desc');
                },
                'educations' => function ($q) {
                    $q->orderBy('tahun_lulus', 'desc')->orderBy('id', 'desc');
                }
            ])
            ->where('status_pegawai', 'PNS')
            ->whereNull('deleted_at');

        // Filter pencarian: NIP, Nama, atau Golongan
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%")
                  ->orWhereHas('jobHistories', function ($jq) use ($search) {
                      $jq->where('pangkat_golongan', 'like', "%{$search}%")
                         ->orWhere('jabatan', 'like', "%{$search}%");
                  });
            });
        }

        // Urutkan berdasarkan duk_order
        $paginator = $query->orderBy('duk_order', 'asc')
            ->orderBy('id', 'asc')
            ->paginate(15)
            ->withQueryString();

        // Transform collection to match reference design exactly
        $paginator->getCollection()->transform(function ($emp) {
            $latestJob = $emp->jobHistories->first();
            $latestEdu = $emp->educations->first();

            $pangkatNama = DukService::getPangkatNama($latestJob->pangkat_golongan ?? null);
            $tmtGolongan = ($latestJob && !empty($latestJob->tanggal_mulai) && $latestJob->tanggal_mulai > '1950-01-01')
                ? Carbon::parse($latestJob->tanggal_mulai)->translatedFormat('d F Y')
                : '-';

            $jabatan = ($latestJob && !empty($latestJob->jabatan))
                ? strtoupper($latestJob->jabatan)
                : '-';

            $tmtJabatan = ($latestJob && !empty($latestJob->tanggal_mulai) && $latestJob->tanggal_mulai > '1950-01-01')
                ? Carbon::parse($latestJob->tanggal_mulai)->translatedFormat('d F Y')
                : '-';

            $mk = DukService::calculateMasaKerja($emp->cpns_date);
            $usia = DukService::calculateUsia($emp->date_of_birth);

            $pendidikanStr = 'Pend: -';
            if ($latestEdu && !empty($latestEdu->jenjang)) {
                $thn = !empty($latestEdu->tahun_lulus) ? " ({$latestEdu->tahun_lulus})" : '';
                $pendidikanStr = "Pend: {$latestEdu->jenjang}{$thn}";
            }

            return [
                'id' => $emp->id,
                'duk_order' => $emp->duk_order,
                'name' => $emp->name,
                'nip' => $emp->nip ? "NIP. {$emp->nip}" : 'NIP. -',
                'raw_nip' => $emp->nip,
                'golongan_badge' => $pangkatNama,
                'tmt_golongan' => "TMT: {$tmtGolongan}",
                'jabatan' => $jabatan,
                'tmt_jabatan' => "TMT: {$tmtJabatan}",
                'masa_kerja' => $mk['formatted'],
                'usia' => $usia['formatted'],
                'pendidikan' => $pendidikanStr,
                'diklat' => 'Dkl: -',
                'school_name' => $emp->school?->name ?? 'Dinas Pendidikan KBB',
            ];
        });

        $stats = $this->dukService->getDashboardStats();

        if ($request->wantsJson()) {
            return response()->json([
                'employees' => $paginator,
                'stats' => $stats,
                'filters' => $request->only(['search']),
            ]);
        }

        return Inertia::render('Admin/Duk/Index', [
            'employees' => $paginator,
            'stats' => $stats,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Reset urutan DUK sesuai standar BKN.
     */
    public function resetOrder(Request $request)
    {
        $this->dukService->resetBknOrder();

        return redirect()->back()->with('success', 'Urutan DUK PNS berhasil direset sesuai ketentuan standar BKN.');
    }

    /**
     * Pindah urutan DUK (Naik / Turun).
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|integer|exists:employees,id',
            'direction' => 'required|in:up,down',
        ]);

        $success = $this->dukService->swapOrder($request->employee_id, $request->direction);

        if (!$success) {
            return redirect()->back()->with('error', 'Gagal memindahkan urutan posisi DUK.');
        }

        return redirect()->back()->with('success', 'Urutan posisi DUK berhasil diperbarui.');
    }

    /**
     * Export DUK ke file Excel (.xlsx).
     */
    public function export(Request $request)
    {
        $filters = $request->only(['search']);
        return $this->dukService->exportExcel($filters);
    }

    /**
     * Import data PNS dari file Excel (Upsert berdasarkan NIP).
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:20480', // Max 20MB
        ]);

        try {
            $result = $this->dukService->importExcel($request->file('file'));
            return redirect()->route('admin.duk.index', ['tab' => 'duk'])->with(
                'success',
                "Berhasil mengimpor {$result['total']} data PNS ({$result['added']} pegawai baru ditambahkan, {$result['updated']} diperbarui)."
            );
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengimpor file: ' . $e->getMessage());
        }
    }

    /**
     * Unduh berkas format Template Import PNS (.xlsx).
     */
    public function downloadTemplate()
    {
        $templatePath = base_path('dokumen/Template_Import_PNS.xlsx');

        if (!file_exists($templatePath)) {
            abort(404, 'Berkas template Template_Import_PNS.xlsx tidak ditemukan di folder dokumen.');
        }

        return response()->download($templatePath, 'Template_Import_PNS.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
}
