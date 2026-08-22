<?php

namespace App\Http\Controllers;

use App\Models\Enquiry;
use App\Models\SavedProperty;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if (! $user) {
            return Inertia::render('dashboard', [
                'recentEnquiries' => [],
                'recentSavedProperties' => [],
                'stats' => [
                    'saved_count' => 0,
                    'total_enquiries' => 0,
                    'pending_enquiries' => 0,
                    'contacted_enquiries' => 0,
                    'resolved_enquiries' => 0,
                ],
            ]);
        }

        $enquiries = Enquiry::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->with('property.propertyType')
            ->latest()
            ->take(5)
            ->get();

        $savedProperties = SavedProperty::where('user_id', $user->id)
            ->with('property.propertyType')
            ->latest()
            ->take(4)
            ->get()
            ->map(fn ($item) => $item->property)
            ->filter()
            ->values();

        $stats = [
            'saved_count' => SavedProperty::where('user_id', $user->id)->count(),
            'total_enquiries' => Enquiry::where('user_id', $user->id)->orWhere('email', $user->email)->count(),
            'pending_enquiries' => Enquiry::where(fn ($q) => $q->where('user_id', $user->id)->orWhere('email', $user->email))->where('status', 'new')->count(),
            'contacted_enquiries' => Enquiry::where(fn ($q) => $q->where('user_id', $user->id)->orWhere('email', $user->email))->where('status', 'contacted')->count(),
            'resolved_enquiries' => Enquiry::where(fn ($q) => $q->where('user_id', $user->id)->orWhere('email', $user->email))->where('status', 'resolved')->count(),
        ];

        return Inertia::render('dashboard', [
            'recentEnquiries' => $enquiries,
            'recentSavedProperties' => $savedProperties,
            'stats' => $stats,
        ]);
    }
}
