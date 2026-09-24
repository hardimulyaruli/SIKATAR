<?php

namespace App\Services;

use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * Service to manage retirement rules and automated archival for employees.
 * Standard Batas Usia Pensiun (BUP) for teachers & educational staff is 60 years.
 */
class RetirementService
{
    public const RETIREMENT_AGE = 60;
    public const APPROACHING_YEARS = 1; // 1 year before reaching retirement age

    /**
     * Automatically archive all employees who have reached or passed the retirement age (>= 60 years old).
     * Calculates age based on employee's date of birth and today's date.
     *
     * @param int|null $schoolId Optional school ID to limit sync
     * @return int Number of employees archived
     */
    public function syncRetirements(?int $schoolId = null): int
    {
        $cutoffDate = Carbon::now()->subYears(self::RETIREMENT_AGE)->endOfDay();

        $query = Employee::whereNotNull('date_of_birth')
            ->where('date_of_birth', '<=', $cutoffDate);

        if ($schoolId) {
            $query->where('school_id', $schoolId);
        }

        $retiredEmployees = $query->get();
        $archivedCount = 0;

        foreach ($retiredEmployees as $employee) {
            $birthDate = Carbon::parse($employee->date_of_birth);
            $age = $birthDate->age;

            $employee->archived_reason = "Pensiun (Mencapai Batas Usia Pensiun {$age} Tahun)";
            $employee->save();
            $employee->delete(); // Soft delete to archive

            $archivedCount++;
        }

        return $archivedCount;
    }

    /**
     * Get active employees who are approaching retirement age (within the final year, age 59 - 59.99).
     *
     * @param int|null $schoolId
     * @return Collection
     */
    public function getApproachingRetirementEmployees(?int $schoolId = null): Collection
    {
        $now = Carbon::now();
        $startApproaching = $now->copy()->subYears(self::RETIREMENT_AGE); // 60 years ago (start)
        $endApproaching = $now->copy()->subYears(self::RETIREMENT_AGE - self::APPROACHING_YEARS); // 59 years ago (end)

        $query = Employee::with('school')
            ->whereNotNull('date_of_birth')
            ->whereBetween('date_of_birth', [$startApproaching, $endApproaching]);

        if ($schoolId) {
            $query->where('school_id', $schoolId);
        }

        return $query->orderBy('date_of_birth', 'asc')
            ->get()
            ->map(function ($emp) use ($now) {
                $birthDate = Carbon::parse($emp->date_of_birth);
                $retirementDate = $birthDate->copy()->addYears(self::RETIREMENT_AGE);
                
                $diff = $birthDate->diff($now);
                $monthsUntilRetirement = max(0, $now->diffInMonths($retirementDate, false));
                $daysUntilRetirement = max(0, $now->diffInDays($retirementDate, false));

                return [
                    'id' => $emp->id,
                    'name' => $emp->name,
                    'nip' => $emp->nip,
                    'status_pegawai' => $emp->status_pegawai,
                    'school_name' => $emp->school?->name ?? '-',
                    'date_of_birth' => $birthDate->translatedFormat('d F Y'),
                    'raw_dob' => $emp->date_of_birth->format('Y-m-d'),
                    'current_age' => $birthDate->age,
                    'age_label' => "{$diff->y} Tahun {$diff->m} Bulan",
                    'retirement_date' => $retirementDate->translatedFormat('d F Y'),
                    'months_remaining' => (int) $monthsUntilRetirement,
                    'days_remaining' => (int) $daysUntilRetirement,
                    'is_critical' => $monthsUntilRetirement <= 3, // Less than 3 months remaining
                ];
            });
    }

    /**
     * Get retirement statistics for an operator's school.
     *
     * @param int $schoolId
     * @return array
     */
    public function getSchoolRetirementSummary(int $schoolId): array
    {
        $approachingCount = $this->getApproachingRetirementEmployees($schoolId)->count();
        $archivedPensionCount = Employee::onlyTrashed()
            ->where('school_id', $schoolId)
            ->where('archived_reason', 'like', '%Pensiun%')
            ->count();

        return [
            'approaching_count' => $approachingCount,
            'archived_pension_count' => $archivedPensionCount,
        ];
    }
}
