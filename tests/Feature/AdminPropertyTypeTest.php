<?php

use App\Models\PropertyType;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin can view property types list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    PropertyType::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get('/admin/property-types');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/property-types/index')
        ->has('propertyTypes')
    );
});

test('admin can create a property type', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post('/admin/property-types', [
        'name' => 'Waterfront Chalet',
        'icon' => 'Castle',
        'description' => 'Direct lakefront and coastal architectural residences.',
    ]);

    $response->assertRedirect('/admin/property-types');
    $this->assertDatabaseHas('property_types', [
        'name' => 'Waterfront Chalet',
        'slug' => 'waterfront-chalet',
        'icon' => 'Castle',
    ]);
});

test('admin can update a property type', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $type = PropertyType::factory()->create(['name' => 'Old Category']);

    $response = $this->actingAs($admin)->put("/admin/property-types/{$type->id}", [
        'name' => 'Updated Category Name',
        'icon' => 'Building2',
        'description' => 'Updated description.',
    ]);

    $response->assertRedirect('/admin/property-types');
    $this->assertDatabaseHas('property_types', [
        'id' => $type->id,
        'name' => 'Updated Category Name',
        'slug' => 'updated-category-name',
    ]);
});

test('admin can delete a property type', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $type = PropertyType::factory()->create();

    $response = $this->actingAs($admin)->delete("/admin/property-types/{$type->id}");

    $response->assertRedirect('/admin/property-types');
    $this->assertDatabaseMissing('property_types', ['id' => $type->id]);
});
