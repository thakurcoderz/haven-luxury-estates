<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEnquiryRequest;
use App\Models\Enquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class EnquiryController extends Controller
{
    public function userIndex(Request $request): Response
    {
        $user = $request->user();

        if (! $user) {
            return Inertia::render('user/enquiries', [
                'enquiries' => new LengthAwarePaginator([], 0, 10),
                'statusCounts' => ['all' => 0, 'new' => 0, 'contacted' => 0, 'resolved' => 0],
            ]);
        }

        $enquiries = Enquiry::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->with('property.propertyType')
            ->latest()
            ->paginate(10);

        $statusCounts = [
            'all' => Enquiry::where('user_id', $user->id)->orWhere('email', $user->email)->count(),
            'new' => Enquiry::where(fn ($q) => $q->where('user_id', $user->id)->orWhere('email', $user->email))->where('status', 'new')->count(),
            'contacted' => Enquiry::where(fn ($q) => $q->where('user_id', $user->id)->orWhere('email', $user->email))->where('status', 'contacted')->count(),
            'resolved' => Enquiry::where(fn ($q) => $q->where('user_id', $user->id)->orWhere('email', $user->email))->where('status', 'resolved')->count(),
        ];

        return Inertia::render('user/enquiries', [
            'enquiries' => $enquiries,
            'statusCounts' => $statusCounts,
        ]);
    }

    public function store(StoreEnquiryRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()?->id;
        $data['status'] = 'new';

        Enquiry::create($data);

        $typeMessage = match ($data['enquiry_type'] ?? 'general') {
            'schedule_tour' => 'Your tour request has been submitted successfully! An agent will confirm your appointment shortly.',
            'make_offer' => 'Your offer has been securely delivered to the listing representative. We will contact you immediately.',
            default => 'Thank you for reaching out! Your inquiry has been sent successfully. An agent will get back to you soon.',
        };

        return redirect()->back()->with('success', $typeMessage);
    }
}
