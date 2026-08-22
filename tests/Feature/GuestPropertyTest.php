<?php

use App\Models\Property;
use App\Models\PropertyType;
use Inertia\Testing\AssertableInertia as Assert;

test('guest can view home page with featured properties and categories', function () {
    $type = PropertyType::factory()->create(['name' => 'Luxury Villa', 'slug' => 'luxury-villa']);
    $featured = Property::factory()->create([
        'property_type_id' => $type->id,
        'featured' => true,
        'status' => 'available',
    ]);

    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('welcome')
        ->has('featuredProperties')
        ->has('propertyTypes')
        ->has('stats')
    );
});

test('guest can view property listing catalog with pagination', function () {
    $type = PropertyType::factory()->create();
    Property::factory()->count(12)->create([
        'property_type_id' => $type->id,
        'status' => 'available',
    ]);

    $response = $this->get('/properties');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('properties/index')
        ->has('properties.data', 9)
        ->has('propertyTypes')
        ->has('cities')
    );
});

test('guest can filter properties by category, price type, and search term', function () {
    $villaType = PropertyType::factory()->create(['slug' => 'luxury-villa']);
    $aptType = PropertyType::factory()->create(['slug' => 'modern-apartment']);

    $villa = Property::factory()->create([
        'title' => 'Beverly Crest Villa',
        'property_type_id' => $villaType->id,
        'price_type' => 'sale',
        'price' => 5000000,
        'city' => 'Beverly Hills',
        'status' => 'available',
    ]);

    $apt = Property::factory()->create([
        'title' => 'Brickell Penthouse',
        'property_type_id' => $aptType->id,
        'price_type' => 'rent',
        'price' => 12000,
        'city' => 'Miami',
        'status' => 'available',
    ]);

    // Search by keyword
    $response = $this->get('/properties?search=Beverly');
    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('properties/index')
        ->has('properties.data', 1)
        ->where('properties.data.0.title', 'Beverly Crest Villa')
    );

    // Filter by type
    $response = $this->get('/properties?type=modern-apartment');
    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('properties/index')
        ->has('properties.data', 1)
        ->where('properties.data.0.title', 'Brickell Penthouse')
    );

    // Filter by price type
    $response = $this->get('/properties?price_type=rent');
    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('properties/index')
        ->has('properties.data', 1)
    );
});

test('guest can view single property details page', function () {
    $type = PropertyType::factory()->create();
    $property = Property::factory()->create([
        'property_type_id' => $type->id,
        'status' => 'available',
    ]);

    $response = $this->get("/properties/{$property->slug}");

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('properties/show')
        ->has('property')
        ->where('property.id', $property->id)
        ->has('similarProperties')
    );
});

test('guest can view about and contact pages', function () {
    $aboutResponse = $this->get('/about');
    $aboutResponse->assertStatus(200);
    $aboutResponse->assertInertia(fn (Assert $page) => $page->component('about'));

    $contactResponse = $this->get('/contact');
    $contactResponse->assertStatus(200);
    $contactResponse->assertInertia(fn (Assert $page) => $page->component('contact'));
});
