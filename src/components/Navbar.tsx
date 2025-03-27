
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Sparkles, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-subtle" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 transition-transform duration-200 hover:scale-[1.02]">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-medium text-xl">Authentic AI</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" isActive={location.pathname === "/"}>Home</NavLink>
          <NavLink to="/about" isActive={location.pathname === "/about"}>About</NavLink>
        </nav>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-foreground p-1 rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-md animate-fade-in">
          <nav className="flex flex-col p-6 space-y-4">
            <NavLink to="/" isActive={location.pathname === "/"}>Home</NavLink>
            <NavLink to="/about" isActive={location.pathname === "/about"}>About</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

// NavLink component
const NavLink = ({ to, isActive, children }: { to: string; isActive: boolean; children: React.ReactNode }) => (
  <Link
    to={to}
    className={cn(
      "relative font-medium transition-colors hover:text-primary",
      isActive ? "text-primary" : "text-foreground"
    )}
  >
    {children}
    <span 
      className={cn(
        "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
        isActive ? "w-full" : "w-0"
      )}
    />
  </Link>
);

export default Navbar;
