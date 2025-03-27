
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import UploadSection from '@/components/UploadSection';
import AnalysisPanel from '@/components/AnalysisPanel';
import HeatmapVisualizer from '@/components/HeatmapVisualizer';
import AIAssistant from '@/components/AIAssistant';
import ExplicitContentPanel from '@/components/ExplicitContentPanel';
import { detectDeepfake } from '@/services/detectionService';
import { detectAIGenerated } from '@/services/aiGenerationDetectionService';
import { detectExplicitContent } from '@/services/explicitContentDetectionService';
import { useToast } from '@/components/ui/use-toast';
import { ArrowDown, ShieldCheck, ShieldX, Video } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [analyzingDeepfake, setAnalyzingDeepfake] = useState(false);
  const [analyzingAIGenerated, setAnalyzingAIGenerated] = useState(false);
  const [analyzingExplicitContent, setAnalyzingExplicitContent] = useState(false);
  const [deepfakeResult, setDeepfakeResult] = useState<any>(null);
  const [aiGeneratedResult, setAIGeneratedResult] = useState<any>(null);
  const [explicitContentResult, setExplicitContentResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("deepfake");
  const { toast } = useToast();

  useEffect(() => {
    // Clean up URL objects when component unmounts
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const runAnalysis = async (file: File) => {
    if (!file) return;
    
    // Reset results
    setDeepfakeResult(null);
    setAIGeneratedResult(null);
    setExplicitContentResult(null);
    
    // First run deepfake detection for images
    if (file.type.startsWith('image/')) {
      setAnalyzingDeepfake(true);
      try {
        const detectionResult = await detectDeepfake(file);
        setDeepfakeResult(detectionResult);
        
        // Determine notification based on score
        if (detectionResult.score >= 0.8) {
          toast({
            title: "Deepfake Detected",
            description: "High probability that this media has been manipulated.",
            variant: "destructive",
          });
        } else if (detectionResult.score >= 0.4) {
          toast({
            title: "Potentially Manipulated",
            description: "Some suspicious patterns were detected in this media.",
            variant: "default",
          });
        } else {
          toast({
            title: "Likely Authentic",
            description: "No significant signs of manipulation were detected.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Deepfake detection error:", error);
        setError("An error occurred during deepfake analysis. Please try again with a different image.");
      } finally {
        setAnalyzingDeepfake(false);
      }
      
      // Then run AI generation detection for images
      setAnalyzingAIGenerated(true);
      try {
        const aiResult = await detectAIGenerated(file);
        setAIGeneratedResult(aiResult);
        
        // Show notification for AI generation result
        if (aiResult.prediction === "ai" && aiResult.confidence > 0.7) {
          toast({
            title: "AI-Generated Image Detected",
            description: "This image was likely created by AI with high confidence.",
            variant: "destructive",
          });
        } else if (aiResult.prediction === "ai") {
          toast({
            title: "Possibly AI-Generated",
            description: "This image may have been created by AI, but with lower confidence.",
            variant: "default",
          });
        } else {
          toast({
            title: "Likely Human-Created",
            description: "This image was likely created by a human.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("AI detection error:", error);
        setError("An error occurred during AI generation analysis. Please try again with a different image.");
      } finally {
        setAnalyzingAIGenerated(false);
      }
    }
    
    // Run explicit content detection for videos
    if (file.type.startsWith('video/')) {
      setActiveTab("explicit-content");
      setAnalyzingExplicitContent(true);
      toast({
        title: "Video Analysis Started",
        description: "Analyzing video for explicit content. This might take a few minutes.",
        duration: 5000,
      });
      
      try {
        const explicitResult = await detectExplicitContent(file);
        setExplicitContentResult(explicitResult);
        
        // Show notification for explicit content result
        if (explicitResult.nsfw_likelihood === "explicit") {
          toast({
            title: "Explicit Content Detected",
            description: "This video contains explicit content with high confidence.",
            variant: "destructive",
          });
        } else if (explicitResult.nsfw_likelihood === "suggestive" || explicitResult.nsfw_likelihood === "gore" || explicitResult.nsfw_likelihood === "violence") {
          toast({
            title: "Potentially Unsafe Content",
            description: `This video may contain ${explicitResult.nsfw_likelihood} content.`,
            variant: "default",
          });
        } else {
          toast({
            title: "Safe Content",
            description: "No explicit or unsafe content was detected in this video.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Explicit content detection error:", error);
        setError("An error occurred during explicit content analysis. Please try again with a different video.");
      } finally {
        setAnalyzingExplicitContent(false);
      }
    }
  };

  const handleFileSelected = async (selectedFile: File) => {
    // Clean up previous URL if exists
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    
    // Create new URL for the file
    const url = URL.createObjectURL(selectedFile);
    setFileUrl(url);
    setFile(selectedFile);
    setError(null);
    
    // Set appropriate tab based on file type
    if (selectedFile.type.startsWith('video/')) {
      setActiveTab("explicit-content");
    } else {
      setActiveTab("deepfake");
    }
    
    // Start analysis
    await runAnalysis(selectedFile);
  };

  // Determine if any analysis is still running
  const analyzing = analyzingDeepfake || analyzingAIGenerated || analyzingExplicitContent;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-32 pb-20 px-6 md:pt-40 md:pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span>Deepfake Detection</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Identify Manipulated & AI-Generated Media
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Using AI/ML advanced detection systems to identify deepfakes, AI-generated images, and manipulated media with precision.
          </p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <ArrowDown className="w-6 h-6 text-primary animate-pulse-subtle" />
            <span className="text-sm text-muted-foreground mt-2">Upload an image to analyze</span>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Upload section */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <UploadSection onFileSelected={handleFileSelected} />
        </div>
      </section>
      
      {/* Analysis section */}
      {(file || analyzing || deepfakeResult || aiGeneratedResult || explicitContentResult) && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="deepfake" className="flex items-center gap-2" disabled={file?.type.startsWith('video/')}>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Deepfake</span>
                </TabsTrigger>
                <TabsTrigger value="ai-generated" className="flex items-center gap-2" disabled={file?.type.startsWith('video/')}>
                  <ShieldX className="w-4 h-4" />
                  <span>AI Generation</span>
                </TabsTrigger>
                <TabsTrigger value="explicit-content" className="flex items-center gap-2" disabled={!file?.type.startsWith('video/')}>
                  <Video className="w-4 h-4" />
                  <span>Explicit Content</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="deepfake" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Deepfake Results panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AnalysisPanel
                      title="Deepfake Detection"
                      description="Analysis of potential facial manipulations and inconsistencies"
                      analyzing={analyzingDeepfake}
                      result={deepfakeResult}
                    />
                  </motion.div>
                  
                  {/* Heatmap visualization */}
                  {deepfakeResult && fileUrl && file?.type.startsWith('image/') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="border rounded-lg overflow-hidden shadow-subtle">
                        <div className="bg-muted/50 p-4 font-medium">
                          Heatmap Visualization
                        </div>
                        <div className="p-4">
                          <HeatmapVisualizer
                            imageUrl={fileUrl}
                            detectionData={{ heatmapData: deepfakeResult.heatmapData }}
                          />
                          <p className="text-sm text-muted-foreground mt-4">
                            Color intensity indicates the confidence level of potential manipulation in different regions of the image.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="ai-generated" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* AI Generation Results */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="border rounded-lg overflow-hidden shadow-subtle h-full">
                      <div className="bg-muted/50 p-4 font-medium">
                        AI-Generated Image Detection
                      </div>
                      <div className="p-6">
                        {analyzingAIGenerated ? (
                          <div className="flex flex-col items-center justify-center py-10">
                            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                            <p className="text-center text-muted-foreground">
                              Analyzing if the image was created by AI...
                            </p>
                          </div>
                        ) : aiGeneratedResult ? (
                          <div>
                            <div className="flex items-center justify-center mb-6">
                              <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                                aiGeneratedResult.prediction === "ai" 
                                  ? "bg-destructive/20" 
                                  : "bg-green-500/20"
                              }`}>
                                <span className={`text-4xl font-bold ${
                                  aiGeneratedResult.prediction === "ai"
                                    ? "text-destructive" 
                                    : "text-green-600"
                                }`}>
                                  {Math.round(aiGeneratedResult.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-semibold text-center mb-2">
                              {aiGeneratedResult.prediction === "ai" 
                                ? "AI-Generated" 
                                : aiGeneratedResult.prediction === "human" 
                                  ? "Human-Created" 
                                  : "Analysis Inconclusive"}
                            </h3>
                            
                            <p className="text-center text-muted-foreground mb-6">
                              {aiGeneratedResult.prediction === "ai"
                                ? `This image was likely created by AI with ${Math.round(aiGeneratedResult.confidence * 100)}% confidence.`
                                : aiGeneratedResult.prediction === "human"
                                  ? `This image was likely created by a human with ${Math.round(aiGeneratedResult.confidence * 100)}% confidence.`
                                  : "The analysis couldn't determine if this image was AI-generated or human-created."}
                            </p>
                            
                            <div className="mt-6 pt-6 border-t">
                              <p className="text-sm text-muted-foreground">
                                
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Processing time: {aiGeneratedResult.metadata.processing_time.toFixed(2)}s
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-10 text-muted-foreground">
                            No AI generation analysis results available
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Original Image */}
                  {fileUrl && file?.type.startsWith('image/') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="border rounded-lg overflow-hidden shadow-subtle">
                        <div className="bg-muted/50 p-4 font-medium">
                          Original Image
                        </div>
                        <div className="p-4">
                          <div className="aspect-video bg-muted rounded relative overflow-hidden">
                            <img 
                              src={fileUrl} 
                              alt="Uploaded image" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="explicit-content" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Explicit Content Results panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ExplicitContentPanel
                      analyzing={analyzingExplicitContent}
                      result={explicitContentResult}
                    />
                  </motion.div>
                  
                  {/* Video Player */}
                  {fileUrl && file?.type.startsWith('video/') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="border rounded-lg overflow-hidden shadow-subtle">
                        <div className="bg-muted/50 p-4 font-medium">
                          Video Preview
                        </div>
                        <div className="p-4">
                          <div className="aspect-video bg-muted rounded relative overflow-hidden">
                            <video 
                              src={fileUrl} 
                              controls
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-4">
                            Video content is analyzed for explicit or inappropriate material.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Error message */}
            {error && !analyzing && (
              <div className="col-span-1 lg:col-span-2 mt-8">
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
                  <p>{error}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* AI Assistant */}
      <AIAssistant analysisResult={
        activeTab === "deepfake" 
          ? deepfakeResult 
          : activeTab === "ai-generated" 
            ? aiGeneratedResult 
            : explicitContentResult
      } />
    </div>
  );
};

export default Index;
