import React, { useState } from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import { useForm, Link, router } from '@inertiajs/react';
import { FiSave, FiX, FiUser, FiUpload, FiFileText, FiCheckCircle, FiShield } from 'react-icons/fi';
import { getImageUrl } from '@/Utils/url';
import { sanitizeNip } from '@/Utils/employeeLookup';

export default function EmployeeEdit({ employee, editAuthorization = null }) {
    const [isAuthorized, setIsAuthorized] = useState(!!editAuthorization);

    // Form for uploading Surat Perintah
    const authForm = useForm({
        surat_perintah: null,
        notes: '',
    });

    // Form for editing employee data
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        nip: employee.nip || '',
        name: employee.name || '',
        place_of_birth: employee.place_of_birth || '',
        date_of_birth: employee.date_of_birth || '',
        address: employee.address || '',
        contact: employee.contact || '',
        status_pegawai: employee.status_pegawai || 'PNS',
        cpns_date: employee.cpns_date || '',
        pns_date: employee.pns_date || '',
        photo: null,
    });

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        authForm.post(`/operator/employees/${employee.id}/edit-authorization`, {
            forceFormData: true,
            onSuccess: () => {
                setIsAuthorized(true);
            },
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/operator/employees/${employee.id}`, {
            forceFormData: true,
        });
    };

    return (
        <OperatorLayout>
            <PageHeader
                title="Edit Pegawai"
                subtitle="Perbarui data profil dan pasfoto kepegawaian."
            />

            <div className="max-w-3xl">
                {/* GATE: Surat Perintah Upload Required */}
                {!isAuthorized ? (
                    <GlassCard>
                        <div className="text-center pb-6 border-b border-slate-100">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 mb-4">
                                <FiShield className="w-8 h-8 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Otorisasi Diperlukan</h3>
                            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                                Untuk mengedit data pegawai <span className="font-bold text-blue-700">{employee.name}</span>,
                                Anda harus mengunggah <span className="font-bold text-amber-700">Surat Perintah dari Kepala Sekolah</span> terlebih dahulu sebagai bukti otorisasi.
                            </p>
                        </div>

                        {/* Employee Info Summary */}
                        <div className="my-6 p-4 bg-blue-50/80 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-14 bg-white rounded-lg border border-blue-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                                    {employee.photo_path ? (
                                        <img src={getImageUrl(employee.photo_path)} alt="Foto" className="w-full h-full object-cover" />
                                    ) : (
                                        <FiUser className="w-6 h-6 text-blue-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-blue-900 text-sm">{employee.name}</p>
                                    <p className="text-xs text-blue-700 font-mono">{employee.nip || 'NIP belum diisi'}</p>
                                    <p className="text-[11px] text-blue-600 mt-0.5">{employee.status_pegawai || 'PNS'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Upload Surat Perintah Form */}
                        <form onSubmit={handleAuthSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-800">
                                    <FiFileText className="inline w-4 h-4 mr-1 -mt-0.5 text-amber-600" />
                                    Upload Surat Perintah Kepala Sekolah <span className="text-rose-500">*</span>
                                </label>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Unggah scan/foto Surat Perintah yang telah ditandatangani oleh Kepala Sekolah.
                                    Format yang diperbolehkan: <span className="font-semibold">PDF, JPG, JPEG, PNG</span> (Maks. 5MB).
                                </p>
                                <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                                    authForm.data.surat_perintah
                                        ? 'border-emerald-300 bg-emerald-50/50'
                                        : 'border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30'
                                }`}>
                                    {authForm.data.surat_perintah ? (
                                        <div className="flex items-center justify-center gap-2 text-emerald-700">
                                            <FiCheckCircle className="w-5 h-5" />
                                            <span className="font-semibold text-sm">{authForm.data.surat_perintah.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => authForm.setData('surat_perintah', null)}
                                                className="ml-2 text-rose-500 hover:text-rose-700 text-xs font-semibold"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <FiUpload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                            <p className="text-sm font-semibold text-slate-600">Klik atau seret file ke sini</p>
                                            <p className="text-xs text-slate-400 mt-1">PDF, JPG, JPEG, PNG (Maks. 5MB)</p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => authForm.setData('surat_perintah', e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                                {authForm.errors.surat_perintah && (
                                    <p className="text-red-500 text-xs mt-1">{authForm.errors.surat_perintah}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Keterangan / Catatan (Opsional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={authForm.data.notes}
                                    onChange={(e) => authForm.setData('notes', e.target.value)}
                                    placeholder="Contoh: Surat Perintah No. 001/SP/SD-01/IX/2026 tanggal 17 September 2026..."
                                    className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-slate-400"
                                />
                                {authForm.errors.notes && (
                                    <p className="text-red-500 text-xs mt-1">{authForm.errors.notes}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={authForm.processing || !authForm.data.surat_perintah}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    <FiUpload className="w-4 h-4" />
                                    <span>{authForm.processing ? 'Mengunggah...' : 'Unggah Surat Perintah'}</span>
                                </button>
                                <Link
                                    href="/operator/employees"
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    <FiX className="w-4 h-4" />
                                    <span>Batal</span>
                                </Link>
                            </div>
                        </form>
                    </GlassCard>
                ) : (
                    /* AUTHORIZED: Edit Employee Form */
                    <GlassCard>
                        {/* Authorization Indicator */}
                        {editAuthorization && (
                            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                                <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-emerald-800">Surat Perintah Terverifikasi</p>
                                    <p className="text-xs text-emerald-700 mt-0.5">
                                        Dokumen: <span className="font-semibold">{editAuthorization.document_name}</span>
                                        <span className="text-emerald-600 ml-2">
                                            (Diunggah: {new Date(editAuthorization.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })})
                                        </span>
                                    </p>
                                    {editAuthorization.notes && (
                                        <p className="text-xs text-emerald-600 italic mt-1">Catatan: {editAuthorization.notes}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Pasfoto Pegawai */}
                                <div className="space-y-2 md:col-span-2 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                                    <label className="block text-sm font-semibold text-slate-700">Pasfoto Resmi Pegawai (3x4)</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-20 bg-slate-200 rounded-xl border-2 border-white ring-1 ring-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                            {data.photo ? (
                                                <img src={URL.createObjectURL(data.photo)} alt="Preview" className="w-full h-full object-cover" />
                                            ) : employee.photo_path ? (
                                                <img src={getImageUrl(employee.photo_path)} alt="Foto Saat Ini" className="w-full h-full object-cover" />
                                            ) : (
                                                <FiUser className="w-8 h-8 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/png, image/jpeg, image/jpg"
                                                onChange={e => setData('photo', e.target.files[0])}
                                                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            <p className="text-[11px] text-slate-400 mt-1">Format JPG/PNG (Maks. 2MB). Disarankan rasio pasfoto 3x4.</p>
                                        </div>
                                    </div>
                                    {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
                                </div>

                                {/* NIP (FIRST) */}
                                <div className="space-y-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-bold text-blue-950">NIP (Maks 18 Digit)</label>
                                        <span className="text-xs font-mono font-semibold text-slate-500">
                                            {(data.nip || '').length}/18 Digit
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={18}
                                        className={`w-full rounded-xl border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm font-mono font-bold ${errors.nip ? 'border-red-500' : ''}`}
                                        value={data.nip}
                                        onChange={e => setData('nip', sanitizeNip(e.target.value))}
                                        placeholder="Masukkan 18 digit NIP..."
                                    />
                                    {errors.nip && <p className="text-red-500 text-xs mt-1">{errors.nip}</p>}
                                </div>

                                {/* Nama */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Nama Lengkap *</label>
                                    <input
                                        type="text"
                                        required
                                        className={`w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.name ? 'border-red-500' : ''}`}
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Contoh: Budi Santoso, S.Pd."
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* Tempat Lahir */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Tempat Lahir</label>
                                    <input
                                        type="text"
                                        className={`w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.place_of_birth ? 'border-red-500' : ''}`}
                                        value={data.place_of_birth}
                                        onChange={e => setData('place_of_birth', e.target.value)}
                                    />
                                    {errors.place_of_birth && <p className="text-red-500 text-xs mt-1">{errors.place_of_birth}</p>}
                                </div>

                                {/* Tanggal Lahir */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Tanggal Lahir</label>
                                    <input
                                        type="date"
                                        className={`w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.date_of_birth ? 'border-red-500' : ''}`}
                                        value={data.date_of_birth}
                                        onChange={e => setData('date_of_birth', e.target.value)}
                                    />
                                    {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
                                </div>

                                {/* Status Pegawai */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700">Status Pegawai *</label>
                                    <select
                                        required
                                        className={`w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.status_pegawai ? 'border-red-500' : ''}`}
                                        value={data.status_pegawai}
                                        onChange={e => setData('status_pegawai', e.target.value)}
                                    >
                                        <option value="PNS">PNS</option>
                                        <option value="CPNS">CPNS</option>
                                        <option value="PPPK">PPPK</option>
                                        <option value="Honorer">Honorer</option>
                                    </select>
                                    {errors.status_pegawai && <p className="text-red-500 text-xs mt-1">{errors.status_pegawai}</p>}
                                </div>

                                {/* TMT CPNS */}
                                {(data.status_pegawai === 'PNS' || data.status_pegawai === 'CPNS') && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">TMT CPNS</label>
                                        <input
                                            type="date"
                                            className={`w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.cpns_date ? 'border-red-500' : ''}`}
                                            value={data.cpns_date}
                                            onChange={e => setData('cpns_date', e.target.value)}
                                        />
                                        {errors.cpns_date && <p className="text-red-500 text-xs mt-1">{errors.cpns_date}</p>}
                                    </div>
                                )}

                                {/* TMT PNS */}
                                {data.status_pegawai === 'PNS' && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">TMT PNS</label>
                                        <input
                                            type="date"
                                            className={`w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.pns_date ? 'border-red-500' : ''}`}
                                            value={data.pns_date}
                                            onChange={e => setData('pns_date', e.target.value)}
                                        />
                                        {errors.pns_date && <p className="text-red-500 text-xs mt-1">{errors.pns_date}</p>}
                                    </div>
                                )}
                                
                                {/* Alamat */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700">Alamat</label>
                                    <textarea
                                        className={`w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.address ? 'border-red-500' : ''}`}
                                        rows={3}
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                    ></textarea>
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                </div>

                                {/* Kontak */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700">Nomor Kontak / HP</label>
                                    <input
                                        type="text"
                                        className={`w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.contact ? 'border-red-500' : ''}`}
                                        value={data.contact}
                                        onChange={e => setData('contact', e.target.value)}
                                    />
                                    {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                                </div>

                            </div>

                            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    <FiSave className="w-4 h-4" />
                                    <span>Simpan Perubahan</span>
                                </button>
                                <Link
                                    href="/operator/employees"
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    <FiX className="w-4 h-4" />
                                    <span>Batal</span>
                                </Link>
                            </div>
                        </form>
                    </GlassCard>
                )}
            </div>
        </OperatorLayout>
    );
}
