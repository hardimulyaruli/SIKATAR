import React from 'react';

/**
 * Reusable wrapper for tables providing smooth localized loading overlay,
 * with prominent spinning logo/indicator and subtle backdrop blur.
 */
export default function TableWrapper({ 
    isLoading = false, 
    children, 
    loadingText = 'Memuat data...',
    className = ''
}) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xs min-h-[140px] ${className}`}>
            {isLoading && (
                <div 
                    className="absolute inset-0 z-30 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 transition-all duration-200"
                    aria-live="polite"
                    aria-busy="true"
                >
                    <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white shadow-xl border border-slate-200/80 gap-3 animate-in fade-in zoom-in-95 duration-150">
                        {/* Logo loading muter-muter */}
                        <div className="relative flex items-center justify-center">
                            {/* Outer animated spinning ring */}
                            <div className="w-10 h-10 rounded-full border-[3.5px] border-blue-100 border-t-blue-600 border-r-blue-500 animate-spin"></div>
                            {/* Inner pulsing badge/dot */}
                            <div className="absolute w-3 h-3 rounded-full bg-blue-600 animate-pulse"></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700 tracking-wide">{loadingText}</span>
                    </div>
                </div>
            )}
            <div className={`overflow-x-auto transition-opacity duration-200 ${isLoading ? 'opacity-30 select-none pointer-events-none' : 'opacity-100'}`}>
                {children}
            </div>
        </div>
    );
}
