import React, { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/UI/PageHeader';
import GlassCard from '@/Components/UI/GlassCard';
import Pagination from '@/Components/UI/Pagination';
import TableWrapper from '@/Components/UI/TableWrapper';
import { useAsyncTable } from '@/Hooks/useAsyncTable';
import { Link, router, usePage, useForm } from '@inertiajs/react';
import { 
    FiSearch, 
    FiRotateCcw, 
    FiEdit2, 
    FiTrash2, 
    FiChevronUp, 
    FiChevronDown,
    FiList,
    FiUploadCloud,
    FiDownload
} from 'react-icons/fi';
import { RiFileExcel2Line } from 'react-icons/ri';

export default function DukIndex({ employees: initialEmployees, filters: initialFilters = {} }) {
    const { auth, flash = {} } = usePage().props;
    const isStaffKepala = ['staff_kepala', 'admin'].includes(auth?.user?.role);
    const [isReordering, setIsReordering] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Initial Tab from URL or default to 'duk'
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const [activeTab, setActiveTab] = useState(queryParams?.get('tab') || 'duk');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location);
            url.searchParams.set('tab', tab);
            window.history.replaceState({}, '', url);
        }
    };

    const {
        data: employees,
        filters,
        handleSearch,
        handlePageClick,
        isLoading,
    } = useAsyncTable({
        url: '/admin/duk',
        initialData: initialEmployees,
        dataKey: 'employees',
        initialFilters: {
            search: initialFilters.search || '',
        },
        debounceMs: 350,
    });

    // Form handling for Excel import
    const { 
        data: importData, 
        setData: setImportData, 
        post: postImport, 
        processing: isImporting, 
        errors: importErrors, 
        reset: resetImport 
    } = useForm({
        file: null,
    });

    const handleFileDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setImportData('file', e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImportData('file', e.target.files[0]);
        }
    };

    const submitImport = (e) => {
        e.preventDefault();
        if (!importData.file) return;

        postImport('/admin/duk/import', {
            preserveScroll: true,
            onSuccess: () => {
                resetImport();
                handleTabChange('duk');
            },
        });
    };

    const handleReorder = (employeeId, direction) => {
        if (isReordering) return;
        setIsReordering(true);
        router.post(
            '/admin/duk/reorder',
            { employee_id: employeeId, direction },
            {
                preserveScroll: true,
                onFinish: () => setIsReordering(false),
            }
        );
    };

    const handleResetBkn = () => {
        if (isResetting) return;
        if (confirm('Apakah Anda yakin ingin mengatur ulang seluruh urutan DUK PNS sesuai dengan ketentuan baku BKN (Golongan, TMT, Pendidikan, Usia)?')) {
            setIsResetting(true);
            router.post(
                '/admin/duk/reset',
                {},
                {
                    preserveScroll: true,
                    onFinish: () => setIsResetting(false),
                }
            );
        }
    };

    const handleExportExcel = () => {
        const searchParam = filters.search ? `?search=${encodeURIComponent(filters.search)}` : '';
        window.location.href = `/admin/duk/export${searchParam}`;
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data pegawai PNS ini dari sistem?')) {
            router.delete(`/admin/employees/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const items = employees?.data || [];

    return (
        <AdminLayout>
            <PageHeader
                title="Daftar Urut Kepangkatan (DUK) PNS"
                subtitle="Hierarki resmi kepangkatan Pegawai Negeri Sipil di lingkungan Dinas Pendidikan Kabupaten Bandung Barat."
            />

            {/* Navigation Tabs (Hanya Data DUK PNS & Import Data) */}
            <div className="mb-6 flex items-center gap-1.5 p-1 bg-zinc-100/90 rounded-2xl w-fit border border-zinc-200/80 backdrop-blur-xl">
                <button
                    type="button"
                    onClick={() => handleTabChange('duk')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'duk'
                            ? 'bg-white text-zinc-950 shadow-2xs border border-zinc-200/90 font-bold'
                            : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/60'
                    }`}
                >
                    <FiList className="w-3.5 h-3.5" />
                    <span>Data DUK PNS</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleTabChange('import')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'import'
                            ? 'bg-white text-zinc-950 shadow-2xs border border-zinc-200/90 font-bold'
                            : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/60'
                    }`}
                >
                    <RiFileExcel2Line className={`w-3.5 h-3.5 ${activeTab === 'import' ? 'text-zinc-800' : 'text-zinc-500'}`} />
                    <span>Import Data</span>
                </button>
            </div>

            {/* TAB 1: DATA DUK PNS */}
            {activeTab === 'duk' && (
                <>
                    {/* Top Bar Actions & Search Matching Reference Screenshot */}
                    <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        {/* Search Input Box */}
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                <FiSearch className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Cari NIP, Nama, Golongan..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-zinc-200/90 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all shadow-2xs backdrop-blur-xl"
                            />
                        </div>

                        {/* Right Action Buttons */}
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                            {/* Reset Urutan BKN Button */}
                            <button
                                type="button"
                                onClick={handleResetBkn}
                                disabled={isResetting}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 hover:bg-white text-zinc-900 hover:text-black text-xs font-semibold rounded-xl border border-zinc-200/90 shadow-2xs backdrop-blur-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                                title="Atur ulang urutan DUK otomatis berdasarkan aturan baku BKN"
                            >
                                <FiRotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                                <span>{isResetting ? 'Mereset...' : 'Reset Urutan BKN'}</span>
                            </button>

                            {/* Unduh DUK (Excel) Button */}
                            <button
                                type="button"
                                onClick={handleExportExcel}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900/90 hover:bg-black text-white text-xs font-bold rounded-xl border border-zinc-800 shadow-sm backdrop-blur-xl transition-all active:scale-95 cursor-pointer"
                                title="Unduh berkas DUK PNS format Microsoft Excel (.xlsx)"
                            >
                                <RiFileExcel2Line className="w-4 h-4 text-white" />
                                <span>Unduh DUK (Excel)</span>
                            </button>
                        </div>
                    </div>

                    {/* DUK PNS Data Table */}
                    <GlassCard className="overflow-hidden p-0">
                        <TableWrapper isLoading={isLoading} loadingText="Memuat data DUK PNS...">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[900px]">
                                    <thead>
                                        <tr className="bg-zinc-50/90 text-[11px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200/80">
                                            <th className="py-4 px-4 text-center w-14">NO.</th>
                                            <th className="py-4 px-4 w-72">NIP & NAMA PEGAWAI</th>
                                            <th className="py-4 px-4 w-48">GOLONGAN / TMT</th>
                                            <th className="py-4 px-4 w-64">JABATAN & TMT</th>
                                            <th className="py-4 px-4 w-36">MASA KERJA / USIA</th>
                                            <th className="py-4 px-4 w-40">PENDIDIKAN / DIKLAT</th>
                                            <th className="py-4 px-4 text-center w-24">AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 text-xs">
                                        {items.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="py-12 text-center text-zinc-500 text-xs">
                                                    Data Pegawai Negeri Sipil (PNS) tidak ditemukan.
                                                </td>
                                            </tr>
                                        ) : (
                                            items.map((emp, index) => {
                                                const isFirst = index === 0 && (!employees.prev_page_url);
                                                const isLast = index === items.length - 1 && (!employees.next_page_url);

                                                return (
                                                    <tr 
                                                        key={emp.id} 
                                                        className="hover:bg-zinc-50/60 transition-colors border-b border-zinc-100/90"
                                                    >
                                                        {/* NO. */}
                                                        <td className="py-4 px-4 text-center font-medium text-zinc-600 align-middle">
                                                            {emp.duk_order || (employees.from + index)}
                                                        </td>

                                                        {/* NIP & NAMA PEGAWAI */}
                                                        <td className="py-4 px-4 align-middle">
                                                            <div className="font-bold text-zinc-950 text-[13px] leading-tight hover:text-zinc-600 transition-colors">
                                                                <Link href={`/admin/employees/${emp.id}`}>
                                                                    {emp.name}
                                                                </Link>
                                                            </div>
                                                            <div className="text-[11px] text-zinc-400 font-mono mt-1">
                                                                {emp.nip}
                                                            </div>
                                                            {emp.school_name && (
                                                                <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                                                                    {emp.school_name}
                                                                </div>
                                                            )}
                                                        </td>

                                                        {/* GOLONGAN / TMT */}
                                                        <td className="py-4 px-4 align-middle">
                                                            <div className="inline-block px-3 py-1 rounded-md text-[11px] font-semibold bg-zinc-100/90 text-zinc-800 border border-zinc-200/80 shadow-2xs">
                                                                {emp.golongan_badge}
                                                            </div>
                                                            <div className="text-[11px] text-zinc-500 mt-1.5 font-medium">
                                                                {emp.tmt_golongan}
                                                            </div>
                                                        </td>

                                                        {/* JABATAN & TMT */}
                                                        <td className="py-4 px-4 align-middle">
                                                            <div className="text-zinc-800 font-medium text-xs leading-snug uppercase">
                                                                {emp.jabatan}
                                                            </div>
                                                            <div className="text-[11px] text-zinc-500 mt-1 font-medium">
                                                                {emp.tmt_jabatan}
                                                            </div>
                                                        </td>

                                                        {/* MASA KERJA / USIA */}
                                                        <td className="py-4 px-4 align-middle">
                                                            <div className="text-zinc-800 font-medium text-xs">
                                                                {emp.masa_kerja}
                                                            </div>
                                                            <div className="text-[11px] text-zinc-500 mt-1 font-medium">
                                                                {emp.usia}
                                                            </div>
                                                        </td>

                                                        {/* PENDIDIKAN / DIKLAT */}
                                                        <td className="py-4 px-4 align-middle">
                                                            <div className="text-zinc-800 font-medium text-xs">
                                                                {emp.pendidikan}
                                                            </div>
                                                            <div className="text-[11px] text-zinc-400 mt-1 font-medium">
                                                                {emp.diklat}
                                                            </div>
                                                        </td>

                                                        {/* AKSI */}
                                                        <td className="py-4 px-4 text-center align-middle">
                                                            <div className="flex flex-col items-center justify-center gap-1.5">
                                                                {/* Top row: Edit & Delete */}
                                                                <div className="flex items-center gap-1.5">
                                                                    <Link
                                                                        href={`/admin/employees/${emp.id}/edit`}
                                                                        className="p-1.5 text-zinc-900 hover:text-white bg-white/70 hover:bg-zinc-900 backdrop-blur-xl border border-zinc-200/90 hover:border-zinc-900 rounded-lg shadow-2xs transition-all active:scale-95 cursor-pointer"
                                                                        title="Ubah Data Pegawai"
                                                                    >
                                                                        <FiEdit2 className="w-3.5 h-3.5" />
                                                                    </Link>
                                                                    {isStaffKepala && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleDelete(emp.id)}
                                                                            className="p-1.5 text-zinc-900 hover:text-white bg-white/70 hover:bg-zinc-900 backdrop-blur-xl border border-zinc-200/90 hover:border-zinc-900 rounded-lg shadow-2xs transition-all active:scale-95 cursor-pointer"
                                                                            title="Hapus Pegawai"
                                                                        >
                                                                            <FiTrash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                {/* Bottom row: Reorder Up & Down */}
                                                                <div className="flex items-center gap-1.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleReorder(emp.id, 'up')}
                                                                        disabled={isReordering || isFirst}
                                                                        className="p-1 text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg shadow-2xs transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                                        title="Naikkan Urutan DUK"
                                                                    >
                                                                        <FiChevronUp className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleReorder(emp.id, 'down')}
                                                                        disabled={isReordering || isLast}
                                                                        className="p-1 text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg shadow-2xs transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                                        title="Turunkan Urutan DUK"
                                                                    >
                                                                        <FiChevronDown className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </TableWrapper>

                        {/* Pagination */}
                        <div className="p-4 border-t border-zinc-100">
                            <Pagination links={employees.links} onPageClick={handlePageClick} />
                        </div>
                    </GlassCard>
                </>
            )}

            {/* TAB 2: IMPORT / EXPORT (MATCHING USER SCREENSHOT EXACTLY) */}
            {activeTab === 'import' && (
                <div className="space-y-6 max-w-4xl">
                    <GlassCard className="p-6 md:p-8">
                        {/* Header: Import Data (Upsert) */}
                        <div className="flex items-start gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-zinc-100/90 text-zinc-700 border border-zinc-200/80 mt-0.5 shadow-2xs">
                                <FiUploadCloud className="w-5 h-5 text-zinc-800" />
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-950 text-base flex items-center gap-2">
                                    <span>Import Data (Upsert)</span>
                                </h3>
                                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                                    Unggah file Excel. Jika NIP sudah ada, sistem otomatis <span className="font-semibold text-zinc-800">mengupdate</span> data. Jika belum, akan <span className="font-semibold text-zinc-800">ditambahkan</span>.
                                </p>
                            </div>
                        </div>

                        {/* Drag and Drop Zone */}
                        <form onSubmit={submitImport}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />

                            <div
                                onDrop={handleFileDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl py-12 px-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                    dragActive
                                        ? 'border-zinc-500 bg-zinc-50/60 scale-[1.01]'
                                        : importData.file
                                        ? 'border-zinc-400 bg-zinc-50/30'
                                        : 'border-zinc-200/90 bg-zinc-50/20 hover:bg-zinc-50/50 hover:border-zinc-300'
                                }`}
                            >
                                {importData.file ? (
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-3 shadow-2xs">
                                            <RiFileExcel2Line className="w-8 h-8" />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-900 max-w-md truncate">
                                            {importData.file.name}
                                        </span>
                                        <span className="text-[11px] text-zinc-500 mt-1">
                                            {(importData.file.size / 1024).toFixed(1)} KB — Siap diunggah
                                        </span>
                                        <span className="mt-2 text-[11px] text-zinc-600 font-medium underline">
                                            Klik untuk mengganti berkas
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-zinc-100/90 text-zinc-500 flex items-center justify-center mb-3 border border-zinc-200/70 shadow-2xs">
                                            <RiFileExcel2Line className="w-7 h-7" />
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-700">
                                            Pilih file Excel (DD/MM/YYYY)
                                        </span>
                                        <span className="text-[11px] text-zinc-400 mt-1">
                                            Tarik berkas .xlsx ke sini atau klik untuk menelusuri komputer
                                        </span>
                                    </div>
                                )}
                            </div>

                            {importErrors.file && (
                                <p className="text-xs text-zinc-900 mt-2 font-medium">
                                    {importErrors.file}
                                </p>
                            )}

                            {/* Submit Upload Button */}
                            {importData.file && (
                                <div className="mt-4 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetImport();
                                        }}
                                        className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-all cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isImporting}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                                    >
                                        <FiUploadCloud className="w-4 h-4" />
                                        <span>{isImporting ? 'Mengimpor Data...' : 'Mulai Import Data Sekarang'}</span>
                                    </button>
                                </div>
                            )}
                        </form>

                        <hr className="border-zinc-200/80 my-6" />

                        {/* Download Template Action */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <a
                                href="/admin/duk/template"
                                download="Template_Import_PNS.xlsx"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-800 text-xs font-semibold rounded-xl border border-zinc-200/90 shadow-2xs hover:bg-zinc-50 hover:border-zinc-300 transition-all active:scale-95 cursor-pointer w-fit"
                                title="Unduh format template Excel resmi dengan kolom NIP, Nama, Golongan, Jabatan, dll"
                            >
                                <FiDownload className="w-3.5 h-3.5 text-zinc-700" />
                                <span>Unduh Format Template</span>
                            </a>

                            <div className="text-[11px] text-zinc-400">
                                Template resmi: <span className="font-mono text-zinc-600">Template_Import_PNS.xlsx</span>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </AdminLayout>
    );
}
