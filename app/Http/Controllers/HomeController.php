<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyType;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $featuredProperties = Property::with(['propertyType', 'user'])
            ->available()
            ->featured()
            ->latest()
            ->take(6)
            ->get();

        $latestProperties = Property::with(['propertyType', 'user'])
            ->available()
            ->latest()
            ->take(6)
            ->get();

        $propertyTypes = PropertyType::withCount([
            'properties' => fn ($query) => $query->where('status', 'available'),
        ])->get();

        $agents = User::whereIn('role', ['agent', 'admin'])
            ->withCount('properties')
            ->take(4)
            ->get();

        $cities = Property::available()
            ->select('city')
            ->selectRaw('count(*) as count')
            ->groupBy('city')
            ->orderByDesc('count')
            ->take(6)
            ->get();

        $stats = [
            'total_properties' => Property::available()->count(),
            'total_cities' => Property::distinct('city')->count('city'),
            'total_agents' => User::whereIn('role', ['agent', 'admin'])->count(),
            'happy_clients' => 850,
        ];

        return Inertia::render('welcome', [
            'featuredProperties' => $featuredProperties,
            'latestProperties' => $latestProperties,
            'propertyTypes' => $propertyTypes,
            'agents' => $agents,
            'cities' => $cities,
            'stats' => $stats,
        ]);
    }
}
