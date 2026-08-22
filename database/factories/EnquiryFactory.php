<?php

namespace Database\Factories;

use App\Models\Enquiry;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Enquiry>
 */
class EnquiryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['general', 'property_inquiry', 'schedule_tour', 'make_offer']);

        return [
            'property_id' => null,
            'user_id' => null,
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'subject' => fake()->sentence(5),
            'message' => fake()->paragraph(2),
            'enquiry_type' => $type,
            'preferred_date' => $type === 'schedule_tour' ? fake()->dateTimeBetween('+1 day', '+2 weeks')->format('Y-m-d') : null,
            'status' => fake()->randomElement(['new', 'contacted', 'resolved', 'archived']),
            'admin_notes' => fake()->optional(0.3)->sentence(),
        ];
    }

    public function forProperty(Property $property): static
    {
        return $this->state(fn (array $attributes) => [
            'property_id' => $property->id,
            'enquiry_type' => 'property_inquiry',
            'subject' => "Inquiry regarding {$property->title}",
        ]);
    }

    public function tourRequest(): static
    {
        return $this->state(fn (array $attributes) => [
            'enquiry_type' => 'schedule_tour',
            'preferred_date' => now()->addDays(3)->format('Y-m-d'),
        ]);
    }
}
