export const api = {
  healthCheck: async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/home");
      if (response.status !== 200) throw new Error("Network status was not 200");
      const data = await response.json();
      return { status: 'ok', message: 'Workstation Services Online', data };
    } catch (e) {
      return { status: 'error', message: 'Services Offline' };
    }
  },
  
  predictAnalysis: async (fileDataArray) => {
    if (!fileDataArray || fileDataArray.length === 0) {
      throw new Error("System disconnected");
    }
    
    const formData = new FormData();
    fileDataArray.forEach(fileData => {
      if (fileData.file) {
        formData.append("files", fileData.file);
      }
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("System disconnected");
      }

      const data = await response.json();
      
      // Strict contract mapping
      return {
        summary: data.summary,
        annotated_images: data.annotated_images || [],
        total_detections: data.total_detections,
        raw_detections: data.raw_detections || [],
      };
    } catch (e) {
      console.error(e);
      throw new Error("System disconnected");
    }
  }
};
