<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LetterApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_number',
        'school_id',
        'user_id',
        'template_code',
        'letter_name',
        'subject',
        'recipient',
        'body_content',
        'form_data_json',
        'status',
        'admin_notes',
        'official_letter_number',
        'approved_at',
    ];

    protected $casts = [
        'form_data_json' => 'array',
        'approved_at' => 'datetime',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
