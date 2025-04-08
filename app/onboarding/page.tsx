'use client';

import React, { useState, useRef } from 'react';
import Link from "next/link";

export default function OnboardingPage() {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [location, setLocation] = useState('');
  const [education, setEducation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [smallProfileImage, setSmallProfileImage] = useState<string | null>(null);
  const [congratsMessage, setCongratsMessage] = useState('Congratulations and welcome aboard! We\'re so glad you chose us to help us rise to the next level.');
  const [reportingManager, setReportingManager] = useState('');
  const [managerSearchQuery, setManagerSearchQuery] = useState('');
  const [managerSuggestions, setManagerSuggestions] = useState<Array<{ id: string; fields: { Name: string; Photo: Array<{ url: string }> } }>>([]);
  const [isManagerSearching, setIsManagerSearching] = useState(false);
  const managerSearchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const templateRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const smallFileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ id: string; fields: { Name: string; Photo: Array<{ url: string }> } }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Handle main profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        // Clear the search query when manually uploading
        setSearchQuery('');
        setSuggestions([]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle small profile image upload
  const handleSmallImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSmallProfileImage(result);
        // Clear manager selection when manually uploading image
        setManagerSearchQuery('');
        setReportingManager('');
      };
      reader.readAsDataURL(file);
    }
  };

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
      const formData = new FormData();
      formData.append('type', 'onboarding');
      formData.append('name', name);
      formData.append('designation', designation);
      formData.append('location', location);
      formData.append('education', education);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('description', description);
      formData.append('congratsMessage', congratsMessage);
      formData.append('reportingManager', reportingManager);
      
      // Append both profile images
      if (profileImage) {
        formData.append('profileImageUrl', profileImage);
      }
      if (smallProfileImage) {
        formData.append('smallProfileImageUrl', smallProfileImage);
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `welcome-${name.replace(/\s+/g, '-')}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate image');
    } finally {
      setDownloading(false);
      if (downloadButton) {
        downloadButton.textContent = 'Download as Image';
        downloadButton.removeAttribute('disabled');
      }
    }
  };

  // Profile image section JSX update
  const renderProfileImage = () => (
    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#2F7B75] flex-shrink-0">
      {profileImage ? (
        <img
          src={profileImage}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );

  // Add refresh button next to profile image
  const renderProfileSection = () => (
    <div className="flex items-start space-x-8">
      <div className="relative">
        {renderProfileImage()}
      </div>
      <div className="flex-grow">
        <div className="text-[#2F7B75] mb-6">
          <span className="text-6xl font-serif italic" style={{
            fontFamily: 'Brush Script MT, cursive',
            background: 'linear-gradient(45deg, #2F7B75, #40A699)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '3px 3px 6px rgba(0,0,0,0.15)',
            position: 'relative',
            display: 'inline-block',
            padding: '0 15px',
            letterSpacing: '2px'
          }}>
            Hello
            <div style={{
              content: '""',
              position: 'absolute',
              bottom: '-8px',
              left: '0',
              width: '100%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #2F7B75, transparent)',
            }}></div>
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-20px',
              fontSize: '2rem',
              color: '#2F7B75',
              opacity: '0.5',
              transform: 'rotate(-15deg)'
            }}>✦</div>
          </span>
        </div>
        <div className="mb-2">
          <div className="text-xl text-gray-600">I am</div>
          <div className="text-3xl font-bold text-[#2F7B75]">{name || 'Your Name'}</div>
        </div>
        <div className="text-gray-600 text-sm leading-relaxed">
          {description || 'Your focus areas and description will appear here'}
        </div>
            </div>
          </div>
  );

  // Handle search input
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    // Add debounce to prevent too many requests
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Search failed');
        }
        const data = await response.json();
        setSuggestions(data.records || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (record: { fields: { Name: string; Photo: Array<{ url: string }> } }) => {
    setName(record.fields.Name);
    if (record.fields.Photo?.[0]?.url) {
      setProfileImage(record.fields.Photo[0].url);
      // Remove auto-setting of small profile image
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
    setSearchQuery(record.fields.Name);
    setSuggestions([]);
  };

  // Render the small profile image section with upload button
  const renderSmallProfileSection = () => (
    <div className="relative">
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#2F7B75] shadow-lg">
        {smallProfileImage ? (
          <img
            src={smallProfileImage}
            alt="Small Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      <input
        type="file"
        id="small-profile-upload"
        accept="image/*"
        onChange={handleSmallImageUpload}
        ref={smallFileInputRef}
        className="hidden"
      />
      <button
        onClick={() => smallFileInputRef.current?.click()}
        className="absolute -bottom-1 -right-1 p-1 bg-[#2F7B75] text-white rounded-full hover:bg-[#266460] transition-colors"
        title="Upload small profile photo"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );

  // Add the search input to your form section, just before the name input
  const renderSearchInput = () => (
    <div className="relative mb-4">
      <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
        Search Employee or Upload Photo
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none"
            placeholder="Type to search employee..."
          />
          {isSearching && (
            <div className="absolute right-3 top-[50%] transform -translate-y-1/2">
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
        <div className="relative">
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="h-full px-4 bg-[#2F7B75] text-white rounded-md hover:bg-[#266460] transition-colors flex items-center gap-2"
            title="Upload photo manually"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
        </div>
      </div>
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((record) => (
            <div
              key={record.id}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectSuggestion(record)}
            >
              {record.fields.Photo?.[0]?.url && (
                <img
                  src={record.fields.Photo[0].url}
                  alt={record.fields.Name}
                  className="w-8 h-8 rounded-full mr-3 object-cover"
                />
              )}
              <span>{record.fields.Name}</span>
            </div>
          ))}
        </div>
      )}
          </div>
  );

  // Handle manager search input
  const handleManagerSearch = async (query: string) => {
    setManagerSearchQuery(query);
    
    if (managerSearchTimeoutRef.current) {
      clearTimeout(managerSearchTimeoutRef.current);
    }

    if (!query.trim()) {
      setManagerSuggestions([]);
      return;
    }

    managerSearchTimeoutRef.current = setTimeout(async () => {
      setIsManagerSearching(true);
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Search failed');
        }
        const data = await response.json();
        setManagerSuggestions(data.records || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsManagerSearching(false);
      }
    }, 300);
  };

  // Handle manager suggestion selection
  const handleManagerSuggestionSelect = (record: { fields: { Name: string; Photo: Array<{ url: string }> } }) => {
    setReportingManager(record.fields.Name);
    setManagerSearchQuery(record.fields.Name);
    // Set the small profile image when manager is selected
    if (record.fields.Photo?.[0]?.url) {
      setSmallProfileImage(record.fields.Photo[0].url);
      if (smallFileInputRef.current) {
        smallFileInputRef.current.value = '';
      }
    }
    setManagerSuggestions([]);
  };

  // Render manager search input
  const renderManagerSearchInput = () => (
    <div className="relative mb-4">
      <label htmlFor="manager-search" className="block text-sm font-medium text-gray-700 mb-1">
        Search Reporting Manager
      </label>
      <div className="relative">
        <input
          type="text"
          id="manager-search"
          value={managerSearchQuery}
          onChange={(e) => handleManagerSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none"
          placeholder="Type to search manager..."
        />
        {isManagerSearching && (
          <div className="absolute right-3 top-[50%] transform -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        {managerSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {managerSuggestions.map((record) => (
              <div
                key={record.id}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleManagerSuggestionSelect(record)}
              >
                {record.fields.Photo?.[0]?.url && (
                  <img
                    src={record.fields.Photo[0].url}
                    alt={record.fields.Name}
                    className="w-8 h-8 rounded-full mr-3 object-cover"
                  />
                )}
                <span>{record.fields.Name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
          </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-teal-100" style={{ backgroundColor: '#dcfce7' }}>
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-teal-800">
              Onboarding Card Generator
            </h1>
            <Link 
              href="/"
              className="text-teal-700 hover:text-teal-900 flex items-center gap-2 font-medium"
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
              <h2 className="text-lg font-semibold mb-4 text-teal-800">Card Details</h2>
              
              <div className="space-y-3">
                {renderSearchInput()}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none"
                    placeholder="Enter your name"
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
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none"
                    placeholder="Enter your designation"
                  />
                </div>
                
                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                    Education
                  </label>
                  <input
                    type="text"
                    id="education"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none"
                    placeholder="Enter your education"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none"
                    placeholder="Enter your location"
                  />
              </div>
              
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>

                {renderManagerSearchInput()}

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none"
                    placeholder="Enter your focus area and description"
                  />
              </div>
              
                <div>
                  <label htmlFor="congrats-message" className="block text-sm font-medium text-gray-700 mb-1">
                    Welcome Message
                  </label>
                  <textarea
                    id="congrats-message"
                    value={congratsMessage}
                    onChange={(e) => setCongratsMessage(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none"
                    placeholder="Enter your welcome message"
                  />
                </div>
              </div>
            </div>
            
            <button
              id="download-button"
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-2 px-4 rounded-md font-medium transition-colors disabled:bg-gray-400"
              style={{
                backgroundColor: '#2F7B75',
                color: 'white'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#266460';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#2F7B75';
              }}
            >
              {downloading ? 'Generating...' : 'Download as Image'}
              </button>
          </div>

          {/* Preview Section */}
          <div className="w-full md:w-2/3">
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-teal-800">Preview</h2>
              <div ref={templateRef} data-preview="true" className="relative max-w-2xl mx-auto">
                <div className="aspect-[1/1.4] bg-white rounded-lg overflow-hidden shadow-lg relative">
                  {/* Header */}
                  <div className="bg-[#2F7B75] text-white p-8 text-center relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                      <div className="w-full h-full" style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }}></div>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">WELCOME</h1>
                    <h2 className="text-3xl font-semibold">ABOARD</h2>
                  </div>

                  {/* Main Content */}
                  <div className="p-8 flex flex-col h-[calc(100%-176px)]">
                    {/* Top Section with Profile */}
                    <div className="mb-4">
                      {renderProfileSection()}
                    </div>

                    {/* Spacer */}
                    <div className="flex-grow" />

                    {/* Bottom Fixed Section */}
                    <div>
                      {/* Info Icons */}
                      <div className="flex justify-center space-x-8 mb-2">
                        <div className="text-center w-24">
                          <div className="w-16 h-16 rounded-full bg-[#2F7B75] text-white flex items-center justify-center mb-3 mx-auto shadow-lg">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="relative">
                            <div className="text-sm text-gray-600 break-words min-h-[40px] flex items-center justify-center px-1">
                              <span className="line-clamp-2">
                                {designation || 'Designation'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center w-24">
                          <div className="w-16 h-16 rounded-full bg-[#2F7B75] text-white flex items-center justify-center mb-3 mx-auto shadow-lg">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="relative">
                            <div className="text-sm text-gray-600 break-words min-h-[40px] flex items-center justify-center px-1">
                              <span className="line-clamp-2">
                                {education || 'Education'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center w-24">
                          <div className="w-16 h-16 rounded-full bg-[#2F7B75] text-white flex items-center justify-center mb-3 mx-auto shadow-lg">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                          <div className="relative">
                            <div className="text-sm text-gray-600 break-words min-h-[40px] flex items-center justify-center px-1">
                              <span className="line-clamp-2">
                                {location || 'Location'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info with Ribbon Style */}
                      <div className="relative mb-6">
                        {/* Ribbon shadow */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-[85%] h-4 bg-black/10 blur-md rounded-full"></div>
                        
                        {/* Left fold */}
                        <div className="absolute left-[7%] h-[60px] w-[40px]" style={{
                          transform: 'skewY(15deg) translateY(-4px)',
                          transformOrigin: 'bottom right',
                          background: 'linear-gradient(to right bottom, #266460, #1d4d4a)',
                          boxShadow: '-2px 4px 6px rgba(0,0,0,0.2)'
                        }}></div>
                        
                        {/* Main ribbon */}
                        <div className="bg-[#2F7B75] mx-auto w-[85%] h-[60px] relative overflow-hidden shadow-lg">
                          {/* Shine effect */}
                          <div className="absolute -top-[40px] -left-[100px] w-[200%] h-[30px] rotate-45 opacity-20" style={{
                            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)',
                            animation: 'shimmer 8s infinite linear'
                          }}></div>

                          <div className="h-full flex items-center justify-center space-x-8 text-white">
                            <div className="flex items-center space-x-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm">{email || 'email@agnext.in'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="text-sm">{phone || '+91 XXXXXXXXXX'}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right fold */}
                        <div className="absolute right-[7%] h-[60px] w-[40px]" style={{
                          transform: 'skewY(-15deg) translateY(-4px)',
                          transformOrigin: 'bottom left',
                          background: 'linear-gradient(to left bottom, #266460, #1d4d4a)',
                          boxShadow: '2px 4px 6px rgba(0,0,0,0.2)'
                        }}></div>
                      </div>

                      {/* Welcome Message with Enhanced Styling */}
                      <div className="flex items-start space-x-4 bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-md relative mx-4 mb-4">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
                          backgroundImage: 'radial-gradient(circle, #2F7B75 1px, transparent 1px)',
                          backgroundSize: '20px 20px'
                        }}></div>
                        {renderSmallProfileSection()}
                        <div className="flex-1">
                          <p className="text-gray-600 italic text-sm relative">
                            <span className="text-[#2F7B75] text-lg mr-1">&ldquo;</span>
                            {congratsMessage}
                            <span className="text-[#2F7B75] text-lg ml-1">&rdquo;</span>
                          </p>
                        </div>
                      </div>
                    </div>
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