<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? $request->user()->load('school') : null,
                'notifications' => fn () => $request->user()
                    ? $request->user()->notifications()->latest()->take(15)->get()->map(function ($n) {
                        return [
                            'id' => $n->id,
                            'title' => $n->data['title'] ?? 'Notifikasi',
                            'message' => $n->data['message'] ?? '',
                            'url' => $n->data['url'] ?? '#',
                            'type' => $n->data['type'] ?? 'info',
                            'read_at' => $n->read_at,
                            'created_at' => $n->created_at->diffForHumans(),
                        ];
                    })
                    : [],
                'unread_notifications_count' => fn () => $request->user() ? $request->user()->unreadNotifications()->count() : 0,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
