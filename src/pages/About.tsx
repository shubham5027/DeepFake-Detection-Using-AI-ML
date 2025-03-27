
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Shield, Zap, Brain, FileSearch, Fingerprint, Server } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-32 pb-16 px-6 md:pt-40">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            About Authentic AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our mission is to develop reliable technology that helps users identify manipulated media in an increasingly complex digital landscape.
          </p>
        </motion.div>
      </section>
      
      {/* Technology section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Technology</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Authentic AI uses advanced AI models to analyze media and identify signs of manipulation with high precision.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Brain />}
              title="Neural Networks"
              description="Our system employs state-of-the-art neural networks like XceptionNet, EfficientNet and Vision Transformers to analyze media with exceptional accuracy."
              delay={0.3}
            />
            <FeatureCard 
              icon={<FileSearch />}
              title="Multi-level Analysis"
              description="We examine facial inconsistencies, lighting patterns, unnatural movements, and pixel-level artifacts to provide comprehensive detection."
              delay={0.4}
            />
            <FeatureCard 
              icon={<Fingerprint />}
              title="ML Detection"
              description="Our algorithms can identify digital fingerprints left by AI generators, even when they're not visible to the human eye."
              delay={0.5}
            />
            <FeatureCard 
              icon={<Zap />}
              title="Real-time Processing"
              description="Advanced optimizations allow our system to process and analyze media quickly, providing results in seconds."
              delay={0.6}
            />
            <FeatureCard 
              icon={<Server />}
              title="Continuous Learning"
              description="Our models are regularly updated with the latest deepfake techniques to stay ahead of increasingly sophisticated manipulation methods."
              delay={0.7}
            />
            <FeatureCard 
              icon={<Shield />}
              title="Privacy-Focused"
              description="All processing is done securely, and we prioritize user privacy throughout the detection process."
              delay={0.8}
            />
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our detection pipeline employs multiple specialized techniques to analyze different aspects of potentially manipulated media.
            </p>
          </motion.div>
          
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-muted hidden md:block" />
            
            <div className="space-y-12">
              <ProcessStep 
                number={1}
                title="Data Collection & Preprocessing"
                description="We start by extracting key frames from videos or processing images directly. Faces are detected and aligned for precise analysis."
                alignment="right"
              />
              <ProcessStep 
                number={2}
                title="Feature Extraction"
                description="Our neural networks analyze the media to extract features related to facial consistency, lighting, texture, and other elements that might indicate manipulation."
                alignment="left"
              />
              <ProcessStep 
                number={3}
                title="Pattern Analysis"
                description="We examine patterns within the extracted features to identify inconsistencies that would be present in artificially generated or manipulated media."
                alignment="right"
              />
              <ProcessStep 
                number={4}
                title="Confidence Scoring"
                description="Based on multiple detection metrics, we calculate a final confidence score that represents the likelihood of the media being manipulated."
                alignment="left"
              />
              <ProcessStep 
                number={5}
                title="Result Visualization"
                description="We generate intuitive visualizations like heatmaps to help users understand exactly which areas of the media have been flagged as potentially manipulated."
                alignment="right"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 bg-muted/50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} TruthVisor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay?: number; 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-background rounded-lg p-6 border shadow-subtle hover:shadow-glass-lg transition-all duration-300"
  >
    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
      <div className="text-primary">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </motion.div>
);

// Process Step Component
const ProcessStep = ({ 
  number, 
  title, 
  description, 
  alignment = "left" 
}: { 
  number: number; 
  title: string; 
  description: string; 
  alignment: "left" | "right"; 
}) => (
  <div className="relative">
    <motion.div
      initial={{ opacity: 0, x: alignment === "left" ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`md:w-1/2 ${alignment === "right" ? "md:ml-auto" : ""}`}
    >
      <div className="bg-background rounded-lg p-6 border shadow-subtle relative">
        <div className="absolute top-6 text-4xl font-bold text-primary/10 -left-2 md:left-auto md:-right-2">
          {number.toString().padStart(2, '0')}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
        
        {/* Timeline node */}
        <div className={`hidden md:block absolute top-1/2 w-4 h-4 rounded-full bg-primary -translate-y-1/2 ${
          alignment === "left" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
        }`} />
      </div>
    </motion.div>
  </div>
);

export default About;
