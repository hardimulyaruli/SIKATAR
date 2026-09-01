<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'school_id',
        'nip',
        'name',
        'place_of_birth',
        'date_of_birth',
        'address',
        'contact',
        'photo_path',
        'status_pegawai',
        'cpns_date',
        'pns_date',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'cpns_date' => 'date',
        'pns_date' => 'date',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function jobHistories()
    {
        return $this->hasMany(EmployeeJobHistory::class);
    }

    public function assets()
    {
        return $this->hasMany(EmployeeAsset::class);
    }

    public function assessments()
    {
        return $this->hasMany(EmployeeAssessment::class);
    }

    public function attendances()
    {
        return $this->hasMany(EmployeeAttendance::class);
    }

    public function creditScores()
    {
        return $this->hasMany(EmployeeCreditScore::class);
    }

    public function leaves()
    {
        return $this->hasMany(EmployeeLeave::class);
    }

    public function educations()
    {
        return $this->hasMany(EmployeeEducation::class);
    }

    public function kgbs()
    {
        return $this->hasMany(EmployeeKgb::class);
    }

    public function documents()
    {
        return $this->hasMany(EmployeeDocument::class);
    }
}
