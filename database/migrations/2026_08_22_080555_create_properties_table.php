<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_type_id')->constrained('property_types')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // Agent/Owner
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 14, 2);
            $table->string('price_type')->default('sale'); // 'sale', 'rent'
            $table->string('rent_period')->nullable(); // 'monthly', 'yearly', 'weekly'
            $table->string('status')->default('available'); // 'available', 'pending', 'sold', 'rented'
            $table->boolean('featured')->default(false);
            $table->integer('bedrooms')->default(0);
            $table->decimal('bathrooms', 3, 1)->default(0);
            $table->integer('area_sqft')->default(0);
            $table->integer('garages')->default(0);
            $table->integer('year_built')->nullable();
            $table->string('address');
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('country')->default('USA');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->json('amenities')->nullable();
            $table->json('images')->nullable();
            $table->string('video_url')->nullable();
            $table->string('floor_plan_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
