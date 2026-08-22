<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePropertyTypeRequest;
use App\Http\Requests\Admin\UpdatePropertyTypeRequest;
use App\Models\PropertyType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PropertyTypeController extends Controller
{
    public function index(Request $request): Response
    {
        $propertyTypes = PropertyType::withCount('properties')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/property-types/index', [
            'propertyTypes' => $propertyTypes,
        ]);
    }

    public function store(StorePropertyTypeRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        PropertyType::create($data);

        return redirect()->route('admin.property-types.index')->with('success', 'Property category created successfully!');
    }

    public function update(UpdatePropertyTypeRequest $request, PropertyType $propertyType): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        $propertyType->update($data);

        return redirect()->route('admin.property-types.index')->with('success', 'Property category updated successfully!');
    }

    public function destroy(PropertyType $propertyType): RedirectResponse
    {
        if ($propertyType->properties()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete category with associated properties. Please reassign properties first.');
        }

        $propertyType->delete();

        return redirect()->route('admin.property-types.index')->with('success', 'Property category deleted successfully.');
    }
}
