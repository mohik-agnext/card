'use client';

import { useState } from 'react';
import Link from 'next/link';
import TemplateEditor from '../components/TemplateEditor';

// Default template fields
const defaultFields = [
  {
    id: 'name',
    type: 'text' as const,
    label: 'Name',
    x: 150,
    y: 100,
    width: 200,
    height: 30,
    value: 'John Doe'
  },
  {
    id: 'photo',
    type: 'image' as const,
    label: 'Photo',
    x: 50,
    y: 100,
    width: 80,
    height: 80,
    value: ''
  },
  {
    id: 'mobile',
    type: 'text' as const,
    label: 'Mobile Number',
    x: 150,
    y: 140,
    width: 200,
    height: 30,
    value: '+1 (555) 123-4567'
  },
  {
    id: 'designation',
    type: 'text' as const,
    label: 'Designation',
    x: 150,
    y: 180,
    width: 200,
    height: 30,
    value: 'Software Engineer'
  },
  {
    id: 'date',
    type: 'date' as const,
    label: 'Date',
    x: 300,
    y: 220,
    width: 120,
    height: 30,
    value: '05/15/2023'
  }
];

export default function TemplateDesignerPage() {
  const [templateUrl, setTemplateUrl] = useState('/placeholder-template.png');
  const [fields, setFields] = useState(defaultFields);
  const [templateUploaded, setTemplateUploaded] = useState(false);
  const [savedFields, setSavedFields] = useState<any[]>([]);

  // Handle template upload
  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTemplateUrl(url);
      setTemplateUploaded(true);
    }
  };

  // Handle template URL input
  const handleTemplateUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateUrl(e.target.value);
    setTemplateUploaded(true);
  };

  // Handle field configuration save
  const handleSaveFields = (updatedFields: any[]) => {
    setSavedFields(updatedFields);
    alert('Template configuration saved successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Template Designer</h1>
          <Link href="/" className="bg-white text-gray-800 px-3 py-1 rounded hover:bg-gray-100">
            Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Your Template</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg mb-2">Option 1: Upload PNG File</h3>
              <input 
                type="file" 
                accept="image/png" 
                className="w-full border rounded p-2"
                onChange={handleTemplateUpload}
              />
            </div>
            <div>
              <h3 className="text-lg mb-2">Option 2: Provide Image URL</h3>
              <input 
                type="text" 
                className="w-full border rounded p-2"
                placeholder="https://example.com/template.png"
                value={templateUrl === '/placeholder-template.png' ? '' : templateUrl}
                onChange={handleTemplateUrlInput}
              />
            </div>
          </div>
        </div>

        {templateUploaded && (
          <TemplateEditor 
            templateUrl={templateUrl} 
            fields={fields}
            onSave={handleSaveFields}
          />
        )}

        {!templateUploaded && (
          <div className="text-center p-10 bg-gray-100 rounded-lg">
            <p className="text-lg text-gray-600">Upload a template to begin designing</p>
          </div>
        )}

        {savedFields.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Saved Configuration</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(savedFields, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
} 