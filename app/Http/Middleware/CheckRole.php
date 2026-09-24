<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        $userRole = $request->user()->role;

        // Backward compatibility: 'admin' diperlakukan setara dengan 'staff_kepala'
        if ($userRole === 'admin' && in_array('staff_kepala', $roles)) {
            return $next($request);
        }

        if (in_array($userRole, $roles)) {
            return $next($request);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Akses ditolak. Anda tidak memiliki izin untuk melakukan tindakan ini.'
            ], 403);
        }

        abort(403, 'Akses ditolak. Peran Anda (' . $userRole . ') tidak memiliki izin untuk mengakses halaman ini.');
    }
}
