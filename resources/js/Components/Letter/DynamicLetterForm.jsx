import React from 'react';
import { FiSend, FiSave } from 'react-icons/fi';

export default function DynamicLetterForm({
    subject,
    onSubjectChange,
    recipient,
    onRecipientChange,
    bodyContent,
    onBodyChange,
    formData = {},
    onFormDataChange,
    requiredFields = [],
    onSubmit,
    processing = false,
    submitLabel = 'Kirim Pengajuan Surat'
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            {/* Subject / Perihal */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Perihal / Judul Permohonan <span className="text-rose-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => onSubjectChange(e.target.value)}
                    placeholder="Contoh: Permohonan Rekomendasi Izin Operasional Sekolah 2026"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                />
            </div>

            {/* Recipient / Kepada Yth */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tujuan Surat (Kepada Yth) <span className="text-rose-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={recipient}
                    onChange={(e) => onRecipientChange(e.target.value)}
                    placeholder="Contoh: Kepala Dinas Pendidikan Kabupaten Bandung Barat"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                />
            </div>

            {/* Dynamic Custom Fields (if template requires extra fields like NISN, Pemohon, RAB, etc.) */}
            {requiredFields.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                        Parameter Khusus Template Surat:
                    </p>
                    {requiredFields.map((fieldKey) => (
                        <div key={fieldKey}>
                            <label className="block text-xs font-semibold capitalize text-slate-600 mb-1">
                                {fieldKey.replace(/_/g, ' ')}
                            </label>
                            <input
                                type="text"
                                value={formData[fieldKey] || ''}
                                onChange={(e) => onFormDataChange(fieldKey, e.target.value)}
                                placeholder={`Isi parameter ${fieldKey.replace(/_/g, ' ')}`}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Body Content / Narasi Surat */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Narasi / Isi Pokok Surat <span className="text-rose-500">*</span>
                </label>
                <textarea
                    required
                    rows={6}
                    value={bodyContent}
                    onChange={(e) => onBodyChange(e.target.value)}
                    placeholder="Tuliskan narasi lengkap alasan dan uraian permohonan surat Anda di sini..."
                    className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                />
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <FiSend className="w-4 h-4" />
                    <span>{processing ? 'Mengirim...' : submitLabel}</span>
                </button>
            </div>
        </form>
    );
}
