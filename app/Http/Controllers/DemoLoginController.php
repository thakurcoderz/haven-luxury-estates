<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * One-click sign in for the seeded demo accounts.
 *
 * Only ever reachable outside production: the route is registered behind the
 * same environment check that guards this controller, so both the routing
 * layer and the handler have to agree before any session is issued.
 */
class DemoLoginController extends Controller
{
    /**
     * Environments allowed to use demo sign in. Never add 'production'.
     *
     * @var list<string>
     */
    private const ALLOWED_ENVIRONMENTS = ['local', 'testing'];

    /**
     * The seeded accounts offered on the login screen, keyed by email so the
     * email itself is the allowlist rather than user-supplied input.
     *
     * @return array<string, array{name: string, role: string, description: string}>
     */
    public static function accounts(): array
    {
        return [
            'admin@example.com' => [
                'name' => 'Admin Executive',
                'role' => 'Administrator',
                'description' => 'Full access to listings, leads, and users.',
            ],
            'agent1@example.com' => [
                'name' => 'Sarah Jenkins',
                'role' => 'Agent',
                'description' => 'Manages her own listings and inquiries.',
            ],
            'user@example.com' => [
                'name' => 'Alex Morgan',
                'role' => 'Client',
                'description' => 'Saved properties and viewing requests.',
            ],
        ];
    }

    /**
     * Whether demo sign in is available in the current environment.
     */
    public static function isAvailable(): bool
    {
        return app()->environment(self::ALLOWED_ENVIRONMENTS);
    }

    public function __invoke(Request $request): RedirectResponse
    {
        abort_unless(self::isAvailable(), Response::HTTP_NOT_FOUND);

        $validated = $request->validate([
            'email' => ['required', 'string', 'in:'.implode(',', array_keys(self::accounts()))],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if ($user === null) {
            return back()->with('error', 'That demo account has not been seeded yet. Run "php artisan db:seed".');
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended($user->isAdmin() ? '/admin' : '/dashboard');
    }
}
