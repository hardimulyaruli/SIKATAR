import React from 'react';
import { FiUser } from 'react-icons/fi';
import { getImageUrl } from '@/Utils/url';

/**
 * EmployeePhotoUpload renders an official 3x4 portrait photo preview and file input.
 * Single Responsibility: Handling employee portrait photo upload and preview rendering.
 */
export default function EmployeePhotoUpload({
    photo,
    currentPhotoPath,
    onPhotoChange,
    error,
}) {
    return (
        <div className="space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700">
                Pasfoto Resmi Pegawai (3x4)
            </label>
            <div className="flex items-center gap-4">
                <div className="w-16 h-20 bg-slate-200 rounded-xl border-2 border-white ring-1 ring-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                    {photo ? (
                        <img
                            src={URL.createObjectURL(photo)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : currentPhotoPath ? (
                        <img
                            src={getImageUrl(currentPhotoPath)}
                            alt="Foto Saat Ini"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FiUser className="w-8 h-8 text-slate-400" />
                    )}
                </div>
                <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onPhotoChange(e.target.files[0] || null)}
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                        Disarankan foto formal berlatar belakang merah/biru. Format JPG/PNG maks. 2MB.
                    </p>
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>
            </div>
        </div>
    );
}
