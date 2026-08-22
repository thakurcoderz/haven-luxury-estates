<?php

use App\Models\Enquiry;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\SavedProperty;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated normal user can visit the dashboard and see their inquiries and saved homes', function () {
    $user = User::factory()->create(['role' => 'user']);
    $type = PropertyType::factory()->create();
    $property = Property::factory()->create(['property_type_id' => $type->id]);

    SavedProperty::create([
        'user_id' => $user->id,
        'property_id' => $property->id,
    ]);

    Enquiry::create([
        'user_id' => $user->id,
        'property_id' => $property->id,
        'name' => $user->name,
        'email' => $user->email,
        'message' => 'Interested in touring this estate.',
        'status' => 'new',
    ]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->has('stats')
        ->where('stats.saved_count', 1)
        ->where('stats.total_enquiries', 1)
        ->where('stats.pending_enquiries', 1)
        ->has('recentEnquiries', 1)
        ->has('recentSavedProperties', 1)
    );
});

test('normal users cannot access admin panel routes', function () {
    $user = User::factory()->create(['role' => 'user']);

    $this->actingAs($user)->get('/admin')->assertStatus(403);
    $this->actingAs($user)->get('/admin/properties')->assertStatus(403);
    $this->actingAs($user)->get('/admin/enquiries')->assertStatus(403);
    $this->actingAs($user)->get('/admin/users')->assertStatus(403);
});

test('authenticated users can view their dedicated my inquiries status page', function () {
    $user = User::factory()->create(['role' => 'user']);
    $type = PropertyType::factory()->create();
    $property = Property::factory()->create(['property_type_id' => $type->id]);

    Enquiry::create([
        'user_id' => $user->id,
        'property_id' => $property->id,
        'name' => $user->name,
        'email' => $user->email,
        'enquiry_type' => 'schedule_tour',
        'preferred_date' => '2026-09-20',
        'message' => 'Please arrange private showing.',
        'status' => 'contacted',
    ]);

    $response = $this->actingAs($user)->get('/my-enquiries');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('user/enquiries')
        ->has('enquiries.data', 1)
        ->where('enquiries.data.0.status', 'contacted')
        ->has('statusCounts')
        ->where('statusCounts.contacted', 1)
    );
});
