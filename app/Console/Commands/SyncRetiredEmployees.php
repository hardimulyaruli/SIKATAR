<?php

namespace App\Console\Commands;

use App\Services\RetirementService;
use Illuminate\Console\Command;

class SyncRetiredEmployees extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'employees:sync-retired {--school= : Optional school ID to sync}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically archive employees who have reached or passed the retirement age (BUP 60 years)';

    /**
     * Execute the console command.
     */
    public function handle(RetirementService $retirementService): int
    {
        $schoolId = $this->option('school') ? (int) $this->option('school') : null;

        $this->info('Memulai sinkronisasi pegawai yang telah mencapai batas usia pensiun (60 tahun)...');

        $archivedCount = $retirementService->syncRetirements($schoolId);

        $this->info("Selesai! Sebanyak {$archivedCount} pegawai telah diarsipkan ke dalam data arsip pensiun.");

        return Command::SUCCESS;
    }
}
