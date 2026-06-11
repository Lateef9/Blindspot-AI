"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';

export function FileUpload() {
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError(null);
    setFileId(null);
    setFileName(null);

    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File size exceeds the 20MB limit');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Only PDF files are allowed');
      } else {
        setError(rejection.errors[0]?.message || 'File rejected');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setFileId(data.fileId);
      setFileName(data.fileName);

      // Now call the analyze endpoint
      const analyzeResponse = await fetch('http://localhost:3001/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId: data.fileId }),
      });

      const analyzeData = await analyzeResponse.json();

      if (!analyzeResponse.ok) {
        throw new Error(analyzeData.error || 'Analysis failed');
      }

      // Save report data to session storage so the report page can access it
      sessionStorage.setItem('blindspotReportData', JSON.stringify(analyzeData));
      
      // Navigate to the report page
      window.location.href = '/report';

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during upload');
      } else {
        setError('An error occurred during upload');
      }
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-950 p-8 sm:p-12 cursor-pointer transition-all
          ${isDragActive ? 'ring-4 ring-slate-900 dark:ring-slate-100 bg-slate-100 dark:bg-slate-900' : 'hover:bg-slate-50 dark:hover:bg-slate-900'}
          ${isDragReject ? 'ring-4 ring-red-600 bg-red-50 dark:bg-red-950/20' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-3">
            <p className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              {isDragActive ? "Drop Document To Upload" : "Select Document"}
            </p>
            <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-400">
              FORMAT: PDF | MAX_SIZE: 20MB
            </p>
          </div>
          <div className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-sm font-mono font-bold uppercase text-white dark:text-slate-900 border-2 border-slate-900 dark:border-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
            Browse Files
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="mt-6 p-6 border-2 border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
          <span className="text-sm font-mono font-bold uppercase text-slate-900 dark:text-slate-100">Processing & Extracting Data</span>
          <span className="text-sm font-mono font-bold animate-pulse text-slate-900 dark:text-slate-100">[||||||||||  ]</span>
        </div>
      )}

      {error && (
        <div className="mt-6 p-6 border-2 border-red-600 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-400 text-sm font-mono font-bold uppercase">
          ERROR: {error}
        </div>
      )}

      {fileId && fileName && (
        <div className="mt-6 p-6 border-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-950">
          <p className="text-sm font-mono font-bold uppercase text-slate-700 dark:text-slate-400 mb-3">Upload Complete</p>
          <p className="text-base font-mono font-bold text-slate-900 dark:text-slate-100 truncate">ID: {fileId}</p>
        </div>
      )}
    </div>
  );
}
