<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EditAuthorization extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'user_id',
        'school_id',
        'document_path',
        'document_name',
        'notes',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
