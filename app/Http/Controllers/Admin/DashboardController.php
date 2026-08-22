<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $stats = [
            'total_properties' => Property::count(),
            'active_properties' => Property::where('status', 'available')->count(),
            'pending_properties' => Property::where('status', 'pending')->count(),
            'sold_or_rented_properties' => Property::whereIn('status', ['sold', 'rented'])->count(),
            'total_enquiries' => Enquiry::count(),
            'new_enquiries' => Enquiry::where('status', 'new')->count(),
            'total_users' => User::count(),
            'total_agents' => User::whereIn('role', ['agent', 'admin'])->count(),
            'total_property_types' => PropertyType::count(),
        ];

        $recentEnquiries = Enquiry::with('property')
            ->latest()
            ->take(5)
            ->get();

        $recentProperties = Property::with(['propertyType', 'user'])
            ->latest()
            ->take(5)
            ->get();

        $enquiryStatusCounts = [
            'new' => Enquiry::where('status', 'new')->count(),
            'contacted' => Enquiry::where('status', 'contacted')->count(),
            'resolved' => Enquiry::where('status', 'resolved')->count(),
            'archived' => Enquiry::where('status', 'archived')->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentEnquiries' => $recentEnquiries,
            'recentProperties' => $recentProperties,
            'enquiryStatusCounts' => $enquiryStatusCounts,
        ]);
    }
}
