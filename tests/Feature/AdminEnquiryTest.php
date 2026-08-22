<?php

use App\Models\Enquiry;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin can view inquiries list with counts', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Enquiry::factory()->count(4)->create(['status' => 'new']);
    Enquiry::factory()->count(2)->create(['status' => 'contacted']);

    $response = $this->actingAs($admin)->get('/admin/enquiries');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/enquiries/index')
        ->has('enquiries.data', 6)
        ->has('statusCounts')
        ->where('statusCounts.new', 4)
        ->where('statusCounts.contacted', 2)
    );
});

test('admin can update inquiry status and add notes', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $enquiry = Enquiry::factory()->create(['status' => 'new']);

    $response = $this->actingAs($admin)->put("/admin/enquiries/{$enquiry->id}", [
        'status' => 'contacted',
        'admin_notes' => 'Spoke with client on phone. Tour scheduled for Friday 2 PM.',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('enquiries', [
        'id' => $enquiry->id,
        'status' => 'contacted',
        'admin_notes' => 'Spoke with client on phone. Tour scheduled for Friday 2 PM.',
    ]);
});

test('admin can delete an inquiry', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $enquiry = Enquiry::factory()->create();

    $response = $this->actingAs($admin)->delete("/admin/enquiries/{$enquiry->id}");

    $response->assertRedirect('/admin/enquiries');
    $this->assertDatabaseMissing('enquiries', ['id' => $enquiry->id]);
});
