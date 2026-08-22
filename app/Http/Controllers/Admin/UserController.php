<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->query('search'),
            'role' => $request->query('role', 'all'),
        ];

        $query = User::withCount(['properties', 'enquiries']);

        if ($filters['search']) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($filters['role'] !== 'all') {
            $query->where('role', $filters['role']);
        }

        $users = $query->latest()->paginate(12)->withQueryString();

        $roleCounts = [
            'all' => User::count(),
            'admin' => User::where('role', 'admin')->count(),
            'agent' => User::where('role', 'agent')->count(),
            'user' => User::where('role', 'user')->count(),
        ];

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $filters,
            'roleCounts' => $roleCounts,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:admin,agent,user'],
            'phone' => ['nullable', 'string', 'max:50'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', "User {$user->name} updated successfully.");
    }
}
