<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $agents = User::whereIn('role', ['agent', 'admin'])
            ->withCount('properties')
            ->get();

        return Inertia::render('contact', [
            'agents' => $agents,
        ]);
    }
}
