<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyType;
use App\Models\SavedProperty;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->query('search'),
            'type' => $request->query('type'),
            'price_type' => $request->query('price_type', 'all'),
            'min_price' => $request->query('min_price'),
            'max_price' => $request->query('max_price'),
            'bedrooms' => $request->query('bedrooms', 'all'),
            'bathrooms' => $request->query('bathrooms', 'all'),
            'city' => $request->query('city', 'all'),
            'sort' => $request->query('sort', 'newest'),
        ];

        $query = Property::with(['propertyType', 'user'])
            ->available()
            ->filter($filters);

        match ($filters['sort']) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'area_desc' => $query->orderBy('area_sqft', 'desc'),
            'oldest' => $query->oldest(),
            default => $query->latest(),
        };

        $properties = $query->paginate(9)->withQueryString();

        $propertyTypes = PropertyType::withCount([
            'properties' => fn ($query) => $query->where('status', 'available'),
        ])->get();

        $cities = Property::available()
            ->distinct()
            ->pluck('city')
            ->sort()
            ->values();

        return Inertia::render('properties/index', [
            'properties' => $properties,
            'propertyTypes' => $propertyTypes,
            'cities' => $cities,
            'filters' => $filters,
        ]);
    }

    public function show(Request $request, Property $property): Response
    {
        $property->load(['propertyType', 'user']);

        $similarProperties = Property::with(['propertyType', 'user'])
            ->available()
            ->where('id', '!=', $property->id)
            ->where(function ($q) use ($property) {
                $q->where('property_type_id', $property->property_type_id)
                    ->orWhere('city', $property->city);
            })
            ->latest()
            ->take(3)
            ->get();

        $isSaved = $request->user() ? $property->isSavedBy($request->user()) : false;

        return Inertia::render('properties/show', [
            'property' => $property,
            'similarProperties' => $similarProperties,
            'isSaved' => $isSaved,
        ]);
    }

    public function toggleSave(Request $request, Property $property): RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $existing = SavedProperty::where('user_id', $user->id)
            ->where('property_id', $property->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $message = 'Property removed from your saved list.';
        } else {
            SavedProperty::create([
                'user_id' => $user->id,
                'property_id' => $property->id,
            ]);
            $message = 'Property added to your saved list!';
        }

        return redirect()->back()->with('success', $message);
    }

    public function saved(Request $request): Response
    {
        $user = $request->user();

        $savedProperties = Property::whereHas('savedProperties', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with(['propertyType', 'user'])
            ->latest()
            ->paginate(9);

        return Inertia::render('properties/saved', [
            'properties' => $savedProperties,
        ]);
    }
}
