import React from 'react';
import { FiSend, FiPlus, FiTrash2, FiUsers } from 'react-icons/fi';
import { CLASSIFICATION_CODES } from '@/Utils/classificationCodes';

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
    classificationCode = '800.1.3.2',
    onClassificationCodeChange,
    onSubmit,
    processing = false,
    submitLabel = 'Kirim Pengajuan Surat'
}) {
    const applicants = Array.isArray(formData.applicants) && formData.applicants.length > 0
        ? formData.applicants
        : [
            {
                nama: formData.nama_pegawai || '',
                nip: formData.nip || '',
                gol_asal: formData.pangkat_golongan || '',
                jabatan: formData.jabatan || '',
                unit_kerja: formData.unit_kerja || '',
                kecamatan: formData.kecamatan || '',
            }
        ];

    const updateApplicant = (index, field, value) => {
        const updated = [...applicants];
        updated[index] = { ...updated[index], [field]: value };
        onFormDataChange('applicants', updated);
        if (index === 0) {
            onFormDataChange(field === 'gol_asal' ? 'pangkat_golongan' : field, value);
        }
    };

    const addApplicant = () => {
        const updated = [
            ...applicants,
            { nama: '', nip: '', gol_asal: '', jabatan: '', unit_kerja: '', kecamatan: '' }
        ];
        onFormDataChange('applicants', updated);
    };

    const removeApplicant = (index) => {
        if (applicants.length <= 1) return;
        const updated = applicants.filter((_, i) => i !== index);
        onFormDataChange('applicants', updated);
    };

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            {/* Classification Code Dropdown (Penomoran Resmi) */}
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-3">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-950 mb-1">
                        Kode Klasifikasi Surat (Penomoran Resmi 2024) <span className="text-rose-500">*</span>
                    </label>
                    <select
                        value={classificationCode}
                        onChange={(e) => onClassificationCodeChange && onClassificationCodeChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-xl text-xs font-semibold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                    >
                        {CLASSIFICATION_CODES.map((item) => (
                            <option key={`${item.code}-${item.name}`} value={item.code}>
                                {item.code} — {item.name} ({item.category})
                            </option>
                        ))}
                    </select>
                    <p className="text-[11px] text-blue-700/80 mt-1">
                        Format nomor resmi yang akan tercetak: <span className="font-mono font-bold">{classificationCode}/[Nomor Urut] - [Unit]/[Tahun]</span>
                    </p>
                </div>
            </div>

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
                    placeholder="Tuliskan Perihal / Judul Permohonan Surat..."
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
                    placeholder="Kepala Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Kabupaten Bandung Barat"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                />
            </div>

            {/* Dynamic Multi-Applicant Manager (Lampiran Data Pemohon) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2 text-blue-900">
                        <FiUsers className="w-4 h-4 text-blue-600" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                            Data Pemohon ({applicants.length} Orang) — {applicants.length > 1 ? 'Akan otomatis membuat Lampiran' : 'Tampil di Halaman Utama'}
                        </h4>
                    </div>
                    <button
                        type="button"
                        onClick={addApplicant}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                    >
                        <FiPlus className="w-3.5 h-3.5" />
                        <span>+ Tambah Pemohon</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {applicants.map((item, idx) => (
                        <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 relative shadow-xs">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-100 pb-1">
                                <span>Pemohon #{idx + 1} {idx === 0 && '(Pemohon Utama)'}</span>
                                {applicants.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeApplicant(idx)}
                                        className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1"
                                    >
                                        <FiTrash2 className="w-3.5 h-3.5" />
                                        <span>Hapus</span>
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div className="sm:col-span-2">
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Nama Lengkap & Gelar</label>
                                    <input
                                        type="text"
                                        required={idx === 0}
                                        value={item.nama || ''}
                                        onChange={(e) => updateApplicant(idx, 'nama', e.target.value)}
                                        placeholder="Contoh: Budi Santoso, S.Pd"
                                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">NIP</label>
                                    <input
                                        type="text"
                                        value={item.nip || ''}
                                        onChange={(e) => updateApplicant(idx, 'nip', e.target.value)}
                                        placeholder="Contoh: 19800512 200604 1 005"
                                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Pangkat / Golongan Asal</label>
                                    <input
                                        type="text"
                                        value={item.gol_asal || ''}
                                        onChange={(e) => updateApplicant(idx, 'gol_asal', e.target.value)}
                                        placeholder="Contoh: Pembina Tk.I, IV/b"
                                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Jabatan</label>
                                    <input
                                        type="text"
                                        value={item.jabatan || ''}
                                        onChange={(e) => updateApplicant(idx, 'jabatan', e.target.value)}
                                        placeholder="Contoh: Guru Ahli Madya"
                                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Unit Kerja</label>
                                    <input
                                        type="text"
                                        value={item.unit_kerja || ''}
                                        onChange={(e) => updateApplicant(idx, 'unit_kerja', e.target.value)}
                                        placeholder="Contoh: SD Negeri 1 Padalarang"
                                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Kecamatan</label>
                                    <input
                                        type="text"
                                        value={item.kecamatan || ''}
                                        onChange={(e) => updateApplicant(idx, 'kecamatan', e.target.value)}
                                        placeholder="Contoh: Padalarang"
                                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Body Content / Narasi Surat */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Narasi / Isi Pokok Surat Pengantar <span className="text-rose-500">*</span>
                </label>
                <textarea
                    required
                    rows={4}
                    value={bodyContent}
                    onChange={(e) => onBodyChange(e.target.value)}
                    placeholder="Tuliskan isi ringkas atau keterangan pokok surat..."
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
