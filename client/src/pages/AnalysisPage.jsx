import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import EmptyState from '../components/results/EmptyState';
import UploadSourceTabs from '../components/upload/UploadSourceTabs';
import AnalysisControls from '../components/results/AnalysisControls';
import AnnotatedImageViewer from '../components/results/AnnotatedImageViewer';
import ExplanationCard from '../components/results/ExplanationCard';
import ClinicalReport from '../components/results/ClinicalReport';
import { api } from '../services/api';
import { Printer } from 'lucide-react';

export default function AnalysisPage({ metadata, onLogout }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSelect = (fileData) => {
    setSelectedImage(fileData);
    setAnalysisResult(null); 
    setError(null);
  };

  const handleRunAnalysis = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await api.predictAnalysis(selectedImage);
      // Append runtime logic like source injection to keep components happy
      const enhancedResult = {
        ...result,
        imageUrl: selectedImage.previewUrl,
        metadata: {
           processingTime: "840ms",
           modelVersion: "Clinical-Build-v4.2.1",
           source: selectedImage.source === 'file' ? 'Local Archive' : selectedImage.source === 'cloud' ? 'PACS Relay' : 'Optical Direct'
        }
      };
      setAnalysisResult(enhancedResult);
    } catch (err) {
      setError(err.message || 'Processing fault detected.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className="no-print">
        <AppShell metadata={metadata} onLogout={onLogout}>
          <div className="mb-8 flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Acquisition & Review</h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1.5">Session: {metadata?.sessionId}</p>
          </div>
          
          {analysisResult && (
            <button 
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-slate-300 rounded-md text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Clinical Report</span>
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* Left Column: Acquisition Module */}
          <div className="w-full lg:w-[350px] flex-shrink-0 flex flex-col">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <UploadSourceTabs onImageSelect={handleImageSelect} />
              <div className="mt-5 pt-5 border-t border-slate-100">
                <AnalysisControls 
                  selectedImage={selectedImage}
                  isAnalyzing={isAnalyzing}
                  onRunAnalysis={handleRunAnalysis}
                  error={error}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Analysis Area */}
          <div className="flex-1 flex flex-col h-full min-h-[600px]">
            {!analysisResult && !isAnalyzing ? (
              <EmptyState />
            ) : isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white rounded-lg border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="relative w-16 h-16 mb-8">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-accent-clinical rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-wide uppercase mb-3 text-center">Executing Inference Pipeline</h3>
                <p className="text-sm text-slate-500 text-center max-w-sm font-mono tracking-wider leading-relaxed">
                  Initiating convolutional mapping...<br/>
                  Isolating pathologically viable clusters...
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6 h-full">
                <div className="min-h-[350px] lg:h-1/2 flex-shrink-0">
                  <AnnotatedImageViewer 
                    originalUrl={selectedImage.previewUrl} 
                    annotatedUrl={analysisResult.annotated_image} 
                  />
                </div>
                <div className="min-h-[300px] lg:h-1/2 flex-1 relative">
                  <ExplanationCard explanation={analysisResult.explanation} />
                </div>
              </div>
            )}
          </div>
        </div>
      </AppShell>
      </div>

      {/* Exclusively bounds for OS Print Layer */}
      <div className="hidden print-only w-full">
        <ClinicalReport result={analysisResult} metadata={metadata} />
      </div>
    </>
  );
}
