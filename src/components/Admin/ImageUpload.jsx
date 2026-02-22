"use client";

import { useState } from "react";
import { Upload, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ImageUpload({ value, onChange, label = "Image" }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return;
        }

        setError(null);
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("admin_token");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to upload");
            }

            onChange(data.url);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onChange("");
        setError(null);
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>

            <div className="relative group">
                {!value ? (
                    <label className={`
                        flex flex-col items-center justify-center w-full h-32 
                        border-2 border-dashed rounded-xl cursor-pointer
                        transition-all duration-300
                        ${error ? "border-red-500/50 bg-red-500/5" : "border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/5"}
                    `}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploading ? (
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                            ) : (
                                <Upload className={`w-8 h-8 mb-2 ${error ? "text-red-400" : "text-gray-400"}`} />
                            )}
                            <p className="text-xs text-gray-400">
                                {uploading ? "Uploading..." : error ? error : "Click to upload image"}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-1">PNG, JPG or WebP (max 5MB)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                    </label>
                ) : (
                    <div className="relative h-32 w-full rounded-xl overflow-hidden border border-white/10 bg-white/5 group">
                        <Image src={value} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                onClick={handleClear}
                                className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-all shadow-lg"
                                title="Remove image"
                                type="button"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <label className="p-2 bg-blue-500/80 hover:bg-blue-500 rounded-lg text-white transition-all shadow-lg cursor-pointer">
                                <Upload className="w-4 h-4" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                            </label>
                        </div>
                        {uploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {value && !uploading && !error && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Uploaded to Cloudinary
                </div>
            )}

            {error && (
                <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </div>
            )}
        </div>
    );
}
