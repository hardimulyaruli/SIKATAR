<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LetterTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category',
        'description',
        'default_subject',
        'default_body_template',
        'required_fields_json',
    ];

    protected $casts = [
        'required_fields_json' => 'array',
    ];
}
