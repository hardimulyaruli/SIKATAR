<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeEducation extends Model
{
    protected $table = 'employee_educations';

    protected $fillable = [
        'employee_id',
        'jenjang',
        'jurusan',
        'nama_institusi',
        'tahun_lulus',
        'no_ijazah',
        'document_path',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
