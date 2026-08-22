<?php

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     */
    public function toResponse($request): Response
    {
        if ($request->wantsJson()) {
            return new JsonResponse(['two_factor' => false]);
        }

        $user = $request->user();

        if ($user instanceof User && $user->isAdmin()) {
            $intended = $request->session()->get('url.intended');
            if ($intended) {
                $path = parse_url((string) $intended, PHP_URL_PATH) ?? '';
                if (str_starts_with($path, '/admin')) {
                    return redirect()->intended('/admin');
                }
            }

            $request->session()->forget('url.intended');

            return redirect('/admin');
        }

        return redirect()->intended('/');
    }
}
