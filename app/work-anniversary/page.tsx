'use client';

import React, { useState, useRef } from 'react';
import Link from "next/link";
import Image from "next/image";

// Add CSS for animations
const animations = `
  @keyframes twinkle {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: 200px 0; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

export default function WorkAnniversaryPage() {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [years, setYears] = useState('');
  const templateRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Function to get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
  const ordinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  // Handle input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleDesignationChange = (e: React.ChangeEvent<HTMLInputElement>) => setDesignation(e.target.value);
  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => setYears(e.target.value);

  // Download as image
  const handleDownload = async () => {
    if (!templateRef.current) {
      alert('Template not ready. Please try again.');
      return;
    }

    setDownloading(true);
    const downloadButton = document.getElementById('download-button');
    if (downloadButton) {
      downloadButton.textContent = 'Generating...';
      downloadButton.setAttribute('disabled', 'true');
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('type', 'work-anniversary');
      formData.append('name', name);
      formData.append('designation', designation);
      formData.append('years', years);

      // Call the API endpoint
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData // FormData will automatically set the correct Content-Type
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ details: 'Failed to generate image' }));
        throw new Error(errorData.details || 'Failed to generate image');
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `work-anniversary-${name.replace(/\s+/g, '-')}-${years}yrs.png`;
      link.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDownloading(false);
      if (downloadButton) {
        downloadButton.textContent = 'Download as Image';
        downloadButton.removeAttribute('disabled');
      }
    }
  };

  // Generate stars (mix of gold and white stars with different sizes)
  const generateStars = () => {
    const stars = [];
    
    // Add small white stars
    for (let i = 0; i < 100; i++) {
      const size = Math.random() * 2 + 1;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 3 + 3;
      const color = Math.random() > 0.7 ? '#e6c460' : 'white';
      const opacity = Math.random() * 0.5 + 0.3;
      
      stars.push(
        <div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            backgroundColor: color,
            opacity: opacity,
            animation: `twinkle ${duration}s infinite ${delay}s`
          }}
        />
      );
    }
    
    // Add larger gold particles/dots
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 10 + 5;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const opacity = Math.random() * 0.3 + 0.1;
      
      stars.push(
        <div
          key={`gold-particle-${i}`}
          className="absolute rounded-full blur-sm"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            backgroundColor: '#e6c460',
            opacity: opacity
          }}
        />
      );
    }
    
    return stars;
  };

  // Generate decorative elements
  const generateDecorations = () => {
    return (
      <>
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-32 h-32 opacity-40" style={{ 
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
          animation: 'pulse 6s infinite ease-in-out'
        }}></div>
        
        <div className="absolute bottom-4 right-4 w-32 h-32 opacity-40" style={{ 
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
          animation: 'pulse 6s infinite ease-in-out'
        }}></div>

        {/* Decorative lines */}
        <div className="absolute top-20 left-0 w-10 h-[1px] bg-white/40"></div>
        <div className="absolute top-20 left-12 w-6 h-[1px] bg-white/30"></div>
        <div className="absolute top-20 left-20 w-3 h-[1px] bg-white/20"></div>
        
        <div className="absolute top-20 right-0 w-10 h-[1px] bg-white/40"></div>
        <div className="absolute top-20 right-12 w-6 h-[1px] bg-white/30"></div>
        <div className="absolute top-20 right-20 w-3 h-[1px] bg-white/20"></div>
        
        {/* Floating elements */}
        <div className="absolute top-[40%] left-[15%] w-14 h-14 opacity-20" style={{
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.6)',
          animation: 'float 8s infinite ease-in-out'
        }}></div>
        
        <div className="absolute top-[60%] right-[15%] w-10 h-10 opacity-15" style={{
          borderRadius: '50%',
          border: '1px solid rgba(230,196,96,0.6)',
          animation: 'float 9s infinite ease-in-out'
        }}></div>
        
        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-12 h-12 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white/30" style={{transform: 'translateY(4px)'}}></div>
          <div className="absolute top-0 left-0 h-full w-[2px] bg-white/30" style={{transform: 'translateX(4px)'}}></div>
        </div>
        
        <div className="absolute top-2 right-2 w-12 h-12 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-white/30" style={{transform: 'translateY(4px)'}}></div>
          <div className="absolute top-0 right-0 h-full w-[2px] bg-white/30" style={{transform: 'translateX(-4px)'}}></div>
        </div>
        
        <div className="absolute bottom-2 left-2 w-12 h-12 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/30" style={{transform: 'translateY(-4px)'}}></div>
          <div className="absolute bottom-0 left-0 h-full w-[2px] bg-white/30" style={{transform: 'translateX(4px)'}}></div>
        </div>
        
        <div className="absolute bottom-2 right-2 w-12 h-12 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-white/30" style={{transform: 'translateY(-4px)'}}></div>
          <div className="absolute bottom-0 right-0 h-full w-[2px] bg-white/30" style={{transform: 'translateX(-4px)'}}></div>
        </div>
      </>
    );
  };

  return (
    <>
      <style>{animations}</style>
      <div className="min-h-screen bg-gray-50">
        {/* Header Banner */}
        <div className="bg-green-100 dark:bg-green-900 shadow-md" style={{ backgroundColor: '#dcfce7' }}>
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-100">
                Work Anniversary Card Generator
              </h1>
              <Link 
                href="/"
                className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-green-50 flex items-center gap-2 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto p-4 pt-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Form Section */}
            <div className="w-full md:w-1/3 space-y-4">
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200" style={{ color: '#166534' }}>Card Details</h2>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={handleNameChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      id="designation"
                      value={designation}
                      onChange={handleDesignationChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="years" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Service
                    </label>
                    <input
                      type="number"
                      id="years"
                      value={years}
                      onChange={handleYearsChange}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <button
                id="download-button"
                onClick={handleDownload}
                className="w-full py-2 px-4 rounded-md font-medium transition-colors disabled:bg-gray-400"
                style={{
                  backgroundColor: '#16a34a', 
                  color: 'white'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#15803d';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                }}
                disabled={downloading}
              >
                {downloading ? 'Generating...' : 'Download as Image'}
              </button>
            </div>
            
            {/* Template Preview */}
            <div className="w-full md:w-2/3">
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">Preview</h2>
                <div ref={templateRef} data-template className="relative max-w-2xl mx-auto">
                  <div 
                    className="w-full aspect-square rounded-lg overflow-hidden relative flex flex-col p-6"
                    data-preview="true"
                    style={{ 
                      background: 'radial-gradient(ellipse at center, #2a5686 0%, #1a3a5f 100%)',
                      boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3)'
                    }}
                  >
                    {/* Background stars */}
                    <div className="absolute inset-0 overflow-hidden">
                      {generateStars()}
                    </div>
                    
                    {/* Decorative elements */}
                    {generateDecorations()}
                    
                    {/* Company logo */}
                    <div className="mt-6 text-center z-10 flex justify-center items-center flex-col">
                      <div className="px-5 py-3 inline-block">
                        <div className="text-3xl font-bold tracking-tight relative" style={{ 
                          color: 'rgb(255, 255, 255)', 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.3)'
                        }}>
                          AGNEXT
                          <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-white/30"></div>
                        </div>
                        <div className="text-sm font-medium mt-2" style={{ 
                          color: 'rgb(255, 255, 255)', 
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                          letterSpacing: '0.05em'
                        }}>
                         
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-[220px] left-[140px] z-10 opacity-90" style={{
                      animation: 'float 7s infinite ease-in-out'
                    }}>
                      <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
                        <path d="M50,10 C30,20 20,50 30,70 C40,90 70,70 80,50 C70,70 50,80 30,70 C10,60 20,30 50,10z" fill="url(#gold-gradient)" />
                        <defs>
                          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffdb58" />
                            <stop offset="100%" stopColor="#b8860b" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    
                    {/* Happy + Work Anniversary text */}
                    <div className="text-center z-10 absolute top-[160px] left-1/2 transform -translate-x-1/2 w-full">
                      <h3 className="text-3xl mt-4" style={{ 
                        fontFamily: 'serif',
                        fontWeight: 'bold',
                        letterSpacing: '0.15em',
                        textShadow: '0 2px 4px rgba(0,0,0,0.6), 0 0 20px rgba(255, 255, 255, 0.8)',
                        fontStyle: 'italic',
                        color: 'rgb(255, 255, 255)',
                        padding: '0 10px',
                        animation: 'pulse 4s infinite ease-in-out'
                      }}>
                        ⋆ HAPPY ⋆
                      </h3>
                      
                      <div className="flex items-center justify-center mt-2">
                        <h3 className="text-4xl font-semibold" style={{ 
                          fontFamily: 'serif',
                          fontWeight: 'bold',
                          letterSpacing: '0.15em',
                          textShadow: '0 2px 5px rgba(0,0,0,0.6), 0 0 15px rgba(255, 255, 255, 0.7)',
                          fontStyle: 'italic',
                          color: 'rgb(255, 255, 255)',
                          background: 'linear-gradient(to right, rgba(255,255,255,0.8), rgba(255,255,255,1), rgba(255,255,255,0.8))',
                          backgroundSize: '200% 100%',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          animation: 'shimmer 6s infinite linear'
                        }}>
                          {years}<span className="text-2xl align-text-top">{ordinalSuffix(parseInt(years || '0'))}</span> WORK
                        </h3>
                      </div>
                      
                      <h2 className="text-6xl mt-1" style={{ 
                        fontFamily: 'serif',
                        fontWeight: 'bold',
                        letterSpacing: '0.12em',
                        textShadow: '0 2px 6px rgba(0,0,0,0.6), 0 0 20px rgba(255, 255, 255, 0.7)',
                        fontStyle: 'italic',
                        transform: 'scale(1, 1.05)',
                        color: 'rgb(255, 255, 255)',
                        background: 'linear-gradient(to right, rgba(255,255,255,0.8), rgba(255,255,255,1), rgba(255,255,255,0.8))',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'shimmer 6s infinite linear',
                        animationDelay: '0.5s'
                      }}>
                        Anniversary
                      </h2>
                    </div>
                    
                    {/* Blue Ribbon with 3D effect */}
                    <div className="absolute top-[370px] left-0 w-full flex items-center justify-center z-10">
                      {/* Ribbon shadow */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-[85%] h-6 bg-black/20 blur-md rounded-full"></div>
                      
                      {/* Left fold of ribbon */}
                      <div className="h-[80px] w-[40px] relative overflow-hidden" style={{
                          transform: 'skewY(15deg) translateY(-4px)',
                          transformOrigin: 'bottom right',
                          boxShadow: '-2px 4px 6px rgba(0,0,0,0.3)'
                        }}>
                        <div className="absolute inset-0" style={{
                            background: 'linear-gradient(to right bottom, #0353a8, #034e9e)',
                            boxShadow: 'inset -2px 2px 5px rgba(0,0,0,0.2)'
                          }}></div>
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30" style={{
                            background: 'linear-gradient(to bottom right, rgba(255,255,255,0.5), transparent)'
                          }}></div>
                      </div>
                      
                      {/* Main ribbon */}
                      <div className="h-[80px] w-[80%] flex flex-col items-center justify-center relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(to bottom, #0680e3, #0462c1)',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
                        }}>
                        {/* Fabric texture */}
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 1px, transparent 1px, transparent 10px)',
                          backgroundSize: '10px 10px'
                        }}></div>
                        
                        {/* Shine effect */}
                        <div className="absolute -top-[40px] -left-[100px] w-[200%] h-[30px] rotate-45 opacity-20" style={{
                          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)',
                          transform: 'rotate(25deg)',
                          animation: 'shimmer 8s infinite linear'
                        }}></div>
                        
                        {/* Top shadow line */}
                        <div className="absolute top-0 left-0 w-full h-[3px] bg-black/10"></div>
                        
                        {/* Bottom edge highlight */}
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10"></div>
                        
                        {/* Employee name and designation in ribbon */}
                        <div className="text-center relative z-10">
                          <h2 className="text-white text-3xl tracking-widest" 
                              style={{ 
                                fontFamily: '"Times New Roman", Times, serif !important',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textShadow: '1px 1px 3px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.4)'
                              }}>
                            {name}
                          </h2>
                          <p className="text-white text-lg mt-1" 
                              style={{ 
                                fontFamily: '"Times New Roman", Times, serif !important',
                                fontStyle: 'normal',
                                fontWeight: 500,
                                letterSpacing: '0.05em',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.4)'
                              }}>
                            {designation}
                          </p>
                        </div>
                      </div>
                      
                      {/* Right fold of ribbon */}
                      <div className="h-[80px] w-[40px] relative overflow-hidden" style={{
                          transform: 'skewY(-15deg) translateY(-4px)',
                          transformOrigin: 'bottom left',
                          boxShadow: '2px 4px 6px rgba(0,0,0,0.3)'
                        }}>
                        <div className="absolute inset-0" style={{
                            background: 'linear-gradient(to left bottom, #0353a8, #034e9e)',
                            boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.2)'
                          }}></div>
                        <div className="absolute top-0 left-0 w-1/2 h-full opacity-30" style={{
                            background: 'linear-gradient(to bottom left, rgba(255,255,255,0.5), transparent)'
                          }}></div>
                      </div>
                      
                      {/* Ribbon tails */}
                      <div className="absolute -bottom-12 left-[30%] w-[30px] h-[40px]" style={{
                        background: 'linear-gradient(to left bottom, #0462c1, #0353a8)',
                        transform: 'skewY(15deg)',
                        boxShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                      }}></div>
                      
                      <div className="absolute -bottom-8 left-[32%] w-[20px] h-[30px]" style={{
                        background: 'linear-gradient(to left bottom, #0462c1, #0353a8)',
                        transform: 'skewY(-5deg)',
                        boxShadow: '1px 2px 3px rgba(0,0,0,0.3)'
                      }}></div>
                      
                      <div className="absolute -bottom-10 right-[30%] w-[30px] h-[40px]" style={{
                        background: 'linear-gradient(to right bottom, #0462c1, #0353a8)',
                        transform: 'skewY(-15deg)',
                        boxShadow: '-2px 2px 4px rgba(0,0,0,0.3)'
                      }}></div>
                      
                      <div className="absolute -bottom-6 right-[32%] w-[20px] h-[30px]" style={{
                        background: 'linear-gradient(to right bottom, #0462c1, #0353a8)',
                        transform: 'skewY(5deg)',
                        boxShadow: '-1px 2px 3px rgba(0,0,0,0.3)'
                      }}></div>
                    </div>
                    
                    {/* Bottom message */}
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-4/5 text-center z-10">
                      <div className="mb-2 flex justify-center">
                        <div className="w-20 h-[1px] bg-white/50"></div>
                      </div>
                      <p className="text-white text-sm leading-relaxed" style={{
                        textShadow: '0 1px 2px rgba(0,0,0,0.4)'
                      }}>
                        Congratulations on reaching another milestone with us! We truly appreciate
                        your dedication and hard work, and we're grateful for everything you do.
                        Wishing you continued success and many more great years ahead!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}  