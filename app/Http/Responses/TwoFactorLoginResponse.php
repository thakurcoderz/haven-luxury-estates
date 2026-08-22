<?php

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class TwoFactorLoginResponse implements TwoFactorLoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     */
    public function toResponse($request): Response
    {
        if ($request->wantsJson()) {
            return new JsonResponse('', 204);
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
