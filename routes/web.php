<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\SchoolController as AdminSchoolController;
use App\Http\Controllers\Admin\ApplicationController as AdminApplicationController;
use App\Http\Controllers\Operator\DashboardController as OperatorDashboardController;
use App\Http\Controllers\Operator\SchoolProfileController as OperatorSchoolProfileController;
use App\Http\Controllers\Operator\ApplicationController as OperatorApplicationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        $role = Auth::user()->role;
        return redirect(in_array($role, ['staff_kepala', 'staff_biasa', 'admin']) ? '/admin/dashboard' : '/operator/dashboard');
    }
    return redirect()->route('login');
});

// Force Change Password (pertama kali login)
Route::middleware(['auth'])->group(function () {
    Route::get('/force-change-password', [\App\Http\Controllers\Auth\ForceChangePasswordController::class, 'show'])
        ->name('password.force-change');
    Route::post('/force-change-password', [\App\Http\Controllers\Auth\ForceChangePasswordController::class, 'update'])
        ->name('password.force-update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Role-based Dashboard Redirect
    Route::get('/dashboard', function () {
        $role = Auth::user()->role;
        return redirect(in_array($role, ['staff_kepala', 'staff_biasa', 'admin']) ? '/admin/dashboard' : '/operator/dashboard');
    })->name('dashboard');

    // Standard User Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/assets', [ProfileController::class, 'updateAssets'])->name('profile.assets');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications
    Route::post('/notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');

    // Employee Dynamic API Lookup (12,000+ DB Records)
    Route::get('/api/employees/lookup', [\App\Http\Controllers\Api\EmployeeLookupController::class, 'lookup'])->name('api.employees.lookup');
    Route::get('/api/employees/search', [\App\Http\Controllers\Api\EmployeeLookupController::class, 'search'])->name('api.employees.search');

    // Admin / Staff Disdik KBB Routes (Akses Staf Disdik)
    Route::prefix('admin')->name('admin.')->middleware(['role:staff_kepala,staff_biasa,admin'])->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Schools & Accounts Management (HANYA STAFF KEPALA)
        Route::middleware(['role:staff_kepala,admin'])->group(function () {
            Route::get('/schools', [AdminSchoolController::class, 'index'])->name('schools.index');
            Route::post('/schools', [AdminSchoolController::class, 'store'])->name('schools.store');
            Route::get('/schools/{school}', [AdminSchoolController::class, 'show'])->name('schools.show');
            Route::post('/schools/{school}/users', [AdminSchoolController::class, 'storeUser'])->name('schools.users.store');
        });

        // Applications & Approval Workflow (BISA DIAKSES STAFF KEPALA & STAFF BIASA)
        Route::get('/applications', [AdminApplicationController::class, 'index'])->name('applications.index');
        Route::get('/applications/{application}', [AdminApplicationController::class, 'show'])->name('applications.show');
        Route::patch('/applications/{application}/status', [AdminApplicationController::class, 'updateStatus'])->name('applications.updateStatus');

        // Employees Management: Read-only untuk Staf Biasa, Full-access untuk Staf Kepala
        Route::get('/employees/export', [\App\Http\Controllers\Admin\EmployeeController::class, 'export'])->name('employees.export');
        Route::get('/employees', [\App\Http\Controllers\Admin\EmployeeController::class, 'index'])->name('employees.index');

        // DUK PNS (Daftar Urut Kepangkatan)
        Route::get('/duk', [\App\Http\Controllers\Admin\DukController::class, 'index'])->name('duk.index');
        Route::get('/duk/export', [\App\Http\Controllers\Admin\DukController::class, 'export'])->name('duk.export');
        Route::get('/duk/template', [\App\Http\Controllers\Admin\DukController::class, 'downloadTemplate'])->name('duk.template');
        Route::post('/duk/import', [\App\Http\Controllers\Admin\DukController::class, 'import'])->name('duk.import');
        Route::post('/duk/reset', [\App\Http\Controllers\Admin\DukController::class, 'resetOrder'])->name('duk.reset');
        Route::post('/duk/reorder', [\App\Http\Controllers\Admin\DukController::class, 'reorder'])->name('duk.reorder');

        Route::middleware(['role:staff_kepala,admin'])->group(function () {
            Route::get('/employees/create', [\App\Http\Controllers\Admin\EmployeeController::class, 'create'])->name('employees.create');
            Route::post('/employees', [\App\Http\Controllers\Admin\EmployeeController::class, 'store'])->name('employees.store');
            Route::get('/employees/{employee}/edit', [\App\Http\Controllers\Admin\EmployeeController::class, 'edit'])->name('employees.edit');
            Route::match(['put', 'patch'], '/employees/{employee}', [\App\Http\Controllers\Admin\EmployeeController::class, 'update'])->name('employees.update');
            Route::delete('/employees/{employee}', [\App\Http\Controllers\Admin\EmployeeController::class, 'destroy'])->name('employees.destroy');
            Route::post('/employees/{employee}/documents', [\App\Http\Controllers\Admin\EmployeeController::class, 'uploadDocument'])->name('employees.uploadDocument');
            Route::delete('/employees/documents/{document}', [\App\Http\Controllers\Admin\EmployeeController::class, 'deleteDocument'])->name('employees.deleteDocument');

            // Deletion Requests (HANYA STAFF KEPALA)
            Route::get('/deletion-requests', [\App\Http\Controllers\Admin\DeletionRequestController::class, 'index'])->name('deletionRequests.index');
            Route::patch('/deletion-requests/{deletionRequest}/approve', [\App\Http\Controllers\Admin\DeletionRequestController::class, 'approve'])->name('deletionRequests.approve');
            Route::patch('/deletion-requests/{deletionRequest}/reject', [\App\Http\Controllers\Admin\DeletionRequestController::class, 'reject'])->name('deletionRequests.reject');
        });

        Route::get('/employees/{employee}', [\App\Http\Controllers\Admin\EmployeeController::class, 'show'])->name('employees.show');
    });

    // Operator Sekolah Routes
    Route::prefix('operator')->name('operator.')->middleware(['role:operator'])->group(function () {
        Route::get('/dashboard', [OperatorDashboardController::class, 'index'])->name('dashboard');

        // School Profile & Kop Surat
        Route::get('/profile', [OperatorSchoolProfileController::class, 'edit'])->name('profile.edit');
        Route::post('/profile', [OperatorSchoolProfileController::class, 'update'])->name('profile.update');

        // Applications Management & Live Letter Preview
        Route::get('/applications', [OperatorApplicationController::class, 'index'])->name('applications.index');
        Route::get('/applications/create', [OperatorApplicationController::class, 'create'])->name('applications.create');
        Route::post('/applications', [OperatorApplicationController::class, 'store'])->name('applications.store');
        Route::get('/applications/{application}', [OperatorApplicationController::class, 'show'])->name('applications.show');
        Route::put('/applications/{application}', [OperatorApplicationController::class, 'update'])->name('applications.update');

        // Employees Management & Archive
        Route::get('/employees/export', [\App\Http\Controllers\Operator\EmployeeController::class, 'export'])->name('employees.export');
        Route::get('/employees-archived', [\App\Http\Controllers\Operator\EmployeeController::class, 'archivedIndex'])->name('employees.archived');
        Route::get('/employees/{employee}/delete', [\App\Http\Controllers\Operator\EmployeeController::class, 'deleteConfirm'])->name('employees.deleteConfirm');
        Route::post('/employees/{employee}/request-deletion', [\App\Http\Controllers\Operator\EmployeeController::class, 'requestDeletion'])->name('employees.requestDeletion');
        Route::resource('employees', \App\Http\Controllers\Operator\EmployeeController::class);
        Route::post('/employees/{employee}/documents', [\App\Http\Controllers\Operator\EmployeeController::class, 'uploadDocument'])->name('employees.uploadDocument');
        Route::delete('/employees/documents/{document}', [\App\Http\Controllers\Operator\EmployeeController::class, 'deleteDocument'])->name('employees.deleteDocument');
        Route::post('/employees/{employee}/edit-authorization', [\App\Http\Controllers\Operator\EmployeeController::class, 'storeEditAuthorization'])->name('employees.storeEditAuthorization');
    });
});

require __DIR__.'/auth.php';
