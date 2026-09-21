import React from 'react';
import { FiSun, FiDroplet, FiCheck } from 'react-icons/fi';

/**
 * SignatureControls.jsx
 * Sub-komponen murni untuk kontrol slider & mode warna tinta tanda tangan.
 */
export default function SignatureControls({
    threshold,
    setThreshold,
    darkness,
    setDarkness,
    colorMode,
    setColorMode,
    isProcessing,
}) {
    const colorOptions = [
        { id: 'original', label: 'Tinta Asli', desc: 'Sesuai foto', colorDot: 'bg-emerald-500' },
        { id: 'black', label: 'Hitam Dokumen', desc: 'Resmi & Pekat', colorDot: 'bg-slate-900' },
        { id: 'blue', label: 'Biru Pulpen', desc: 'Khas TTD Basah', colorDot: 'bg-blue-600' },
    ];

    return (
        <div className="space-y-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
            {/* Slider 1: Ambang Kertas (Threshold) */}
            <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                        <FiSun className="text-amber-500" />
                        <span>Pembersih Kertas (Threshold)</span>
                    </span>
                    <span className="font-mono text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                        {threshold}
                    </span>
                </div>
                <input
                    type="range"
                    min="120"
                    max="245"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    disabled={isProcessing}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                    <span>Pertahankan Tinta Tipis</span>
                    <span>Hilangkan Bayangan Kertas</span>
                </div>
            </div>

            {/* Slider 2: Kepekatan Tinta */}
            <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                        <FiDroplet className="text-blue-500" />
                        <span>Kepekatan Tinta (Contrast)</span>
                    </span>
                    <span className="font-mono text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                        {darkness}x
                    </span>
                </div>
                <input
                    type="range"
                    min="0.8"
                    max="2.2"
                    step="0.1"
                    value={darkness}
                    onChange={(e) => setDarkness(Number(e.target.value))}
                    disabled={isProcessing}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                    <span>Lebih Lembut</span>
                    <span>Lebih Tegas & Tebal</span>
                </div>
            </div>

            {/* Pilihan Mode Warna Tinta */}
            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Format Warna Tinta:
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {colorOptions.map((opt) => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => setColorMode(opt.id)}
                            disabled={isProcessing}
                            className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                                colorMode === opt.id
                                    ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                                    : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                            }`}
                        >
                            <div className="flex items-center justify-between w-full mb-1">
                                <span className={`w-2.5 h-2.5 rounded-full ${opt.colorDot}`} />
                                {colorMode === opt.id && <FiCheck className="text-blue-600 text-xs" />}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800 leading-tight">{opt.label}</p>
                                <p className="text-[10px] text-slate-400">{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
