
import { useState, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Upload, FileImage, FileVideo, X, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UploadSectionProps {
  onFileSelected: (file: File) => void;
}

const UploadSection = ({ onFileSelected }: UploadSectionProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  // Handle file selection
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };
  
  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  // Process selected file
  const processFile = (selectedFile: File) => {
    // Check if file is image or video
    if (!selectedFile.type.match('image.*') && !selectedFile.type.match('video.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image or video file.",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (20MB max)
    if (selectedFile.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 20MB.",
        variant: "destructive"
      });
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
    
    // Save file
    setFile(selectedFile);
    onFileSelected(selectedFile);
  };
  
  // Clear selected file
  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };
  
  // Trigger file input click
  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  // Play video preview
  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      {!file ? (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-10 transition-all duration-200",
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="image/*,video/*"
          />
          
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Drag & drop your file here</h3>
              <p className="text-muted-foreground mt-1">
                Supports JPG, PNG, GIF, and video formats up to 20MB
              </p>
            </div>
            <div className="flex items-center justify-center mt-2">
              <div className="mx-2 text-muted-foreground">or</div>
            </div>
            <button
              onClick={handleButtonClick}
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Browse files
            </button>
          </div>
        </div>
      ) : (
        <div className="relative bg-background border rounded-xl overflow-hidden shadow-subtle animate-fade-in">
          {/* Preview */}
          <div className="aspect-video relative bg-muted">
            {file.type.startsWith('image/') ? (
              <img 
                src={preview!} 
                alt="Upload preview" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="relative w-full h-full">
                <video 
                  ref={videoRef}
                  src={preview!} 
                  className="w-full h-full object-contain"
                  controls
                />
                {!videoRef.current?.played.length && (
                  <button
                    onClick={playVideo}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary fill-primary pl-1" />
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* File info */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              {file.type.startsWith('image/') ? (
                <FileImage className="w-5 h-5 text-primary mr-2" />
              ) : (
                <FileVideo className="w-5 h-5 text-primary mr-2" />
              )}
              <div>
                <p className="font-medium truncate max-w-xs">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {/* Remove button */}
            <button
              onClick={clearSelection}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
