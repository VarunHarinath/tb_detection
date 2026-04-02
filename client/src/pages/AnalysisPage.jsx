import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import EmptyState from '../components/results/EmptyState';
import UploadSourceTabs from '../components/upload/UploadSourceTabs';
import AnalysisControls from '../components/results/AnalysisControls';
import AnnotatedImageViewer from '../components/results/AnnotatedImageViewer';
import FindingsCard from '../components/results/FindingsCard';
import ExplanationCard from '../components/results/ExplanationCard';
import StatusCards from '../components/results/StatusCards';
import { api } from '../services/api';

export default function AnalysisPage() {
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
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message || 'Processing fault detected.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AppShell>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Acquisition & Review</h2>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Session ID: 4192-ALPHA</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left Column: Acquisition Module */}
        <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col">
          <div className="bg-white rounded border border-slate-200 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            <UploadSourceTabs onImageSelect={handleImageSelect} />
            <div className="mt-4 pt-4 border-t border-slate-100">
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
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white rounded border border-slate-200 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              <div className="relative w-12 h-12 mb-6">
                <div className="absolute inset-0 border-2 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-2 border-accent-clinical rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase mb-2">Executing Inference</h3>
              <p className="text-xs text-slate-500 text-center max-w-sm font-mono tracking-wider">
                Initiating convolutional layers...<br/>
                Mapping pathologically viable clusters...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Top half: Viewer + Findings */}
              <div className="flex flex-col xl:flex-row gap-4 h-auto xl:h-[420px]">
                <div className="flex-1 min-w-[50%]">
                  <AnnotatedImageViewer 
                    imageUrl={analysisResult.imageUrl} 
                    detections={analysisResult.detections} 
                  />
                </div>
                <div className="w-full xl:w-[380px] flex-shrink-0 flex flex-col h-full overflow-y-auto">
                  <FindingsCard results={analysisResult} />
                </div>
              </div>
              
              {/* Bottom half: Explanation + Stats */}
              <div className="flex flex-col xl:flex-row gap-4">
                <div className="flex-1 min-w-[50%]">
                  <ExplanationCard explanation={analysisResult.explanation} />
                </div>
                <div className="w-full xl:w-[380px] flex-shrink-0">
                  <StatusCards metadata={analysisResult.metadata} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
