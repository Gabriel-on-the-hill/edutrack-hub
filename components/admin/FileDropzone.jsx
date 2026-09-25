import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../ui/Icons';

export default function FileDropzone({ onUploadSuccess, label = "Drop file here", accept = "*", icon = null }) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    };

    const uploadFile = async (file) => {
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setSuccess(true);
            onUploadSuccess(data.url);
            setTimeout(() => setSuccess(false), 3000); // Reset success state after 3s
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-2
          ${isDragging
                        ? 'border-teal-500 bg-teal-50/50 scale-[1.02]'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                    }
          ${uploading ? 'opacity-50 cursor-wait' : ''}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={accept}
                    className="hidden"
                />

                <div className="mb-1 flex items-center justify-center text-slate-400">
                    {success ? (
                        <Icons.Check className="w-7 h-7 text-green-600" />
                    ) : uploading ? (
                        <Icons.Spinner className="w-7 h-7 text-teal-500 animate-spin" />
                    ) : (
                        icon || <Icons.Upload className="w-7 h-7 text-slate-400" />
                    )}
                </div>

                <div className="text-center">
                    <p className={`text-sm font-semibold ${success ? 'text-green-600' : 'text-slate-700'}`}>
                        {success ? 'Upload Complete!' : uploading ? 'Uploading...' : label}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        {success ? 'Ready to save class' : 'Drag & drop or click to browse'}
                    </p>
                </div>

                {uploading && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-100 overflow-hidden rounded-b-xl">
                        <motion.div
                            className="h-full bg-teal-500"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </div>
                )}

                {isDragging && (
                    <motion.div
                        layoutId="highlight"
                        className="absolute inset-0 border-2 border-teal-500 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />
                )}
            </div>

            {error && (
                <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                    <Icons.AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
                </p>
            )}
        </div>
    );
}
