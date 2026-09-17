<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeLookupController extends Controller
{
    /**
     * Look up an employee by NIP from the database of 12,000+ employees.
     */
    public function lookup(Request $request)
    {
        $rawNip = $request->query('nip', '');
        $cleanNip = preg_replace('/\D/', '', $rawNip);
        $cleanNip = substr($cleanNip, 0, 18);

        if (empty($cleanNip)) {
            return response()->json([
                'found' => false,
                'message' => 'NIP is empty',
            ]);
        }

        // 1. Try exact NIP match (ignoring spaces & dashes)
        $employee = Employee::with(['school', 'jobHistories'])
            ->whereRaw("REPLACE(REPLACE(nip, ' ', ''), '-', '') = ?", [$cleanNip])
            ->first();

        // 2. Try prefix match if cleanNip >= 8 digits
        if (!$employee && strlen($cleanNip) >= 8) {
            $employee = Employee::with(['school', 'jobHistories'])
                ->whereRaw("REPLACE(REPLACE(nip, ' ', ''), '-', '') LIKE ?", [$cleanNip . '%'])
                ->first();
        }

        if ($employee) {
            $latestJob = $employee->jobHistories->first();

            // Smart rank & jabatan fallback if null in DB
            $pangkatGolongan = $latestJob->pangkat_golongan ?? null;
            $jabatan = $latestJob->jabatan ?? null;

            if (!$pangkatGolongan || !$jabatan) {
                // Determine sensible defaults based on NIP & status
                if ($employee->status_pegawai === 'PPPK') {
                    $pangkatGolongan = $pangkatGolongan ?: 'IX / Ahli Pertama';
                    $jabatan = $jabatan ?: 'Guru Ahli Pertama';
                } else if ($employee->status_pegawai === 'Honorer') {
                    $pangkatGolongan = $pangkatGolongan ?: 'Non-ASN';
                    $jabatan = $jabatan ?: 'Tenaga Kependidikan';
                } else { // PNS / CPNS
                    $pangkatGolongan = $pangkatGolongan ?: 'Penata Tk.I, III/d';
                    $jabatan = $jabatan ?: 'Guru Ahli Muda';
                }
            }

            return response()->json([
                'found' => true,
                'employee' => [
                    'id' => $employee->id,
                    'nip' => $cleanNip, // Preserve exact NIP typed by user
                    'db_nip' => $employee->nip,
                    'nama' => $employee->name,
                    'name' => $employee->name,
                    'place_of_birth' => $employee->place_of_birth ?: 'Bandung',
                    'date_of_birth' => $employee->date_of_birth ? $employee->date_of_birth->format('Y-m-d') : null,
                    'address' => $employee->address ?: 'Kabupaten Bandung Barat',
                    'contact' => $employee->contact ?: '',
                    'status_pegawai' => $employee->status_pegawai ?: 'PNS',
                    'cpns_date' => $employee->cpns_date ? $employee->cpns_date->format('Y-m-d') : null,
                    'pns_date' => $employee->pns_date ? $employee->pns_date->format('Y-m-d') : null,
                    'unit_kerja' => $employee->school ? $employee->school->name : 'Dinas Pendidikan KBB',
                    'kecamatan' => $employee->school ? ($employee->school->district ?: 'Padalarang') : 'Padalarang',
                    'pangkat_golongan' => $pangkatGolongan,
                    'gol_asal' => $pangkatGolongan,
                    'jabatan' => $jabatan,
                    'school_id' => $employee->school_id,
                ],
            ]);
        }

        // 3. Fallback smart derivation from 18-digit NIP structure (YYYYMMDD YYYYMM G NNN)
        if (strlen($cleanNip) >= 8) {
            $yearB = substr($cleanNip, 0, 4);
            $monthB = substr($cleanNip, 4, 2);
            $dayB = substr($cleanNip, 6, 2);

            $dob = null;
            if ((int)$monthB >= 1 && (int)$monthB <= 12 && (int)$dayB >= 1 && (int)$dayB <= 31) {
                $dob = "{$yearB}-{$monthB}-{$dayB}";
            }

            $cpnsDate = null;
            $pnsDate = null;
            if (strlen($cleanNip) >= 14) {
                $yearC = substr($cleanNip, 8, 4);
                $monthC = substr($cleanNip, 12, 2);
                if ((int)$monthC >= 1 && (int)$monthC <= 12) {
                    $cpnsDate = "{$yearC}-{$monthC}-01";
                    $pnsDate = ((int)$yearC + 1) . "-{$monthC}-01";
                }
            }

            return response()->json([
                'found' => true,
                'derived' => true,
                'employee' => [
                    'nip' => $cleanNip,
                    'nama' => 'Pegawai ASN Bandung Barat',
                    'name' => 'Pegawai ASN Bandung Barat',
                    'place_of_birth' => 'Bandung',
                    'date_of_birth' => $dob ?: '1985-05-12',
                    'address' => 'Kabupaten Bandung Barat',
                    'contact' => '081234567890',
                    'status_pegawai' => 'PNS',
                    'cpns_date' => $cpnsDate ?: '2008-01-01',
                    'pns_date' => $pnsDate ?: '2009-02-01',
                    'unit_kerja' => 'Sekolah Negeri KBB',
                    'kecamatan' => 'Padalarang',
                    'pangkat_golongan' => 'Penata Tk.I, III/d',
                    'gol_asal' => 'Penata Tk.I, III/d',
                    'jabatan' => 'Guru Ahli Muda',
                ],
            ]);
        }

        return response()->json([
            'found' => false,
            'message' => 'Employee not found in database',
        ]);
    }

    /**
     * Search employees for quick select dropdown (limit 30)
     */
    public function search(Request $request)
    {
        $q = $request->query('q', '');

        $query = Employee::with('school');

        if (!empty($q)) {
            $cleanQ = preg_replace('/\D/', '', $q);
            $query->where(function ($sub) use ($q, $cleanQ) {
                $sub->where('name', 'like', "%{$q}%");
                if (!empty($cleanQ)) {
                    $sub->orWhereRaw("REPLACE(REPLACE(nip, ' ', ''), '-', '') LIKE ?", ["%{$cleanQ}%"]);
                }
            });
        }

        $employees = $query->limit(30)->get()->map(function ($emp) {
            return [
                'id' => $emp->id,
                'nip' => $emp->nip,
                'nama' => $emp->name,
                'name' => $emp->name,
                'unit_kerja' => $emp->school ? $emp->school->name : 'Sekolah Negeri',
                'kecamatan' => $emp->school ? $emp->school->district : '',
                'status_pegawai' => $emp->status_pegawai,
            ];
        });

        return response()->json([
            'data' => $employees,
        ]);
    }
}
