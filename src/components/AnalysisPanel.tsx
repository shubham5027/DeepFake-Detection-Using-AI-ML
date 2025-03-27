import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, ShieldAlert, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface AnalysisPanelProps {
  analyzing: boolean;
  result: {
    score: number;
    artifacts: number;
    inconsistencies: number;
    unnatural: number;
    metadata: {
      model: string;
      confidence: number;
      processing_time: number;
    };
  } | null;
  title?: string;
  description?: string;
}

const AnalysisPanel = ({ analyzing, result, title = "Deepfake Detection Results", description = "Analysis of facial inconsistencies and manipulation artifacts" }: AnalysisPanelProps) => {
  const [progress, setProgress] = useState(0);
  
  // Simulate loading progress
  useEffect(() => {
    if (analyzing) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 10;
          const newProgress = Math.min(prev + increment, 95); // Cap at 95% until complete
          return newProgress;
        });
      }, 300);
      
      return () => clearInterval(interval);
    } else if (result) {
      setProgress(100);
    }
  }, [analyzing, result]);
  
  // Determine result status
  const getResultStatus = () => {
    if (!result) return null;
    
    const score = result.score;
    if (score >= 0.8) return "deepfake";
    if (score >= 0.4) return "suspicious";
    return "authentic";
  };
  
  const resultStatus = getResultStatus();
  
  return (
    <Card className="w-full overflow-hidden shadow-subtle">
      <CardHeader className="bg-muted/50 pb-2">
        <CardTitle className="text-xl flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {analyzing && (
          <div className="p-6 animate-pulse space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-sm">Analyzing media</h3>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {['Extracting frames', 'Detecting faces', 'Analyzing artifacts', 'Checking patterns'].map((step, i) => (
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
          </div>
        )}
        
        {!analyzing && !result && (
          <div className="p-6 text-center">
            <Info className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium">{description}</h3>
            <p className="text-muted-foreground mt-1">Upload an image or video to begin analysis</p>
          </div>
        )}
        
        {!analyzing && result && (
          <Tabs defaultValue="summary" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 h-auto p-1">
                <TabsTrigger value="summary" className="py-2">Summary</TabsTrigger>
                <TabsTrigger value="technical" className="py-2">Technical</TabsTrigger>
                <TabsTrigger value="metadata" className="py-2">Metadata</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="summary" className="p-6 pt-4 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex items-center p-4 rounded-lg",
                  resultStatus === "deepfake" ? "bg-destructive/10 text-destructive" :
                  resultStatus === "suspicious" ? "bg-yellow-500/10 text-yellow-700" :
                  "bg-green-500/10 text-green-700"
                )}
              >
                {resultStatus === "deepfake" ? (
                  <AlertTriangle className="w-6 h-6 mr-3" />
                ) : resultStatus === "suspicious" ? (
                  <AlertTriangle className="w-6 h-6 mr-3" />
                ) : (
                  <CheckCircle className="w-6 h-6 mr-3" />
                )}
                <div>
                  <h3 className="font-medium">
                    {resultStatus === "deepfake" ? "Likely Deepfake Detected" :
                     resultStatus === "suspicious" ? "Potentially Manipulated" :
                     "Likely Authentic"}
                  </h3>
                  <p className="text-sm opacity-90">
                    {resultStatus === "deepfake" ? "High confidence that this media has been manipulated" :
                     resultStatus === "suspicious" ? "Some suspicious patterns detected" :
                     "No significant manipulation detected"}
                  </p>
                </div>
              </motion.div>
              
              <div className="mt-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Deepfake Probability</span>
                  <span className="text-sm font-bold">{Math.round(result.score * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(
                      "h-full",
                      result.score >= 0.8 ? "bg-destructive" :
                      result.score >= 0.4 ? "bg-yellow-500" :
                      "bg-green-500"
                    )}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-6">
                <ScoreCard
                  title="Facial Inconsistencies"
                  value={result.inconsistencies}
                  color={result.inconsistencies > 0.7 ? "red" : result.inconsistencies > 0.4 ? "yellow" : "green"}
                />
                <ScoreCard
                  title="Unnatural Elements"
                  value={result.unnatural}
                  color={result.unnatural > 0.7 ? "red" : result.unnatural > 0.4 ? "yellow" : "green"}
                />
                <ScoreCard
                  title="Digital Artifacts"
                  value={result.artifacts}
                  color={result.artifacts > 0.7 ? "red" : result.artifacts > 0.4 ? "yellow" : "green"}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="p-6 pt-4">
              <div className="space-y-6">
                <TechnicalDetail
                  title="Facial Inconsistencies"
                  score={result.inconsistencies}
                  details={[
                    { name: "Eye alignment", value: result.inconsistencies * 0.9 },
                    { name: "Facial symmetry", value: result.inconsistencies * 1.1 },
                    { name: "Skin texture", value: result.inconsistencies * 0.85 }
                  ]}
                />
                <TechnicalDetail
                  title="Unnatural Elements"
                  score={result.unnatural}
                  details={[
                    { name: "Motion smoothness", value: result.unnatural * 0.95 },
                    { name: "Lighting consistency", value: result.unnatural * 1.05 },
                    { name: "Background integration", value: result.unnatural * 0.9 }
                  ]}
                />
                <TechnicalDetail
                  title="Digital Artifacts"
                  score={result.artifacts}
                  details={[
                    { name: "Compression artifacts", value: result.artifacts * 1.1 },
                    { name: "Color bleeding", value: result.artifacts * 0.85 },
                    { name: "Edge detection", value: result.artifacts * 0.95 }
                  ]}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="metadata" className="p-6 pt-4">
              <div className="border rounded-lg divide-y">
                <MetadataItem label="Detection Model" value={result.metadata.model} />
                <MetadataItem label="Model Confidence" value={`${(result.metadata.confidence * 100).toFixed(2)}%`} />
                <MetadataItem label="Processing Time" value={`${result.metadata.processing_time.toFixed(2)}s`} />
                <MetadataItem label="Analysis Timestamp" value={new Date().toLocaleString()} />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

// Score card component
const ScoreCard = ({ title, value, color }: { title: string; value: number; color: "red" | "yellow" | "green" }) => (
  <div className="flex flex-col items-center justify-center p-3 text-center rounded-lg bg-muted">
    <div className="text-xs sm:text-sm font-medium mb-2 line-clamp-2 h-8">{title}</div>
    <div className={cn(
      "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold",
      color === "red" ? "bg-destructive" : 
      color === "yellow" ? "bg-yellow-500" : 
      "bg-green-500"
    )}>
      {Math.round(value * 100)}%
    </div>
  </div>
);

// Technical detail component
const TechnicalDetail = ({ 
  title, 
  score, 
  details 
}: { 
  title: string; 
  score: number; 
  details: { name: string; value: number }[];
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="font-medium">{title}</h3>
      <div className={cn(
        "px-2 py-0.5 rounded text-xs font-medium",
        score > 0.7 ? "bg-destructive/10 text-destructive" :
        score > 0.4 ? "bg-yellow-500/10 text-yellow-700" :
        "bg-green-500/10 text-green-700"
      )}>
        {score > 0.7 ? "High" : score > 0.4 ? "Medium" : "Low"}
      </div>
    </div>
    <div className="space-y-2">
      {details.map(detail => (
        <div key={detail.name} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{detail.name}</span>
            <span>{Math.round(detail.value * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${detail.value * 100}%` }}
              transition={{ duration: 0.5 }}
              className={cn(
                "h-full",
                detail.value > 0.7 ? "bg-destructive" :
                detail.value > 0.4 ? "bg-yellow-500" :
                "bg-green-500"
              )}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Metadata item component
const MetadataItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-3 px-4">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

export default AnalysisPanel;
