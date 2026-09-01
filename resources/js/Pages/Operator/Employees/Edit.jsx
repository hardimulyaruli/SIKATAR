import React from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import { useForm, Link } from '@inertiajs/react';
import { FiSave, FiX, FiUser } from 'react-icons/fi';

export default function EmployeeEdit({ employee }) {
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

    const submit = (e) => {
        e.preventDefault();
        post(`/operator/employees/${employee.id}`);
    };

    return (
        <OperatorLayout>
            <PageHeader
                title="Edit Pegawai"
                subtitle="Perbarui data profil dan pasfoto kepegawaian."
            />

            <div className="max-w-3xl">
                <GlassCard>
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
                                            <img src={`/storage/${employee.photo_path}`} alt="Foto Saat Ini" className="w-full h-full object-cover" />
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

                            {/* NIP */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">NIP</label>
                                <input
                                    type="text"
                                    className={`w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.nip ? 'border-red-500' : ''}`}
                                    value={data.nip}
                                    onChange={e => setData('nip', e.target.value)}
                                    placeholder="Opsional untuk Non-ASN"
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
            </div>
        </OperatorLayout>
    );
}
