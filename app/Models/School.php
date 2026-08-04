<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory;

    protected $fillable = [
        'npsn',
        'name',
        'jenjang',
        'status_akreditasi',
        'address',
        'phone',
        'email',
        'headmaster_name',
        'headmaster_nip',
        'logo_kop_path',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function letterApplications()
    {
        return $this->hasMany(LetterApplication::class);
    }
}
