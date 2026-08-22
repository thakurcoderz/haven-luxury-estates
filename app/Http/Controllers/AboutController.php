<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function index(Request $request): Response
    {
        $agents = User::whereIn('role', ['agent', 'admin'])
            ->withCount('properties')
            ->get();

        $stats = [
            'properties_listed' => Property::count(),
            'properties_sold' => Property::where('status', 'sold')->count() + 140,
            'active_agents' => $agents->count(),
            'client_satisfaction' => '99.4%',
        ];

        return Inertia::render('about', [
            'agents' => $agents,
            'stats' => $stats,
        ]);
    }
}
