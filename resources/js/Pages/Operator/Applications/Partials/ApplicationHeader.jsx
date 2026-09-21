import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';

/**
 * ApplicationHeader renders the top title bar and action button for Operator applications.
 * Single Responsibility: Present title and primary navigation action to create new application.
 */
export default function ApplicationHeader() {
    return (
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline/10 pb-8">
            <div>
                <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                    Correspondence Bureau
                </p>
                <h1 className="font-headline-md text-3xl md:text-5xl text-primary font-normal">
                    Archive & Status Surat
                </h1>
            </div>
            <div className="flex items-center gap-3">
                <Link
                    href="/operator/applications/create"
                    className="px-5 py-3 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest font-semibold rounded-DEFAULT hover:bg-inverse-surface transition-colors flex items-center gap-2 shadow-xs"
                >
                    <Icon name="add" className="text-sm text-on-primary" />
                    <span>New Entry</span>
                </Link>
            </div>
        </header>
    );
}
