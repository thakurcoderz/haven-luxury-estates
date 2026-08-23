<?php

use App\Http\Controllers\DemoLoginController;
use App\Models\User;

test('demo sign in authenticates a seeded account and lands a client on the dashboard', function () {
    $user = User::factory()->create([
        'email' => 'user@example.com',
        'role' => 'user',
    ]);

    $response = $this->post(route('demo-login'), ['email' => 'user@example.com']);

    $response->assertRedirect('/dashboard');
    $this->assertAuthenticatedAs($user);
});

test('demo sign in sends an administrator to the admin panel', function () {
    $admin = User::factory()->create([
        'email' => 'admin@example.com',
        'role' => 'admin',
    ]);

    $response = $this->post(route('demo-login'), ['email' => 'admin@example.com']);

    $response->assertRedirect('/admin');
    $this->assertAuthenticatedAs($admin);
});

test('demo sign in refuses an account that is not on the allowlist', function () {
    $outsider = User::factory()->create([
        'email' => 'not-a-demo@example.com',
        'role' => 'admin',
    ]);

    $response = $this->post(route('demo-login'), ['email' => $outsider->email]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('demo sign in reports a missing seed instead of authenticating nobody', function () {
    $response = $this->post(route('demo-login'), ['email' => 'agent1@example.com']);

    $response->assertSessionHas('error');
    $this->assertGuest();
});

test('the login screen offers the demo accounts outside production', function () {
    $response = $this->get(route('login'))->assertOk();

    // Keys are emails, so dot-path assertions cannot address them.
    $accounts = $response->viewData('page')['props']['demoAccounts'];

    expect($accounts)->toHaveKeys(array_keys(DemoLoginController::accounts()));
    expect($accounts['admin@example.com']['role'])->toBe('Administrator');
});

test('production is never an allowed environment for demo sign in', function () {
    $reflected = new ReflectionClass(DemoLoginController::class);
    $environments = $reflected->getConstant('ALLOWED_ENVIRONMENTS');

    expect($environments)->not->toContain('production');

    app()['env'] = 'production';

    expect(DemoLoginController::isAvailable())->toBeFalse();
});
