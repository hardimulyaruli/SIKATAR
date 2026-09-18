<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordChanged
{
    /**
     * Jika user memiliki flag must_change_password = true,
     * paksa redirect ke halaman ganti password.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->must_change_password) {
            // Izinkan akses ke halaman force-change-password dan logout saja
            $allowedRoutes = ['password.force-change', 'password.force-update', 'logout'];

            if (!$request->routeIs(...$allowedRoutes)) {
                return redirect()->route('password.force-change');
            }
        }

        return $next($request);
    }
}
