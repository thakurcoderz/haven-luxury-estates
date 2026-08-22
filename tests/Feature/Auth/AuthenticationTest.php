<?php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Fortify\Features;

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
});

test('normal users are redirected to home page upon login by default', function () {
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('home'));
});

test('admin users are redirected to admin dashboard upon login by default', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->post(route('login.store'), [
        'email' => $admin->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect('/admin');
});

test('admin users are redirected to admin dashboard even if login was initiated from guest page', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    // Admin clicks sign in while on guest home page
    $this->withHeaders(['referer' => url('/')])
        ->get(route('login'));

    $response = $this->post(route('login.store'), [
        'email' => $admin->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect('/admin');
});

test('admin users are redirected to intended admin url if they were trying to access an admin page', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->withSession(['url.intended' => '/admin/enquiries'])
        ->post(route('login.store'), [
            'email' => $admin->email,
            'password' => 'password',
        ]);

    $this->assertAuthenticated();
    $response->assertRedirect('/admin/enquiries');
});

test('users are redirected to intended url after login if present', function () {
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->withSession(['url.intended' => '/properties/luxury-penthouse'])
        ->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

    $this->assertAuthenticated();
    $response->assertRedirect('/properties/luxury-penthouse');
});

test('visiting login from a referer stores intended url', function () {
    $user = User::factory()->create(['role' => 'user']);

    $this->withHeaders(['referer' => url('/properties/beachfront-villa')])
        ->get(route('login'))
        ->assertSessionHas('url.intended', url('/properties/beachfront-villa'));

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(url('/properties/beachfront-villa'));
});

test('users with two factor enabled are redirected to two factor challenge', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->withTwoFactor()->create();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('two-factor.login'));
    $response->assertSessionHas('login.id', $user->id);
    $this->assertGuest();
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect(route('home'));

    $this->assertGuest();
});

test('users are rate limited', function () {
    $user = User::factory()->create();

    RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});
