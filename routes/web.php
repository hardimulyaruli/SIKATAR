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
    return Inertia::render('Welcome');
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

    // Admin Disdik KBB Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        
        // Schools
        Route::get('/schools', [AdminSchoolController::class, 'index'])->name('schools.index');
        Route::get('/schools/{school}', [AdminSchoolController::class, 'show'])->name('schools.show');

        // Applications & Approval Workflow
        Route::get('/applications', [AdminApplicationController::class, 'index'])->name('applications.index');
        Route::get('/applications/{application}', [AdminApplicationController::class, 'show'])->name('applications.show');
        Route::patch('/applications/{application}/status', [AdminApplicationController::class, 'updateStatus'])->name('applications.updateStatus');
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
    });
});

require __DIR__.'/auth.php';
