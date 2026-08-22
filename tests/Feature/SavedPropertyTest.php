<?php

use App\Models\Property;
use App\Models\PropertyType;
use App\Models\SavedProperty;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guest is redirected to login when trying to save property', function () {
    $type = PropertyType::factory()->create();
    $property = Property::factory()->create(['property_type_id' => $type->id]);

    $response = $this->post("/properties/{$property->id}/save");

    $response->assertRedirect('/login');
});

test('authenticated user can bookmark and unbookmark a property', function () {
    $user = User::factory()->create();
    $type = PropertyType::factory()->create();
    $property = Property::factory()->create(['property_type_id' => $type->id]);

    // Save
    $saveResponse = $this->actingAs($user)->post("/properties/{$property->id}/save");
    $saveResponse->assertSessionHas('success');
    $this->assertDatabaseHas('saved_properties', [
        'user_id' => $user->id,
        'property_id' => $property->id,
    ]);

    // Unsave
    $unsaveResponse = $this->actingAs($user)->post("/properties/{$property->id}/save");
    $unsaveResponse->assertSessionHas('success');
    $this->assertDatabaseMissing('saved_properties', [
        'user_id' => $user->id,
        'property_id' => $property->id,
    ]);
});

test('authenticated user can view their saved properties list', function () {
    $user = User::factory()->create();
    $type = PropertyType::factory()->create();
    $property = Property::factory()->create(['property_type_id' => $type->id]);

    SavedProperty::create([
        'user_id' => $user->id,
        'property_id' => $property->id,
    ]);

    $response = $this->actingAs($user)->get('/saved-properties');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('properties/saved')
        ->has('properties.data', 1)
        ->where('properties.data.0.id', $property->id)
    );
});
