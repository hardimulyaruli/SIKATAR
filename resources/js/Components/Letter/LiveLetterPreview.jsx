import React, { useRef } from 'react';
import HeaderKopSurat, { LogoPemkabKBB, LogoSekolahDefault, QRCodeTTE } from './HeaderKopSurat';
import Icon from '@/Components/UI/Icon';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { terbilang } from '@/Utils/terbilang';

export default function LiveLetterPreview({
    school,
    letterName = 'Surat Pengantar',
    applicationNumber = 'APP-20260804-001',
    subject = '',
    recipient = '',
    bodyContent = '',
    formData = {},
    classificationCode = '800.1.3.2',
    officialNumber = null,
    status = 'draft',
    isDisdik = false,
}) {
    const letterRef = useRef(null);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (!letterRef.current) return;
        try {
            const pageElements = letterRef.current.querySelectorAll('.a4-page-section, .a4-landscape-page-section');
            const pdf = new jsPDF('p', 'mm', 'a4');

            for (let i = 0; i < pageElements.length; i++) {
                const pageEl = pageElements[i];
                const isLandscape = pageEl.classList.contains('a4-landscape-page-section');
                const canvas = await html2canvas(pageEl, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                });
                const imgData = canvas.toDataURL('image/png');
                if (i > 0) {
                    if (isLandscape) {
                        pdf.addPage('a4', 'l');
                    } else {
                        pdf.addPage('a4', 'p');
                    }
                }
                if (isLandscape) {
                    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
                } else {
                    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
                }
            }
            pdf.save(`${letterName.replace(/\s+/g, '_')}_${applicationNumber}.pdf`);
        } catch (err) {
            console.error('Error generating PDF:', err);
        }
    };

    const todayDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const safeFormData = formData || {};
    const codeNumber = classificationCode || '800.1.3.2';
    const displayLetterNumber = officialNumber || `${codeNumber}/1071 - Sekre/${new Date().getFullYear()}`;

    // Extract Applicants List
    const baseApplicants = Array.isArray(safeFormData.applicants) && safeFormData.applicants.length > 0
        ? safeFormData.applicants
        : [
            {
                nama: safeFormData.nama_pegawai || safeFormData.nama_guru || '',
                nip: safeFormData.nip || '',
                gol_asal: safeFormData.pangkat_golongan || safeFormData.gol_asal || '',
                jabatan: safeFormData.jabatan || '',
                unit_kerja: safeFormData.unit_kerja || school?.name || '',
                kecamatan: safeFormData.kecamatan || '',
            }
        ];

    const parsedJumlahBerkas = parseInt(safeFormData.jumlah_berkas, 10);
    const totalCount = (!isNaN(parsedJumlahBerkas) && parsedJumlahBerkas > 0)
        ? parsedJumlahBerkas
        : (safeFormData.jumlah_orang || baseApplicants.length || 1);

    const terbilangText = terbilang(totalCount);
    const firstApplicant = baseApplicants[0] || {};
    
    // Construct display applicants list matching totalCount if count is higher
    let displayApplicants = [...baseApplicants];
    if (displayApplicants.length < totalCount) {
        for (let i = displayApplicants.length; i < totalCount; i++) {
            displayApplicants.push({
                nama: '',
                nip: '',
                gol_asal: '',
                jabatan: '',
                unit_kerja: school?.name || '',
                kecamatan: '',
            });
        }
    }

    const isMultiApplicant = totalCount >= 2 || displayApplicants.length > 1;

    // Dynamic Signee (Penandatangan Surat)
    const signeeTitle = isDisdik ? 'Plt. Kepala Dinas Pendidikan,' : (safeFormData.signee_title || 'Kepala Sekolah,');
    const signeeOrg = isDisdik ? 'Dinas Pendidikan' : (school?.name || 'SD NEGERI 1 PADALARANG');
    const signeeName = isDisdik ? 'EDY SYAFRUDIN, S.Pd, M.Pd' : (safeFormData.signee_name || school?.headmaster_name || '...........................................');
    const signeePangkat = isDisdik ? 'Penata Tk.I' : (safeFormData.signee_pangkat || '');
    const signeeNip = isDisdik ? '197111091994031004' : (safeFormData.signee_nip || school?.headmaster_nip || '...........................................');

    return (
        <div className="relative flex flex-col items-center w-full">
            {/* Action Bar Floating Top Right */}
            <div className="w-full flex items-center justify-between mb-4 glass-card px-4 py-2.5 rounded-xl text-xs print:hidden">
                <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Preview Surat Pengantar & Lampiran A4</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline/20 text-on-surface hover:bg-surface-container-low transition-colors shadow-xs"
                    >
                        <Icon name="print" className="text-sm text-on-surface-variant" />
                        <span>Cetak</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-medium hover:bg-on-surface transition-colors shadow-xs"
                    >
                        <Icon name="download" className="text-sm text-on-primary" />
                        <span>Unduh PDF A4</span>
                    </button>
                </div>
            </div>

            {/* Document Container */}
            <div 
                id="printable-letter"
                ref={letterRef}
                className="w-full space-y-8 flex flex-col items-center"
            >
                {/* PAGE 1: SURAT PENGANTAR (Exact Image 1 Format) */}
                <div className="a4-page-section paper-texture shadow-xl relative text-black leading-normal">
                    {/* Official Kop Surat */}
                    <HeaderKopSurat school={school} isDisdik={isDisdik} />

                    {/* Top Right Date */}
                    <div className="text-right font-sans text-xs font-normal text-black mb-3">
                        Bandung Barat, {todayDate}
                    </div>

                    {/* Recipient Section (Top Left) */}
                    <div className="mb-4 font-sans text-xs text-black">
                        <table className="border-collapse text-xs text-black font-sans">
                            <tbody>
                                <tr>
                                    <td className="w-14 font-normal align-top">Kepada</td>
                                    <td className="w-4 text-center font-normal align-top">:</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className="font-bold align-top">Yth.</td>
                                    <td colSpan={2} className="font-bold align-top leading-snug">
                                        {recipient || 'Kepala Dinas Pendidikan Kabupaten Bandung Barat'}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td className="font-normal align-top">di</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td colSpan={2} className="font-bold underline align-top">
                                        Bandung Barat.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Centered Document Title & Official Letter Number */}
                    <div className="text-center my-4 font-sans">
                        <h2 className="text-sm md:text-base font-bold uppercase tracking-[0.25em] underline underline-offset-2 text-black">
                            S U R A T &nbsp; P E N G A N T A R
                        </h2>
                        <p className="text-xs font-semibold text-black mt-0.5">
                            Nomor : <span className="font-sans">{displayLetterNumber}</span>
                        </p>
                    </div>

                    {/* Official Table of Items Sent (Tabel Surat Pengantar) */}
                    <div className="my-4">
                        <table className="w-full border-collapse border border-black text-xs font-sans text-black">
                            <thead>
                                <tr className="bg-white text-center font-bold border-b border-black">
                                    <th className="border border-black p-1.5 w-[6%] text-center">No</th>
                                    <th className="border border-black p-1.5 w-[50%] text-center">Naskah Dinas/Barang yang dikirim</th>
                                    <th className="border border-black p-1.5 w-[16%] text-center">Banyaknya</th>
                                    <th className="border border-black p-1.5 w-[28%] text-center">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="align-top">
                                    <td className="border border-black p-1.5 text-center font-normal">1.</td>
                                    <td className="border border-black p-1.5 space-y-1">
                                        <p className="font-normal text-black leading-tight">
                                            {subject || letterName || 'Surat Pengantar'}
                                        </p>

                                        {/* Applicant Summary */}
                                        <table className="w-full text-xs text-black border-collapse mt-1 leading-tight">
                                            <tbody>
                                                <tr>
                                                    <td className="w-20 font-normal align-top">Nama</td>
                                                    <td className="w-3 text-center align-top">:</td>
                                                    <td className="font-bold align-top">{firstApplicant.nama || '...........................................'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-normal align-top">NIP</td>
                                                    <td className="text-center align-top">:</td>
                                                    <td className="align-top">{firstApplicant.nip || '...........................................'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-normal align-top">Pangkat/Gol.</td>
                                                    <td className="text-center align-top">:</td>
                                                    <td className="align-top">{firstApplicant.gol_asal || firstApplicant.pangkat || '...........................................'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-normal align-top">Jabatan</td>
                                                    <td className="text-center align-top">:</td>
                                                    <td className="align-top">{firstApplicant.jabatan || '...........................................'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-normal align-top">Unit Kerja</td>
                                                    <td className="text-center align-top">:</td>
                                                    <td className="align-top">
                                                        {firstApplicant.unit_kerja || school?.name || '...........................................'}<br />
                                                        {school?.name ? 'Dinas Pendidikan' : ''}
                                                        {isMultiApplicant && (
                                                            <span className="font-bold uppercase">CS {totalCount} Orang</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td className="border border-black p-1.5 text-center font-normal leading-tight align-top">
                                        <div className="font-bold text-xs">{totalCount}</div>
                                        <div className="text-[11px]">({terbilangText})</div>
                                        <div className="text-[11px]">Berkas</div>
                                    </td>
                                    <td className="border border-black p-1.5 text-left leading-normal font-normal align-top text-xs">
                                        Disampaikan dengan hormat, untuk mendapat penyelesaian lebih lanjut.<br /><br />
                                        Terima kasih.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom Section: Receipts & Signatures (Matching User Reference Image) */}
                    <div className="mt-6 flex justify-between items-start font-sans text-xs text-black">
                        {/* Left Section: Standard Reception Block (Dynamically filled when received/approved) */}
                        <div className="w-56 space-y-0.5">
                            {safeFormData.received_date || safeFormData.received_by_name || status === 'approved' || status === 'verified' || status === 'completed' ? (
                                <>
                                    <p className="font-normal text-black">Diterima Tanggal: <span className="font-semibold">{safeFormData.received_date || todayDate}</span></p>
                                    <p className="font-normal text-black mt-1">Penerima,</p>
                                    <p className="font-normal text-black text-[11px] leading-tight">{safeFormData.received_by_title || 'Pengolah Data Kepegawaian Disdik KBB'}</p>
                                    <div className="pt-6">
                                        <p className="font-bold underline uppercase text-black text-xs">{safeFormData.received_by_name || 'H. DEDI SUPRIADI, S.Pd., M.M.'}</p>
                                        <p className="font-normal text-black text-[11px] mt-0.5">NIP. {safeFormData.received_by_nip || '19780512 200604 1 005'}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="font-normal text-black">Diterima Tanggal ..................</p>
                                    <p className="font-normal text-black mt-2">Penerima</p>
                                    <p className="font-normal text-black">Nama Jabatan,</p>
                                    <div className="pt-8">
                                        <p className="border-b border-black w-48"></p>
                                        <p className="font-normal text-black">NIP.</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right Section: TTE Barcode Electronic Signature (Logo Pemkab + QR Code Barcode TTE) */}
                        <div className="text-center w-64 flex flex-col items-center">
                            <p className="font-bold text-xs mb-3 leading-none text-black">{signeeTitle}</p>

                            {/* Electronic Stamp Box with Pemkab Logo & Barcode QR Code TTE Seal */}
                            <div className="w-full my-2 p-2 border border-black rounded-sm text-left font-sans text-[9px] flex items-center gap-2 bg-white">
                                <LogoPemkabKBB className="w-10 h-12 shrink-0" />
                                <div className="leading-tight text-black flex-1 min-w-0">
                                    <p className="text-[7.5px] text-slate-700 font-normal">Ditandatangani secara elektronik oleh:</p>
                                    <p className="font-bold text-[8.5px] text-black leading-tight">
                                        {isDisdik ? 'a.n. Kepala Dinas Pendidikan' : `Kepala ${signeeOrg}`}
                                    </p>
                                    <p className="font-bold text-[8.5px] text-black leading-tight">Kabupaten Bandung Barat</p>
                                    {isDisdik && <p className="text-[7.5px] text-slate-700 font-medium">Sekretaris,</p>}
                                    <div className="mt-0.5">
                                        <p className="font-bold text-[9px] text-black uppercase leading-tight">{signeeName}</p>
                                        <p className="text-[7.5px] text-slate-700 font-normal">{signeePangkat}</p>
                                    </div>
                                </div>
                                <div className="shrink-0 flex items-center justify-center p-0.5">
                                    <QRCodeTTE className="w-8 h-8" />
                                </div>
                            </div>

                            <div className="mt-2 text-center leading-tight">
                                <p className="font-bold uppercase border-b border-black pb-0.5 inline-block text-xs text-black">{signeeName}</p>
                                <p className="text-[11px] text-black mt-0.5 font-normal">{signeePangkat}</p>
                                <p className="text-[11px] text-black font-normal">NIP. {signeeNip}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PAGE 2: LAMPIRAN DATA PEMOHON (Landscape Format) */}
                {isMultiApplicant && (
                    <div className="a4-landscape-page-section paper-texture shadow-xl relative text-black leading-normal print:break-before-page">
                        {/* Lampiran Header Title */}
                        <div className="text-center my-3 font-sans">
                            <h3 className="text-xs font-bold uppercase text-black tracking-wider">
                                LAMPIRAN
                            </h3>
                            <h2 className="text-sm font-bold uppercase text-black tracking-wider mt-0.5">
                                DATA USUL {(subject || letterName || 'BERKAS PENGAJUAN').toUpperCase()}
                            </h2>
                        </div>

                        {/* Lampiran Applicants Table (Matching Image 3) */}
                        <div className="my-4 overflow-x-auto">
                            <table className="w-full border-collapse border border-black text-[10px] font-sans text-black">
                                <thead>
                                    <tr className="bg-slate-100 text-center font-bold border-b border-black">
                                        <th className="border border-black p-1.5 w-[5%] text-center">NO</th>
                                        <th className="border border-black p-1.5 w-[25%] text-left">NAMA</th>
                                        <th className="border border-black p-1.5 w-[18%] text-center">NIP</th>
                                        <th className="border border-black p-1.5 w-[12%] text-center">GOL ASAL</th>
                                        <th className="border border-black p-1.5 w-[16%] text-left">JABATAN</th>
                                        <th className="border border-black p-1.5 w-[14%] text-left">UNIT KERJA</th>
                                        <th className="border border-black p-1.5 w-[10%] text-left">KECAMATAN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayApplicants.map((item, idx) => (
                                        <tr key={idx} className="border-b border-black align-top">
                                            <td className="border border-black p-1 text-center font-bold">{idx + 1}</td>
                                            <td className="border border-black p-1 font-bold uppercase">{item.nama || '...........................................'}</td>
                                            <td className="border border-black p-1 text-center font-mono">{item.nip || '...........................................'}</td>
                                            <td className="border border-black p-1 text-center">{item.gol_asal || item.pangkat || '...................'}</td>
                                            <td className="border border-black p-1">{item.jabatan || '...................'}</td>
                                            <td className="border border-black p-1">{item.unit_kerja || school?.name || '...................'}</td>
                                            <td className="border border-black p-1">{item.kecamatan || '...................'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Lampiran Bottom Signature */}
                        <div className="mt-6 flex justify-end font-sans text-xs text-black">
                            <div className="text-center w-64 flex flex-col items-center">
                                <p className="font-bold text-xs mb-3 leading-none text-black">{signeeTitle}</p>

                                <div className="w-full my-2 p-2.5 border border-black rounded-lg text-left font-sans text-[9px] flex items-center gap-2.5 bg-slate-50/90 shadow-xs">
                                    <LogoPemkabKBB className="w-9 h-11 shrink-0" />
                                    <div className="leading-snug text-slate-900 flex-1">
                                        <p className="text-[8px] text-slate-600 font-normal">Ditandatangani secara elektronik oleh:</p>
                                        <p className="font-bold text-[9px] text-black">
                                            {isDisdik ? 'a.n. Kepala Dinas Pendidikan' : `Kepala ${signeeOrg}`}
                                        </p>
                                        <p className="font-bold text-[9px] text-black">Kabupaten Bandung Barat</p>
                                        {isDisdik && <p className="text-[8px] text-slate-700 font-medium">Sekretaris,</p>}
                                        <div className="mt-1">
                                            <p className="font-bold text-[10px] text-black uppercase">{signeeName}</p>
                                            <p className="text-[8px] text-slate-700 font-normal">{signeePangkat}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2.5 text-center leading-tight">
                                    <p className="font-bold uppercase border-b border-black pb-0.5 inline-block text-xs text-black">{signeeName}</p>
                                    <p className="text-[11px] text-black mt-0.5 font-normal">{signeePangkat}</p>
                                    <p className="text-[11px] text-black font-normal">NIP. {signeeNip}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
