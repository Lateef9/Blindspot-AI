"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, File, AlertCircle } from 'lucide-react';

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
    <div className="w-full max-w-md mx-auto mt-10">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}
          ${isDragReject ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <UploadCloud className="w-10 h-10 text-gray-400" />
          {isDragActive ? (
            <p className="text-blue-500 font-medium">Drop the PDF here...</p>
          ) : (
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Drag and drop your PDF here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                or click to browse (Max 20MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Uploading...
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {fileId && fileName && (
        <div className="mt-4 p-4 border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 rounded-md">
          <h3 className="font-medium text-green-800 dark:text-green-300 flex items-center gap-2 mb-2">
            <File className="w-4 h-4" />
            Upload Successful
          </h3>
          <p className="text-sm text-green-700 dark:text-green-400 break-all">
            <strong>File ID:</strong> {fileId}
          </p>
          <p className="text-sm text-green-700 dark:text-green-400 break-all">
            <strong>File Name:</strong> {fileName}
          </p>
        </div>
      )}
    </div>
  );
}
