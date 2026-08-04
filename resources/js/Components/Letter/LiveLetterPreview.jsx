import React, { useRef } from 'react';
import HeaderKopSurat from './HeaderKopSurat';
import Icon from '@/Components/UI/Icon';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function LiveLetterPreview({
    school,
    letterName = 'Surat Permohonan',
    applicationNumber = 'DRAFT-000',
    subject = '',
    recipient = '',
    bodyContent = '',
    formData = {},
    officialNumber = null,
    status = 'draft',
}) {
    const letterRef = useRef(null);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (!letterRef.current) return;
        try {
            const canvas = await html2canvas(letterRef.current, {
                scale: 2,
                useCORS: true,
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
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

    return (
        <div className="relative flex flex-col items-center w-full">
            {/* Action Bar Floating Top Right */}
            <div className="w-full flex items-center justify-between mb-4 glass-card px-4 py-2.5 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Preview Surat Resmi A4</span>
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
                        <span>Unduh PDF</span>
                    </button>
                </div>
            </div>

            {/* Paper Container - Realistic A4 styling */}
            <div 
                id="printable-letter"
                ref={letterRef}
                className="paper-texture a4-document-paper font-serif-garamond shadow-xl bg-white"
            >
                {/* Official Kop Surat */}
                <HeaderKopSurat school={school} />

                {/* Surat Metadata Header */}
                <div className="flex justify-between items-start mb-6 font-sans-inter text-xs mt-6">
                    <div className="space-y-1 text-on-surface">
                        <p><span className="font-semibold text-on-surface-variant">Nomor:</span> {officialNumber || `421.1/${applicationNumber}/Disdik`}</p>
                        <p><span className="font-semibold text-on-surface-variant">Lampiran:</span> 1 (Satu) Berkas</p>
                        <p><span className="font-semibold text-on-surface-variant">Perihal:</span> <span className="font-bold text-primary">{subject || '[ Perihal Surat ]'}</span></p>
                    </div>
                    <div className="text-right">
                        <p className="font-medium text-on-surface-variant">Padalarang, {todayDate}</p>
                    </div>
                </div>

                {/* Recipient */}
                <div className="mb-8 font-sans-inter text-xs leading-relaxed text-on-surface">
                    <p className="text-on-surface-variant">Kepada Yth,</p>
                    <p className="font-bold text-primary text-sm mt-0.5">{recipient || '[ Penerima / Kepala Dinas Pendidikan KBB ]'}</p>
                    <p className="text-on-surface-variant">di Tempat</p>
                </div>

                {/* Body Content */}
                <div className="mb-12 font-serif-garamond text-base leading-relaxed text-on-surface space-y-4">
                    <p>Dengan hormat,</p>
                    {bodyContent ? (
                        bodyContent.split('\n').map((paragraph, idx) => (
                            <p key={idx} className="text-justify indent-8">
                                {paragraph}
                            </p>
                        ))
                    ) : (
                        <p className="italic text-on-surface-variant font-sans-inter text-xs">
                            Isi surat permohonan akan muncul di sini secara otomatis sesuai input form yang Anda isi...
                        </p>
                    )}

                    {/* Dynamic Form Data Table (if any) */}
                    {Object.keys(safeFormData).length > 0 && (
                        <div className="my-4 p-4 bg-surface-container-low rounded-DEFAULT border border-outline/10 font-sans-inter text-xs">
                            <p className="font-bold text-primary mb-2 uppercase tracking-widest text-[10px]">Rincian Keterangan Tambahan:</p>
                            <table className="w-full text-left border-collapse">
                                <tbody>
                                    {Object.entries(safeFormData).map(([key, val]) => (
                                        <tr key={key} className="border-b border-outline/10 last:border-0">
                                            <td className="py-1.5 font-semibold text-on-surface-variant capitalize w-1/3">{key.replace(/_/g, ' ')}</td>
                                            <td className="py-1.5 text-primary">{val || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <p className="text-justify">
                        Demikian surat ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu Kepala Dinas Pendidikan Kabupaten Bandung Barat, kami ucapkan terima kasih.
                    </p>
                </div>

                {/* Signature Area */}
                <div className="mt-16 flex justify-end font-sans-inter text-xs text-on-surface">
                    <div className="text-center w-64 space-y-16">
                        <div>
                            <p className="text-on-surface-variant">Kepala Sekolah,</p>
                            <p className="font-bold text-primary mt-0.5">{school?.name || 'SDN 1 Padalarang'}</p>
                        </div>
                        <div className="border-b border-primary pb-1">
                            <p className="font-bold text-primary text-sm">{school?.headmaster_name || 'Drs. H. Ahmad Fauzi, M.Pd.'}</p>
                            <p className="text-[11px] text-on-surface-variant">NIP. {school?.headmaster_nip || '19680512 199303 1 004'}</p>
                        </div>
                    </div>
                </div>

                {/* Official Approval Seal (If Approved) */}
                {status === 'approved' && (
                    <div className="absolute bottom-16 left-12 flex items-center gap-3 p-3 bg-secondary-container/50 border border-outline/20 rounded-DEFAULT text-primary font-sans-inter text-xs">
                        <Icon name="verified" className="text-3xl text-primary shrink-0" fill={true} />
                        <div>
                            <p className="font-bold uppercase tracking-widest text-[10px]">VERIFIKASI RESMI DISDIK KBB</p>
                            <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">No: {officialNumber}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
