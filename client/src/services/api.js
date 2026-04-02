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
  
  predictAnalysis: async (fileData) => {
    if (!fileData || !fileData.file) {
      throw new Error("System disconnected");
    }
    
    const formData = new FormData();
    formData.append("file", fileData.file);

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
        explanation: data.explanation || data.summary,
        annotated_image: data.annotated_image,
      };
    } catch (e) {
      console.error(e);
      throw new Error("System disconnected");
    }
  }
};
