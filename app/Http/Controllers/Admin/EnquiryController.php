<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateEnquiryRequest;
use App\Models\Enquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->query('search'),
            'status' => $request->query('status', 'all'),
            'type' => $request->query('type', 'all'),
        ];

        $query = Enquiry::with(['property', 'user']);

        if ($filters['search']) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        if ($filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        if ($filters['type'] !== 'all') {
            $query->where('enquiry_type', $filters['type']);
        }

        $enquiries = $query->latest()->paginate(10)->withQueryString();

        $statusCounts = [
            'all' => Enquiry::count(),
            'new' => Enquiry::where('status', 'new')->count(),
            'contacted' => Enquiry::where('status', 'contacted')->count(),
            'resolved' => Enquiry::where('status', 'resolved')->count(),
            'archived' => Enquiry::where('status', 'archived')->count(),
        ];

        return Inertia::render('admin/enquiries/index', [
            'enquiries' => $enquiries,
            'filters' => $filters,
            'statusCounts' => $statusCounts,
        ]);
    }

    public function show(Enquiry $enquiry): Response
    {
        $enquiry->load(['property', 'user']);

        return Inertia::render('admin/enquiries/show', [
            'enquiry' => $enquiry,
        ]);
    }

    public function update(UpdateEnquiryRequest $request, Enquiry $enquiry): RedirectResponse
    {
        $enquiry->update($request->validated());

        return redirect()->back()->with('success', 'Enquiry status and notes updated.');
    }

    public function destroy(Enquiry $enquiry): RedirectResponse
    {
        $enquiry->delete();

        return redirect()->route('admin.enquiries.index')->with('success', 'Enquiry deleted successfully.');
    }
}
