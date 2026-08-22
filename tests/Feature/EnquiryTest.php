<?php

use App\Models\Property;
use App\Models\PropertyType;
use App\Models\User;

test('guest can submit an inquiry for a property', function () {
    $type = PropertyType::factory()->create();
    $property = Property::factory()->create(['property_type_id' => $type->id]);

    $response = $this->post('/enquiries', [
        'property_id' => $property->id,
        'name' => 'Jane Smith',
        'email' => 'jane@example.com',
        'phone' => '+13105551234',
        'enquiry_type' => 'schedule_tour',
        'preferred_date' => '2026-09-15',
        'message' => 'I would love to schedule a private tour of this residence.',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('enquiries', [
        'property_id' => $property->id,
        'name' => 'Jane Smith',
        'email' => 'jane@example.com',
        'enquiry_type' => 'schedule_tour',
        'status' => 'new',
    ]);
});

test('guest can submit a general consultation inquiry', function () {
    $response = $this->post('/enquiries', [
        'name' => 'Alex Johnson',
        'email' => 'alex@example.com',
        'phone' => '+13105554321',
        'enquiry_type' => 'general',
        'message' => 'I am looking for off-market investment options in Beverly Hills.',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('enquiries', [
        'property_id' => null,
        'name' => 'Alex Johnson',
        'email' => 'alex@example.com',
        'enquiry_type' => 'general',
    ]);
});

test('authenticated user inquiry attaches user_id automatically', function () {
    $user = User::factory()->create();
    $type = PropertyType::factory()->create();
    $property = Property::factory()->create(['property_type_id' => $type->id]);

    $response = $this->actingAs($user)->post('/enquiries', [
        'property_id' => $property->id,
        'name' => $user->name,
        'email' => $user->email,
        'enquiry_type' => 'make_offer',
        'message' => 'Submitting formal acquisition offer.',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('enquiries', [
        'user_id' => $user->id,
        'property_id' => $property->id,
        'email' => $user->email,
    ]);
});

test('inquiry validation errors on missing required fields', function () {
    $response = $this->post('/enquiries', [
        'name' => '',
        'email' => 'not-an-email',
        'message' => '',
    ]);

    $response->assertSessionHasErrors(['name', 'email', 'message']);
});
