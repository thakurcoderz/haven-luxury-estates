<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin can view users list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->count(4)->create(['role' => 'user']);
    User::factory()->count(2)->create(['role' => 'agent']);

    $response = $this->actingAs($admin)->get('/admin/users');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/users/index')
        ->has('users.data', 7) // 1 admin + 4 users + 2 agents
        ->has('roleCounts')
        ->where('roleCounts.admin', 1)
        ->where('roleCounts.agent', 2)
        ->where('roleCounts.user', 4)
    );
});

test('admin can update user role, phone, and professional bio', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($admin)->put("/admin/users/{$user->id}", [
        'role' => 'agent',
        'phone' => '+1 (310) 555-9988',
        'bio' => 'Senior Luxury Portfolio Specialist in West Hollywood.',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'role' => 'agent',
        'phone' => '+1 (310) 555-9988',
        'bio' => 'Senior Luxury Portfolio Specialist in West Hollywood.',
    ]);
});

test('non-admin cannot access user management', function () {
    $user = User::factory()->create(['role' => 'user']);

    $this->actingAs($user)->get('/admin/users')->assertStatus(403);
    $this->actingAs($user)->put("/admin/users/{$user->id}", ['role' => 'admin'])->assertStatus(403);
});
