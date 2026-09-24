<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyStaffRoles extends Command
{
    protected $signature = 'verify:staff-roles';
    protected $description = 'Verifikasi hak akses Staff Kepala vs Staff Biasa';

    public function handle()
    {
        $staffKepala = User::where('role', 'staff_kepala')->first();
        $staffBiasa = User::where('role', 'staff_biasa')->first();
        $operator = User::where('role', 'operator')->first();

        $this->info("Staff Kepala : " . ($staffKepala ? "{$staffKepala->email} [{$staffKepala->role}]" : "NOT FOUND"));
        $this->info("Staff Biasa  : " . ($staffBiasa ? "{$staffBiasa->email} [{$staffBiasa->role}]" : "NOT FOUND"));
        $this->info("Operator     : " . ($operator ? "{$operator->email} [{$operator->role}]" : "NOT FOUND"));
        $this->newLine();

        $routes = [
            ['GET', '/admin/dashboard', 'Dashboard Dinas'],
            ['GET', '/admin/applications', 'Verifikasi Pengajuan Surat'],
            ['GET', '/admin/employees', 'Daftar Pegawai (Lihat)'],
            ['GET', '/admin/employees/create', 'Tambah Pegawai Baru'],
            ['GET', '/admin/schools', 'Manajemen Sekolah & Akun'],
            ['GET', '/admin/deletion-requests', 'Pengajuan Hapus Pegawai'],
            ['GET', '/operator/dashboard', 'Dashboard Operator Sekolah'],
        ];

        $tableData = [];

        foreach ($routes as [$method, $uri, $desc]) {
            $codeKepala = $this->simulateRequest($staffKepala, $method, $uri);
            $codeBiasa = $this->simulateRequest($staffBiasa, $method, $uri);
            $codeOp = $this->simulateRequest($operator, $method, $uri);

            $tableData[] = [
                'route' => $uri,
                'description' => $desc,
                'staff_kepala' => ($codeKepala === 200 || $codeKepala === 302) ? "DIIZINKAN ($codeKepala)" : "DITOLAK ($codeKepala)",
                'staff_biasa' => ($codeBiasa === 200 || $codeBiasa === 302) ? "DIIZINKAN ($codeBiasa)" : "DITOLAK ($codeBiasa)",
                'operator' => ($codeOp === 200 || $codeOp === 302) ? "DIIZINKAN ($codeOp)" : "DITOLAK ($codeOp)",
            ];
        }

        $this->table(['Route URL', 'Deskripsi', 'Staff Kepala', 'Staff Biasa', 'Operator'], $tableData);

        return 0;
    }

    private function simulateRequest($user, $method, $uri)
    {
        Auth::login($user);
        $request = Request::create($uri, $method);
        $request->setUserResolver(fn() => $user);

        try {
            $response = app()->handle($request);
            return $response->getStatusCode();
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            return $e->getStatusCode();
        } catch (\Throwable $e) {
            return $e->getMessage();
        }
    }
}
