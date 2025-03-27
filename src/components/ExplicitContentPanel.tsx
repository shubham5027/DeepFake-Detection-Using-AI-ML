
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, ShieldAlert, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ExplicitContentPanelProps {
  analyzing: boolean;
  result: {
    score: number;
    confidence: number;
    nsfw_likelihood: string;
    metadata: {
      model: string;
      processing_time: number;
    };
  } | null;
}

const ExplicitContentPanel = ({ analyzing, result }: ExplicitContentPanelProps) => {
  const [progress, setProgress] = useState(0);
  
  // Simulate loading progress
  useEffect(() => {
    if (analyzing) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 5;
          const newProgress = Math.min(prev + increment, 95); // Cap at 95% until complete
          return newProgress;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    } else if (result) {
      setProgress(100);
    }
  }, [analyzing, result]);
  
  // Determine content safety status
  const getContentStatus = () => {
    if (!result) return null;
    
    const nsfw = result.nsfw_likelihood;
    if (nsfw === "explicit" || nsfw === "suggestive") return "unsafe";
    if (nsfw === "gore" || nsfw === "violence") return "violent";
    return "safe";
  };
  
  const contentStatus = getContentStatus();
  
  return (
    <Card className="w-full overflow-hidden shadow-subtle">
      <CardHeader className="bg-muted/50 pb-2">
        <CardTitle className="text-xl flex items-center space-x-2">
          <Video className="w-5 h-5 text-primary" />
          <span>Explicit Content Detection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {analyzing && (
          <div className="p-6 animate-pulse space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-sm">Analyzing video content</h3>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {['Processing video', 'Analyzing frames', 'Detecting content', 'Generating report'].map((step, i) => (
                <div 
                  key={step}
                  className={cn(
                    "h-20 rounded-lg flex items-center justify-center p-4 text-center transition-all",
                    progress > (i * 25) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}
                >
                  <span className="text-sm font-medium">{step}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              This may take a few minutes depending on the video length...
            </p>
          </div>
        )}
        
        {!analyzing && !result && (
          <div className="p-6 text-center">
            <Info className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium">Video Content Analysis</h3>
            <p className="text-muted-foreground mt-1">Upload a video to check for explicit content</p>
          </div>
        )}
        
        {!analyzing && result && (
          <div className="p-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex items-center p-4 rounded-lg",
                contentStatus === "unsafe" ? "bg-destructive/10 text-destructive" :
                contentStatus === "violent" ? "bg-yellow-500/10 text-yellow-700" :
                "bg-green-500/10 text-green-700"
              )}
            >
              {contentStatus === "unsafe" || contentStatus === "violent" ? (
                <AlertTriangle className="w-6 h-6 mr-3" />
              ) : (
                <CheckCircle className="w-6 h-6 mr-3" />
              )}
              <div>
                <h3 className="font-medium">
                  {contentStatus === "unsafe" ? "Explicit Content Detected" :
                   contentStatus === "violent" ? "Violent Content Detected" :
                   "Safe Content"}
                </h3>
                <p className="text-sm opacity-90">
                  {contentStatus === "unsafe" ? "This video contains content that may be inappropriate" :
                   contentStatus === "violent" ? "This video contains potentially violent or disturbing content" :
                   "No inappropriate content detected in this video"}
                </p>
              </div>
            </motion.div>
            
            <div className="mt-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium capitalize">
                  {result.nsfw_likelihood || "Unknown"} Content Likelihood
                </span>
                <span className="text-sm font-bold">{Math.round(result.score * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={cn(
                    "h-full",
                    result.nsfw_likelihood === "explicit" ? "bg-destructive" :
                    result.nsfw_likelihood === "suggestive" ? "bg-orange-500" :
                    result.nsfw_likelihood === "gore" || result.nsfw_likelihood === "violence" ? "bg-yellow-500" :
                    "bg-green-500"
                  )}
                />
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Detection Model</span>
                <span>{result.metadata.model}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing Time</span>
                <span>{result.metadata.processing_time.toFixed(2)}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confidence</span>
                <span>{Math.round(result.confidence * 100)}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExplicitContentPanel;
