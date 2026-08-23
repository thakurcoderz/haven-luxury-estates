<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DemoLoginController;
use App\Http\Controllers\EnquiryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\UserDashboardController;
use Illuminate\Support\Facades\Route;

// Public Guest Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
Route::get('/properties/{property:slug}', [PropertyController::class, 'show'])->name('properties.show');
Route::post('/enquiries', [EnquiryController::class, 'store'])->name('enquiries.store');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');

// Demo sign in. Registered only outside production, and the controller
// re-checks the environment before issuing a session.
if (DemoLoginController::isAvailable()) {
    Route::post('/demo-login', DemoLoginController::class)->name('demo-login');
}

// Authenticated User Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    Route::get('/my-enquiries', [EnquiryController::class, 'userIndex'])->name('enquiries.user');
    Route::post('/properties/{property}/save', [PropertyController::class, 'toggleSave'])->name('properties.save');
    Route::get('/saved-properties', [PropertyController::class, 'saved'])->name('properties.saved');
});

// Admin Panel Routes
Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');

        // Properties
        Route::get('/properties', [Admin\PropertyController::class, 'index'])->name('properties.index');
        Route::get('/properties/create', [Admin\PropertyController::class, 'create'])->name('properties.create');
        Route::post('/properties', [Admin\PropertyController::class, 'store'])->name('properties.store');
        Route::get('/properties/{property}/edit', [Admin\PropertyController::class, 'edit'])->name('properties.edit');
        Route::put('/properties/{property}', [Admin\PropertyController::class, 'update'])->name('properties.update');
        Route::delete('/properties/{property}', [Admin\PropertyController::class, 'destroy'])->name('properties.destroy');
        Route::post('/properties/{property}/toggle-featured', [Admin\PropertyController::class, 'toggleFeatured'])->name('properties.toggle-featured');

        // Property Types / Categories
        Route::get('/property-types', [Admin\PropertyTypeController::class, 'index'])->name('property-types.index');
        Route::post('/property-types', [Admin\PropertyTypeController::class, 'store'])->name('property-types.store');
        Route::put('/property-types/{property_type}', [Admin\PropertyTypeController::class, 'update'])->name('property-types.update');
        Route::delete('/property-types/{property_type}', [Admin\PropertyTypeController::class, 'destroy'])->name('property-types.destroy');

        // Enquiries
        Route::get('/enquiries', [Admin\EnquiryController::class, 'index'])->name('enquiries.index');
        Route::get('/enquiries/{enquiry}', [Admin\EnquiryController::class, 'show'])->name('enquiries.show');
        Route::put('/enquiries/{enquiry}', [Admin\EnquiryController::class, 'update'])->name('enquiries.update');
        Route::delete('/enquiries/{enquiry}', [Admin\EnquiryController::class, 'destroy'])->name('enquiries.destroy');

        // Users & Agents
        Route::get('/users', [Admin\UserController::class, 'index'])->name('users.index');
        Route::put('/users/{user}', [Admin\UserController::class, 'update'])->name('users.update');
    });

require __DIR__.'/settings.php';
