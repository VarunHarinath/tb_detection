import React, { useState } from 'react';
import { FileImage, Upload, X } from 'lucide-react';

export default function FileUploader({ onImageSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const filesArray = Array.from(fileList).slice(0, 100); // Limit to 100
    const fileDataArray = filesArray.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      source: 'file'
    }));
    
    setSelectedFiles(fileDataArray);
    if (onImageSelect) {
      onImageSelect(fileDataArray);
    }
  };

  const removeFiles = () => {
    setSelectedFiles([]);
    if (onImageSelect) onImageSelect(null);
  };

  if (selectedFiles.length > 0) {
    return (
      <div className="flex flex-col p-4 border rounded-xl bg-white border-slate-200 h-auto w-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2 text-sm text-slate-800 font-medium">
            <FileImage className="w-4 h-4 text-slate-400" />
            <span className="truncate max-w-[200px] text-xs font-mono">
              {selectedFiles.length === 1 ? selectedFiles[0].name : `${selectedFiles.length} Images Selected`}
            </span>
          </div>
          <button 
            onClick={removeFiles}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
            title="Remove Images"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center min-h-[8rem]">
          {selectedFiles.length === 1 ? (
             <img src={selectedFiles[0].previewUrl} alt="Preview" className="w-full h-auto max-h-48 object-contain" />
          ) : (
             <div className="flex space-x-2 p-2 overflow-x-auto w-full">
               {selectedFiles.slice(0, 5).map((f, i) => (
                 <img key={i} src={f.previewUrl} alt="Preview" className="h-24 w-auto object-cover rounded border border-slate-700" />
               ))}
               {selectedFiles.length > 5 && (
                 <div className="flex items-center justify-center h-24 w-24 bg-slate-800 rounded border border-slate-700 text-slate-400 text-xs font-bold">
                   +{selectedFiles.length - 5}
                 </div>
               )}
             </div>
          )}
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
        multiple
        onChange={handleChange} 
      />
      
      <Upload className="w-6 h-6 text-slate-400 mb-3" />
      <h3 className="text-sm font-semibold text-slate-700 mb-1">Acquire Local Images</h3>
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
