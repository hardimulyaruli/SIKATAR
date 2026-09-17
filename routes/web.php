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
        return redirect($role === 'admin' ? '/admin/dashboard' : '/operator/dashboard');
    }
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Role-based Dashboard Redirect
    Route::get('/dashboard', function () {
        $role = Auth::user()->role;
        return redirect($role === 'admin' ? '/admin/dashboard' : '/operator/dashboard');
    })->name('dashboard');

    // Standard User Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications
    Route::post('/notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');

    // Employee Dynamic API Lookup (12,000+ DB Records)
    Route::get('/api/employees/lookup', [\App\Http\Controllers\Api\EmployeeLookupController::class, 'lookup'])->name('api.employees.lookup');
    Route::get('/api/employees/search', [\App\Http\Controllers\Api\EmployeeLookupController::class, 'search'])->name('api.employees.search');

    // Admin Disdik KBB Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        
        // Schools & Accounts Management
        Route::get('/schools', [AdminSchoolController::class, 'index'])->name('schools.index');
        Route::post('/schools', [AdminSchoolController::class, 'store'])->name('schools.store');
        Route::get('/schools/{school}', [AdminSchoolController::class, 'show'])->name('schools.show');
        Route::post('/schools/{school}/users', [AdminSchoolController::class, 'storeUser'])->name('schools.users.store');

        // Applications & Approval Workflow
        Route::get('/applications', [AdminApplicationController::class, 'index'])->name('applications.index');
        Route::get('/applications/{application}', [AdminApplicationController::class, 'show'])->name('applications.show');
        Route::patch('/applications/{application}/status', [AdminApplicationController::class, 'updateStatus'])->name('applications.updateStatus');

        // Employees Management
        Route::resource('employees', \App\Http\Controllers\Admin\EmployeeController::class);
        Route::post('/employees/{employee}/documents', [\App\Http\Controllers\Admin\EmployeeController::class, 'uploadDocument'])->name('employees.uploadDocument');
        Route::delete('/employees/documents/{document}', [\App\Http\Controllers\Admin\EmployeeController::class, 'deleteDocument'])->name('employees.deleteDocument');

        // Deletion Requests (Approval Workflow)
        Route::get('/deletion-requests', [\App\Http\Controllers\Admin\DeletionRequestController::class, 'index'])->name('deletionRequests.index');
        Route::patch('/deletion-requests/{deletionRequest}/approve', [\App\Http\Controllers\Admin\DeletionRequestController::class, 'approve'])->name('deletionRequests.approve');
        Route::patch('/deletion-requests/{deletionRequest}/reject', [\App\Http\Controllers\Admin\DeletionRequestController::class, 'reject'])->name('deletionRequests.reject');
    });

    // Operator Sekolah Routes
    Route::prefix('operator')->name('operator.')->group(function () {
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
        Route::get('/employees-archived', [\App\Http\Controllers\Operator\EmployeeController::class, 'archivedIndex'])->name('employees.archived');
        Route::post('/employees/{employee}/request-deletion', [\App\Http\Controllers\Operator\EmployeeController::class, 'requestDeletion'])->name('employees.requestDeletion');
        Route::resource('employees', \App\Http\Controllers\Operator\EmployeeController::class);
        Route::post('/employees/{employee}/documents', [\App\Http\Controllers\Operator\EmployeeController::class, 'uploadDocument'])->name('employees.uploadDocument');
        Route::delete('/employees/documents/{document}', [\App\Http\Controllers\Operator\EmployeeController::class, 'deleteDocument'])->name('employees.deleteDocument');
        Route::post('/employees/{employee}/edit-authorization', [\App\Http\Controllers\Operator\EmployeeController::class, 'storeEditAuthorization'])->name('employees.storeEditAuthorization');
    });
});

require __DIR__.'/auth.php';
