
// Service to detect explicit content in videos using Eden AI

interface ExplicitContentResult {
  score: number;
  confidence: number;
  nsfw_likelihood: string;
  metadata: {
    model: string;
    processing_time: number;
  };
}

export const detectExplicitContent = async (file: File): Promise<ExplicitContentResult> => {
  // Create form data
  const formData = new FormData();
  formData.append("providers", "amazon");
  formData.append("file", file);
  
  // Start time for processing measurement
  const startTime = performance.now();
  
  try {
    // Make API request to Eden AI
    const response = await fetch("https://api.edenai.run/v2/video/explicit_content_detection_async", {
      method: "POST",
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0"
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    // Get the request ID for polling
    const data = await response.json();
    console.log("Eden AI explicit content detection request:", data);
    
    // Get the public ID from the response
    const public_id = data.public_id;
    
    if (!public_id) {
      throw new Error("No public_id received from API");
    }
    
    // Poll for results
    const result = await pollForResults(public_id);
    
    // Calculate processing time
    const processingTime = (performance.now() - startTime) / 1000;
    
    // Extract the Amazon results
    const amazonResults = result.amazon || {};
    
    // Determine the NSFW likelihood based on the highest score
    const nsfwScores = amazonResults.nsfw_likelihood || {};
    let highestScore = 0;
    let nsfwLikelihood = "safe";
    
    Object.entries(nsfwScores).forEach(([category, score]) => {
      if (typeof score === 'number' && score > highestScore) {
        highestScore = score;
        nsfwLikelihood = category;
      }
    });
    
    return {
      score: parseFloat(highestScore.toFixed(2)),
      confidence: parseFloat((amazonResults.confidence || 0.5).toFixed(2)),
      nsfw_likelihood: nsfwLikelihood,
      metadata: {
        model: "Eden AI (Amazon)",
        processing_time: processingTime
      }
    };
  } catch (error) {
    console.error("Explicit content detection error:", error);
    
    // Fallback: Return a low confidence result for errors
    return {
      score: 0,
      confidence: 0,
      nsfw_likelihood: "unknown",
      metadata: {
        model: "Eden AI (Error)",
        processing_time: (performance.now() - startTime) / 1000
      }
    };
  }
};

// Function to poll for async results
const pollForResults = async (public_id: string, maxRetries = 20, interval = 5000): Promise<any> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(`https://api.edenai.run/v2/video/explicit_content_detection_async/${public_id}`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0"
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Eden AI polling response:", data);
      
      if (data.status === "finished") {
        return data.results;
      } else if (data.status === "failed") {
        throw new Error("Processing failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, interval));
    retries++;
  }
  
  throw new Error("Max retries reached while polling for results");
};
