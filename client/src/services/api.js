export const api = {
  healthCheck: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'ok', message: 'Workstation Services Online' });
      }, 300);
    });
  },
  
  predictAnalysis: async (fileData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!fileData) {
          reject(new Error("Hardware fault: Sample acquisition failed."));
          return;
        }
        
        resolve({
          imageUrl: fileData.previewUrl,
          detections: [
            { label: 'Focal Opacity', confidence: 98, description: 'Dense localized structure observed. Morphological pattern shows distinct deviation from expected respiratory baseline.' },
            { label: 'Diffuse Margin', confidence: 85, description: 'Peripheral structural boundaries appear less defined, indicating possible fluid presence or infiltration.' }
          ],
          explanation: "The AI model has completed the topographical feature analysis utilizing the clinical diagnostic pipeline. The neural network identified two principal segments exhibiting high correlation with established pathological signatures. While the pattern analysis represents a significant structural deviation, this constitutes an investigational analysis only. Final determination rests with the attending specialist reviewing standard lab protocols.",
          metadata: {
            processingTime: "840ms",
            modelVersion: "Clinical-Build-v4.2.1",
            source: fileData.source === 'file' ? 'Local Archive' : fileData.source === 'cloud' ? 'PACS Relay' : 'Optical Direct'
          }
        });
      }, 2500); // Simulate inference execution latency
    });
  }
};
