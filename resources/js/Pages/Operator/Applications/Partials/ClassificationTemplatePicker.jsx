import React from 'react';
import { CLASSIFICATION_CODES } from '@/Utils/classificationCodes';

/**
 * ClassificationTemplatePicker allows operators to pick standard letter templates,
 * classification codes (Permendagri 2024), and official letter creation date.
 * Single Responsibility: Presenting template and classification selection controls.
 */
export default function ClassificationTemplatePicker({
    selectedTemplate,
    allAvailableTemplates = [],
    onSelectTemplate,
    classificationCode,
    onClassificationChange,
    letterDate,
    onLetterDateChange,
    todayIsoDate,
}) {
    return (
        <div className="space-y-4">
            {/* Template Selector */}
            <div className="p-4 bg-surface-container-low rounded-DEFAULT border border-outline/20 space-y-2">
                <label className="block font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                    Jenis / Template Surat Pengajuan
                </label>
                <select
                    value={selectedTemplate?.code || ''}
                    onChange={(e) => {
                        const tpl = allAvailableTemplates.find((t) => t.code === e.target.value);
                        onSelectTemplate(tpl);
                    }}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-md text-xs font-semibold text-primary"
                >
                    {allAvailableTemplates.map((tpl) => (
                        <option key={tpl.code} value={tpl.code}>
                            [{tpl.classification_code}] — {tpl.name} ({tpl.category})
                        </option>
                    ))}
                </select>
            </div>

            {/* Kode Klasifikasi Selector */}
            <div className="p-4 bg-secondary-container/30 rounded-DEFAULT border border-outline/20 space-y-2">
                <label className="block font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                    Kode Klasifikasi Surat (Penomoran Resmi 2024)
                </label>
                <select
                    value={classificationCode}
                    onChange={(e) => onClassificationChange(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-md text-xs font-mono font-bold text-primary"
                >
                    {CLASSIFICATION_CODES.map((item) => (
                        <option key={`${item.code}-${item.name}`} value={item.code}>
                            {item.code} — {item.name} ({item.category})
                        </option>
                    ))}
                </select>
            </div>

            {/* Tanggal Surat Pengantar */}
            <div className="p-4 bg-surface-container-low rounded-DEFAULT border border-outline/20 space-y-2">
                <div className="flex items-center justify-between">
                    <label className="block font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">
                        Tanggal Surat Pengantar
                    </label>
                    <span className="text-[10px] font-mono text-primary font-semibold bg-surface-container-lowest px-2 py-0.5 rounded border border-outline/10">
                        Tahun: {(letterDate || todayIsoDate).split('-')[0]}
                    </span>
                </div>
                <input
                    type="date"
                    required
                    value={letterDate || todayIsoDate}
                    onChange={(e) => onLetterDateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline/20 rounded-md text-xs text-primary"
                />
            </div>
        </div>
    );
}
