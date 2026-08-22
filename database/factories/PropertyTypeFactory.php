<?php

namespace Database\Factories;

use App\Models\PropertyType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PropertyType>
 */
class PropertyTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Apartment',
            'Luxury Villa',
            'Modern Townhouse',
            'Commercial Space',
            'Penthouse',
            'Single Family Home',
            'Beachfront Villa',
            'Studio Loft',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->sentence(12),
            'icon' => fake()->randomElement(['Building2', 'Home', 'Castle', 'Building', 'Landmark', 'Warehouse', 'Sparkles', 'KeyRound']),
        ];
    }
}
