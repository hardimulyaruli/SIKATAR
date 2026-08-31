<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeKgb extends Model
{
    protected $table = 'employee_kgbs';

    protected $fillable = [
        'employee_id',
        'tmt_kgb',
        'gaji_pokok_baru',
        'no_sk',
        'tanggal_sk',
        'masa_kerja_tahun',
        'masa_kerja_bulan',
        'document_path',
    ];

    protected $casts = [
        'tmt_kgb' => 'date',
        'tanggal_sk' => 'date',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
