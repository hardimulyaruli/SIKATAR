<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('letter_applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_number')->unique();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('template_code');
            $table->string('letter_name');
            $table->string('subject');
            $table->string('recipient');
            $table->text('body_content');
            $table->json('form_data_json')->nullable();
            $table->enum('status', ['draft', 'submitted', 'under_review', 'revision_requested', 'approved', 'rejected'])->default('submitted');
            $table->text('admin_notes')->nullable();
            $table->string('official_letter_number')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('letter_applications');
    }
};
