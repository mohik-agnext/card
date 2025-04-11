'use client';

import React, { useState, useRef } from 'react';
import Link from "next/link";
import Image from 'next/image';
import '@fontsource/caveat';

export default function BirthdayPage() {
  const [name, setName] = useState('');
  const [downloading, setDownloading] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  // Handle input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);

  // Download as image
  const handleDownload = async () => {
    const button = document.getElementById('download-button');
    if (button) {
      button.textContent = 'Generating...';
      button.setAttribute('disabled', 'true');
    }
    setDownloading(true);

    try {
      // Send JSON data
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'birthday',
          name: name
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.details || 'Failed to generate image');
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `birthday-${name.replace(/\s+/g, '-')}.png`;
      link.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDownloading(false);
      if (button) {
        button.textContent = 'Download as Image';
        button.removeAttribute('disabled');
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
      {/* Header Banner */}
      <div style={{ backgroundColor: 'rgb(255, 228, 230)' }} className="shadow-md">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'rgb(159, 18, 57)' }}>
              Birthday Card Generator
            </h1>
            <Link 
              href="/"
              className="flex items-center gap-2 font-medium hover:text-rose-900"
              style={{ color: 'rgb(225, 29, 72)' }}
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
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'rgb(159, 18, 57)' }}>
                Card Details
              </h2>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: 'rgb(55, 65, 81)' }}>
                  Employee Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 border rounded-md outline-none"
                  style={{ borderColor: 'rgb(209, 213, 219)' }}
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                id="download-button"
                onClick={handleDownload}
                className="w-full py-2 px-4 rounded-md font-medium transition-colors"
                style={{
                  backgroundColor: 'rgb(244, 63, 94)',
                  color: 'rgb(255, 255, 255)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(225, 29, 72)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(244, 63, 94)';
                }}
                disabled={downloading}
              >
                {downloading ? 'Generating...' : 'Download as Image'}
              </button>
            </div>
          </div>
          
          {/* Template Preview */}
          <div className="w-full md:w-2/3">
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'rgb(159, 18, 57)' }}>Preview</h2>
              <div ref={templateRef} className="relative max-w-2xl mx-auto">
                <div 
                  className="relative w-full overflow-hidden rounded-lg bg-white shadow-xl" 
                  style={{ 
                    aspectRatio: '4/3',
                    transform: 'scale(1)',
                    transformOrigin: 'center center',
                    width: '100%',
                    maxWidth: '1200px'
                  }}
                  data-preview="true"
                >
                  {/* Background Template Image */}
                  <Image
                    src="/birthday-template.jpg"
                    alt="Birthday Card Template"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
                    quality={100}
                  />
                  
                  {/* Name Banner Area */}
                  <div className="absolute z-20" style={{ top: '44%', left: '61%' }}>
                    <h2 style={{ 
                      fontFamily: 'Caveat, sans-serif',
                      color: 'rgb(255, 255, 255)',
                      fontSize: '2.2rem',
                      fontWeight: 500,
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
                    }} className="whitespace-wrap">
                      {name}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}