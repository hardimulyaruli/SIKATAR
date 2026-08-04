import React from 'react';
import Icon from '@/Components/UI/Icon';

export default function LetterTypeSelector({ templates = [], selectedCode, onSelect }) {
    const getCategoryIconName = (category) => {
        switch (category) {
            case 'Legalitas':
                return 'verified';
            case 'Kesiswaan':
                return 'groups';
            case 'Sarpras':
                return 'inventory_2';
            default:
                return 'description';
        }
    };

    const safeTemplates = Array.isArray(templates) ? templates : [];

    if (safeTemplates.length === 0) return null;

    return (
        <div className="space-y-3 mb-6">
            <label className="block font-label-sm text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                Pilih Jenis / Template Surat Pengajuan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {safeTemplates.map((tpl) => {
                    const iconName = getCategoryIconName(tpl.category);
                    const isSelected = selectedCode === tpl.code;
                    return (
                        <div
                            key={tpl.code}
                            onClick={() => onSelect && onSelect(tpl)}
                            className={`p-4 rounded-DEFAULT border transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                    ? 'bg-secondary-container/40 border-primary shadow-xs ring-1 ring-primary'
                                    : 'bg-surface-container-lowest border-outline/10 hover:border-outline/30 hover:bg-surface-container-low'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <span className={`p-2 rounded-sm text-xs font-semibold ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-primary'}`}>
                                    <Icon name={iconName} className="text-sm" />
                                </span>
                                <span className="font-label-sm text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm bg-surface-container-high text-primary font-bold">
                                    {tpl.category}
                                </span>
                            </div>
                            <div>
                                <h4 className={`font-headline-md text-base font-normal ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                                    {tpl.name}
                                </h4>
                                <p className="font-body-md text-xs text-on-surface-variant line-clamp-2 mt-1">
                                    {tpl.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
