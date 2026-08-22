<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\PropertyType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Property>
 */
class PropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(4);
        $priceType = fake()->randomElement(['sale', 'rent']);
        $price = $priceType === 'sale'
            ? fake()->numberBetween(250000, 3500000)
            : fake()->numberBetween(1500, 15000);

        $amenityPool = [
            'Swimming Pool',
            'Central Air Conditioning',
            'High Speed Fiber Internet',
            'Gym & Fitness Center',
            'Private Balcony & Terrace',
            '24/7 Security & CCTV',
            'Underground Garage Parking',
            'Lush Landscaped Garden',
            'Pet Friendly',
            'Panoramic City/Ocean View',
            'Elevator Access',
            'Smart Home Automation',
            'Modern Fireplace',
            'Chef Kitchen with Island',
            'Walk-in Closet',
            'Spa & Jacuzzi',
        ];

        $imagesPool = [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        ];

        $selectedImages = fake()->randomElements($imagesPool, fake()->numberBetween(3, 5));

        $cities = [
            ['city' => 'Beverly Hills', 'state' => 'CA', 'zip' => '90210', 'lat' => 34.0736, 'lng' => -118.4004],
            ['city' => 'Miami Beach', 'state' => 'FL', 'zip' => '33139', 'lat' => 25.7907, 'lng' => -80.1300],
            ['city' => 'New York', 'state' => 'NY', 'zip' => '10001', 'lat' => 40.7128, 'lng' => -74.0060],
            ['city' => 'Austin', 'state' => 'TX', 'zip' => '78701', 'lat' => 30.2672, 'lng' => -97.7431],
            ['city' => 'Seattle', 'state' => 'WA', 'zip' => '98101', 'lat' => 47.6062, 'lng' => -122.3321],
            ['city' => 'San Francisco', 'state' => 'CA', 'zip' => '94102', 'lat' => 37.7749, 'lng' => -122.4194],
            ['city' => 'Scottsdale', 'state' => 'AZ', 'zip' => '85251', 'lat' => 33.4942, 'lng' => -111.9261],
        ];
        $location = fake()->randomElement($cities);

        return [
            'property_type_id' => PropertyType::factory(),
            'user_id' => User::factory(),
            'title' => rtrim($title, '.'),
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(1000, 9999),
            'description' => fake()->paragraphs(3, true),
            'price' => $price,
            'price_type' => $priceType,
            'rent_period' => $priceType === 'rent' ? fake()->randomElement(['monthly', 'yearly']) : null,
            'status' => 'available',
            'featured' => fake()->boolean(30),
            'bedrooms' => fake()->numberBetween(1, 6),
            'bathrooms' => fake()->randomElement([1, 1.5, 2, 2.5, 3, 3.5, 4, 5]),
            'area_sqft' => fake()->numberBetween(650, 7500),
            'garages' => fake()->numberBetween(0, 3),
            'year_built' => fake()->numberBetween(2005, 2025),
            'address' => fake()->streetAddress(),
            'city' => $location['city'],
            'state' => $location['state'],
            'zip_code' => $location['zip'],
            'country' => 'USA',
            'latitude' => $location['lat'] + fake()->randomFloat(4, -0.05, 0.05),
            'longitude' => $location['lng'] + fake()->randomFloat(4, -0.05, 0.05),
            'amenities' => fake()->randomElements($amenityPool, fake()->numberBetween(5, 10)),
            'images' => $selectedImages,
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'floor_plan_url' => null,
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'featured' => true,
        ]);
    }

    public function forSale(): static
    {
        return $this->state(fn (array $attributes) => [
            'price_type' => 'sale',
            'rent_period' => null,
        ]);
    }

    public function forRent(): static
    {
        return $this->state(fn (array $attributes) => [
            'price_type' => 'rent',
            'rent_period' => 'monthly',
        ]);
    }
}
