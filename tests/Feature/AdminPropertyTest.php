<?php

use App\Models\Property;
use App\Models\PropertyType;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('non-admin users cannot access admin property management', function () {
    $regularUser = User::factory()->create(['role' => 'user']);
    $type = PropertyType::factory()->create();
    $property = Property::factory()->create(['property_type_id' => $type->id]);

    $this->get('/admin')->assertRedirect('/login');
    $this->actingAs($regularUser)->get('/admin')->assertStatus(403);
    $this->actingAs($regularUser)->get('/admin/properties')->assertStatus(403);
    $this->actingAs($regularUser)->delete("/admin/properties/{$property->id}")->assertStatus(403);
});

test('admin can view admin dashboard with statistics', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get('/admin');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/dashboard')
        ->has('stats')
        ->has('recentEnquiries')
        ->has('recentProperties')
    );
});

test('admin can view properties list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $type = PropertyType::factory()->create();
    Property::factory()->count(5)->create(['property_type_id' => $type->id]);

    $response = $this->actingAs($admin)->get('/admin/properties');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/properties/index')
        ->has('properties.data', 5)
        ->has('propertyTypes')
    );
});

test('admin can create a new property listing', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $type = PropertyType::factory()->create();

    $response = $this->actingAs($admin)->post('/admin/properties', [
        'title' => 'Bel Air Modern Masterpiece',
        'property_type_id' => $type->id,
        'user_id' => $admin->id,
        'description' => 'Spectacular views and world-class luxury finishes.',
        'price' => 12500000,
        'price_type' => 'sale',
        'status' => 'available',
        'featured' => true,
        'bedrooms' => 6,
        'bathrooms' => 8,
        'area_sqft' => 9500,
        'garages' => 4,
        'year_built' => 2024,
        'address' => '10979 Chalon Road',
        'city' => 'Los Angeles',
        'state' => 'CA',
        'zip_code' => '90077',
        'country' => 'USA',
        'amenities' => ['Swimming Pool', 'Gym & Fitness Center'],
        'images' => ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'],
    ]);

    $response->assertRedirect('/admin/properties');
    $this->assertDatabaseHas('properties', [
        'title' => 'Bel Air Modern Masterpiece',
        'price' => 12500000,
        'featured' => 1,
    ]);
});

test('admin can update an existing property listing', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $type = PropertyType::factory()->create();
    $property = Property::factory()->create([
        'property_type_id' => $type->id,
        'title' => 'Original Title',
        'price' => 1000000,
    ]);

    $response = $this->actingAs($admin)->put("/admin/properties/{$property->id}", [
        'title' => 'Updated Penthouse Title',
        'property_type_id' => $type->id,
        'description' => $property->description,
        'price' => 1500000,
        'price_type' => 'sale',
        'status' => 'pending',
        'featured' => false,
        'bedrooms' => 3,
        'bathrooms' => 3,
        'area_sqft' => 3000,
        'address' => $property->address,
        'city' => $property->city,
        'country' => 'USA',
        'amenities' => ['Elevator Access'],
    ]);

    $response->assertRedirect('/admin/properties');
    $this->assertDatabaseHas('properties', [
        'id' => $property->id,
        'title' => 'Updated Penthouse Title',
        'price' => 1500000,
        'status' => 'pending',
    ]);
});

test('admin can toggle featured status of a property', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $type = PropertyType::factory()->create();
    $property = Property::factory()->create([
        'property_type_id' => $type->id,
        'featured' => false,
    ]);

    $response = $this->actingAs($admin)->post("/admin/properties/{$property->id}/toggle-featured");
    $response->assertSessionHas('success');
    expect($property->fresh()->featured)->toBeTrue();
});

test('admin can delete a property', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $type = PropertyType::factory()->create();
    $property = Property::factory()->create(['property_type_id' => $type->id]);

    $response = $this->actingAs($admin)->delete("/admin/properties/{$property->id}");

    $response->assertRedirect('/admin/properties');
    $this->assertDatabaseMissing('properties', ['id' => $property->id]);
});
