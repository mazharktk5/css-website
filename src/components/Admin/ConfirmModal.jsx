"use client";

import { X, AlertTriangle } from "lucide-react";

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Delete",
    cancelText = "Cancel",
    type = "danger"
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#111827] border border-white/[0.08] rounded-2xl w-full max-w-md shadow-2xl transform animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header Decoration */}
                <div className={`h-2 ${type === 'danger' ? 'bg-red-500' : 'bg-blue-500'}`}></div>

                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-black text-white">{title}</h3>
                            <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                                {message}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-6 py-2.5 rounded-xl text-sm font-black text-white transition-all shadow-lg ${type === 'danger'
                                    ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20'
                                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
