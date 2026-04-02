import React, { useState } from 'react';
import { FileImage, Upload, X } from 'lucide-react';

export default function FileUploader({ onImageSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const url = URL.createObjectURL(file);
    const fileData = { file, previewUrl: url, name: file.name, source: 'file' };
    setSelectedFile(fileData);
    if (onImageSelect) {
      onImageSelect(fileData);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (onImageSelect) onImageSelect(null);
  };

  if (selectedFile) {
    return (
      <div className="flex flex-col p-4 border rounded-xl bg-white border-slate-200 h-auto w-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2 text-sm text-slate-800 font-medium">
            <FileImage className="w-4 h-4 text-slate-400" />
            <span className="truncate max-w-[200px] text-xs font-mono">{selectedFile.name}</span>
          </div>
          <button 
            onClick={removeFile}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
            title="Remove Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
          <img src={selectedFile.previewUrl} alt="Preview" className="w-full h-auto max-h-48 object-contain" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex flex-col items-center justify-center w-full h-auto min-h-[16rem] py-8 border border-dashed rounded-xl transition-all duration-200
        ${dragActive ? 'border-accent-clinical bg-slate-50 shadow-inner' : 'border-slate-300 hover:bg-slate-50 hover:border-slate-400 bg-white'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        id="file-upload" 
        className="hidden" 
        accept="image/jpeg, image/png, image/tiff, .dcm" 
        onChange={handleChange} 
      />
      
      <Upload className="w-6 h-6 text-slate-400 mb-3" />
      <h3 className="text-sm font-semibold text-slate-700 mb-1">Acquire Local Image</h3>
      <p className="text-[11px] text-slate-500 mb-5">Supported formats: TIFF, DCM, JPEG, PNG</p>
      
      <label 
        htmlFor="file-upload"
        className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
      >
        Browse Files
      </label>
    </div>
  );
}
