import React, { useState, useEffect } from 'react';
import OperatorLayout from '@/Layouts/OperatorLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import HeaderKopSurat from '@/Components/Letter/HeaderKopSurat';
import { useForm, Link } from '@inertiajs/react';
import { FiSave, FiUpload, FiHome, FiUser, FiCheckCircle, FiSliders } from 'react-icons/fi';
import { getImageUrl } from '@/Components/Letter/HeaderKopSurat';
import { sanitizeNip, findEmployeeByNip, lookupEmployeeApi } from '@/Utils/employeeLookup';
import SignatureExtractorModal from '@/Components/Signature/SignatureExtractorModal';
import { autoExtractSignature } from '@/Utils/signatureProcessor';
import { generateSchoolStampDataUrl } from '@/Utils/stampGenerator';

export default function ProfileEdit({ school }) {
    const defaultSampleStamp = generateSchoolStampDataUrl(school?.name || 'SD NEGERI 1 PADALARANG');

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: school?.name || '',
        npsn: school?.npsn || '',
        jenjang: school?.jenjang || 'SD',
        status_akreditasi: school?.status_akreditasi || 'A',
        address: school?.address || '',
        phone: school?.phone || '',
        email: school?.email || '',
        headmaster_name: school?.headmaster_name || '',
        headmaster_nip: school?.headmaster_nip || '',
        logo: null,
        signature: null,
        stamp: null,
    });

    const [previewLogo, setPreviewLogo] = useState(school?.logo_kop_path ? getImageUrl(school.logo_kop_path) : null);
    const [previewSignature, setPreviewSignature] = useState(school?.signature_path ? getImageUrl(school.signature_path) : null);
    const [previewStamp, setPreviewStamp] = useState(school?.stamp_path ? getImageUrl(school.stamp_path) : defaultSampleStamp);
    const [rawSigFile, setRawSigFile] = useState(null);
    const [isSigModalOpen, setIsSigModalOpen] = useState(false);
    const [isExtractingSig, setIsExtractingSig] = useState(false);
    const [isExtractingStamp, setIsExtractingStamp] = useState(false);

    useEffect(() => {
        if (school?.logo_kop_path) {
            setPreviewLogo(getImageUrl(school.logo_kop_path));
        }
    }, [school?.logo_kop_path]);

    useEffect(() => {
        if (school?.signature_path) {
            setPreviewSignature(getImageUrl(school.signature_path));
        }
    }, [school?.signature_path]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    // Alur 100% Otomatis: Langsung bersihkan & transparan saat file dipilih
    const handleSignatureChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setRawSigFile(file);
            setIsExtractingSig(true);
            try {
                const result = await autoExtractSignature(file);
                setData('signature', result.file);
                setPreviewSignature(result.previewUrl);
            } catch (err) {
                console.error('Ekstraksi otomatis gagal, fallback ke studio manual:', err);
                setIsSigModalOpen(true);
            } finally {
                setIsExtractingSig(false);
            }
        }
    };

    const handleSaveCleanSignature = (cleanFile, cleanPreviewUrl) => {
        setData('signature', cleanFile);
        setPreviewSignature(cleanPreviewUrl);
    };

    const handleStampChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsExtractingStamp(true);
            try {
                const result = await autoExtractSignature(file);
                setData('stamp', result.file);
                setPreviewStamp(result.previewUrl);
            } catch (err) {
                console.error('Ekstraksi cap otomatis gagal:', err);
                setData('stamp', file);
                setPreviewStamp(URL.createObjectURL(file));
            } finally {
                setIsExtractingStamp(false);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/operator/profile', {
            forceFormData: true,
        });
    };

    return (
        <OperatorLayout>
            <PageHeader
                title="Profil Sekolah"
                subtitle="Kelola identitas resmi sekolah, nama Kepala Sekolah, NIP, serta logo sekolah."
                action={
                    <Link
                        href="/operator/dashboard"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-semibold hover:bg-inverse-surface transition-colors shadow-xs"
                    >
                        <span>← Kembali ke Dashboard</span>
                    </Link>
                }
            />

            <div className="max-w-4xl space-y-6">
                {/* Form Input */}
                <GlassCard header={<h3 className="font-bold text-slate-900 text-sm">Form Data Profil Sekolah</h3>}>
                    {recentlySuccessful && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Profil Sekolah dan Logo berhasil diperbarui!</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    Nama Resmi Sekolah <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    NPSN <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.npsn}
                                    onChange={(e) => setData('npsn', e.target.value)}
                                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                                {errors.npsn && <p className="text-[11px] text-rose-500 mt-1">{errors.npsn}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    Jenjang Pendidikan
                                </label>
                                <select
                                    value={data.jenjang}
                                    onChange={(e) => setData('jenjang', e.target.value)}
                                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                >
                                    <option value="SD">SD (Sekolah Dasar)</option>
                                    <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                                    <option value="SMA">SMA</option>
                                    <option value="SMK">SMK</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    Status Akreditasi
                                </label>
                                <select
                                    value={data.status_akreditasi}
                                    onChange={(e) => setData('status_akreditasi', e.target.value)}
                                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                >
                                    <option value="A">Akreditasi A</option>
                                    <option value="B">Akreditasi B</option>
                                    <option value="C">Akreditasi C</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                Alamat Lengkap Sekolah
                            </label>
                            <textarea
                                rows={3}
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Jalan, RT/RW, Desa/Kelurahan, Kecamatan, Kab. Bandung Barat..."
                                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    Telepon Sekolah
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    Email Resmi Sekolah
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3">
                                Data Penandatangan (Kepala Sekolah)
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-xs font-semibold text-slate-700">
                                            1. NIP Kepala Sekolah (Maks. 18 Integer)
                                        </label>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            {(data.headmaster_nip || '').length}/18 Digit
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={18}
                                        value={data.headmaster_nip}
                                        onChange={(e) => {
                                            const cleanNip = sanitizeNip(e.target.value);
                                            const emp = findEmployeeByNip(cleanNip);
                                            
                                            const nextData = {
                                                ...data,
                                                headmaster_nip: cleanNip,
                                                ...(emp && emp.nama ? { headmaster_name: emp.nama } : {})
                                            };

                                            setData(nextData);

                                            if (cleanNip.length >= 8) {
                                                lookupEmployeeApi(cleanNip).then((apiEmp) => {
                                                    if (apiEmp && (apiEmp.nama || apiEmp.name)) {
                                                        setData({
                                                            ...nextData,
                                                            headmaster_nip: cleanNip,
                                                            headmaster_name: apiEmp.nama || apiEmp.name,
                                                        });
                                                    }
                                                });
                                            }
                                        }}
                                        placeholder="Masukkan 18 digit NIP Kepsek..."
                                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        2. Nama Lengkap Kepala Sekolah
                                    </label>
                                    <input
                                        type="text"
                                        value={data.headmaster_name}
                                        onChange={(e) => setData('headmaster_name', e.target.value)}
                                        placeholder="Nama & Gelar Kepsek"
                                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Upload Logo Sekolah */}
                        <div className="pt-2 border-t border-slate-100">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                Upload Logo Sekolah:
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                                    {previewLogo ? (
                                        <img src={previewLogo} alt="Logo Sekolah Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <FiHome className="w-6 h-6 text-slate-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Format PNG / JPG (Maks. 2MB). Disarankan berlatar belakang transparan.</p>
                                    {errors.logo && <p className="text-[11px] text-rose-500 mt-1">{errors.logo}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Upload Sampel Tanda Tangan Basah */}
                        <div className="pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Upload Sampel Tanda Tangan Basah Kepala Sekolah:
                                </label>
                                {rawSigFile && (
                                    <button
                                        type="button"
                                        onClick={() => setIsSigModalOpen(true)}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md hover:bg-blue-100 transition-colors"
                                    >
                                        <FiSliders size={12} />
                                        <span>Buka Studio Pembersih TTD</span>
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-28 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                                    style={{
                                        backgroundImage: previewSignature
                                            ? `linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)`
                                            : 'none',
                                        backgroundSize: '12px 12px',
                                        backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
                                    }}
                                >
                                    {isExtractingSig ? (
                                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    ) : previewSignature ? (
                                        <img src={previewSignature} alt="Sampel TTD Basah Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-[10px] text-slate-400 text-center">TTE / Kosong</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleSignatureChange}
                                        className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Pilih foto dari HP/kamera. Latar belakang kertas akan langsung dihapus bersih secara transparan tanpa perlu edit manual.
                                    </p>
                                    {errors.signature && <p className="text-[11px] text-rose-500 mt-1">{errors.signature}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Upload Cap / Stempel Resmi Sekolah */}
                        <div className="pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Cap / Stempel Resmi Sekolah (Opsional):
                                </label>
                                <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded">
                                    {school?.stamp_path ? 'Cap Kustom Tersimpan' : 'Menggunakan Sampel Resmi Otomatis'}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-20 h-20 rounded-xl border border-purple-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 p-1 relative"
                                    style={{
                                        backgroundImage: `linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)`,
                                        backgroundSize: '10px 10px',
                                        backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                                    }}
                                >
                                    {isExtractingStamp ? (
                                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                    ) : previewStamp ? (
                                        <img src={previewStamp} alt="Cap Stempel Sekolah Preview" className="w-full h-full object-contain -rotate-3" />
                                    ) : (
                                        <span className="text-[10px] text-slate-400">Belum Ada Cap</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleStampChange}
                                        className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Jika belum mengunggah stempel fisik, sistem otomatis menggunakan <strong>Sampel Stempel Resmi</strong> sesuai nama sekolah. Foto cap basah akan otomatis dibersihkan latarnya menjadi transparan.
                                    </p>
                                    {errors.stamp && <p className="text-[11px] text-rose-500 mt-1">{errors.stamp}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
                            >
                                <FiSave className="w-4 h-4" />
                                <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
                            </button>
                        </div>
                    </form>
                </GlassCard>

                {/* Pratinjau Live Kop Surat Sekolah */}
                <GlassCard header={<h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><FiHome className="w-4 h-4 text-blue-600" /> Pratinjau Hasil Kop Surat Resmi Sekolah</h3>}>
                    <div className="p-4 bg-slate-100/70 rounded-xl border border-slate-200/80 overflow-x-auto">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-[800px] mx-auto pointer-events-none">
                            <HeaderKopSurat school={{
                                name: data.name || school?.name,
                                address: data.address || school?.address,
                                phone: data.phone || school?.phone,
                                email: data.email || school?.email,
                                logo_kop_path: previewLogo
                            }} />
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Modal Studio Pembersih Tanda Tangan */}
            <SignatureExtractorModal
                isOpen={isSigModalOpen}
                onClose={() => setIsSigModalOpen(false)}
                rawImageFile={rawSigFile}
                onSave={handleSaveCleanSignature}
                headmasterName={data.headmaster_name || school?.headmaster_name}
                headmasterNip={data.headmaster_nip || school?.headmaster_nip}
                schoolTitle="Kepala Sekolah"
            />
        </OperatorLayout>
    );
}
