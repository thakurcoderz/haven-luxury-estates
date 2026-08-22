<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePropertyRequest;
use App\Http\Requests\Admin\UpdatePropertyRequest;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->query('search'),
            'type' => $request->query('type', 'all'),
            'status' => $request->query('status', 'all'),
            'price_type' => $request->query('price_type', 'all'),
            'featured' => $request->query('featured', 'all'),
        ];

        $query = Property::with(['propertyType', 'user', 'enquiries'])
            ->withCount('enquiries');

        if ($filters['search']) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if ($filters['type'] !== 'all') {
            $query->whereHas('propertyType', fn ($q) => $q->where('slug', $filters['type']));
        }

        if ($filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        if ($filters['price_type'] !== 'all') {
            $query->where('price_type', $filters['price_type']);
        }

        if ($filters['featured'] !== 'all') {
            $query->where('featured', $filters['featured'] === '1' || $filters['featured'] === 'true');
        }

        $properties = $query->latest()->paginate(10)->withQueryString();
        $propertyTypes = PropertyType::all();

        return Inertia::render('admin/properties/index', [
            'properties' => $properties,
            'propertyTypes' => $propertyTypes,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        $propertyTypes = PropertyType::all();
        $agents = User::whereIn('role', ['agent', 'admin'])->get();

        return Inertia::render('admin/properties/create', [
            'propertyTypes' => $propertyTypes,
            'agents' => $agents,
        ]);
    }

    public function store(StorePropertyRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $baseSlug = Str::slug($data['title']);
        $slug = $baseSlug;
        $counter = 1;
        while (Property::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }
        $data['slug'] = $slug;

        if (empty($data['user_id'])) {
            $data['user_id'] = $request->user()?->id;
        }

        Property::create($data);

        return redirect()->route('admin.properties.index')->with('success', 'Property listing created successfully!');
    }

    public function edit(Property $property): Response
    {
        $propertyTypes = PropertyType::all();
        $agents = User::whereIn('role', ['agent', 'admin'])->get();

        return Inertia::render('admin/properties/edit', [
            'property' => $property,
            'propertyTypes' => $propertyTypes,
            'agents' => $agents,
        ]);
    }

    public function update(UpdatePropertyRequest $request, Property $property): RedirectResponse
    {
        $data = $request->validated();

        if ($property->title !== $data['title']) {
            $baseSlug = Str::slug($data['title']);
            $slug = $baseSlug;
            $counter = 1;
            while (Property::where('slug', $slug)->where('id', '!=', $property->id)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $data['slug'] = $slug;
        }

        $property->update($data);

        return redirect()->route('admin.properties.index')->with('success', 'Property listing updated successfully!');
    }

    public function destroy(Property $property): RedirectResponse
    {
        $property->delete();

        return redirect()->route('admin.properties.index')->with('success', 'Property deleted successfully.');
    }

    public function toggleFeatured(Property $property): RedirectResponse
    {
        $property->update(['featured' => ! $property->featured]);

        $status = $property->featured ? 'featured' : 'unfeatured';

        return redirect()->back()->with('success', "Property marked as {$status}.");
    }
}
