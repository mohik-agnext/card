'use client';

import { useState } from 'react';
import Link from 'next/link';
import TemplateEditor from '../components/TemplateEditor';

// Default template fields
// const defaultFields = [ ... ];

interface TemplateField {
  id: string;
  type: 'text' | 'image' | 'date';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: string;
}

export default function TemplateDesignerPage() {
  const [templateUrl, setTemplateUrl] = useState('/placeholder-template.png');
  const [fields] = useState<TemplateField[]>([]);
  const [templateUploaded, setTemplateUploaded] = useState(false);
  const [savedFields, setSavedFields] = useState<TemplateField[]>([]);

  // Handle template upload
  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTemplateUrl(event.target.result as string);
          setTemplateUploaded(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle template URL input
  const handleTemplateUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateUrl(e.target.value);
    setTemplateUploaded(true);
  };

  // Handle field configuration save
  const handleSaveFields = (updatedFields: TemplateField[]) => {
    setSavedFields(updatedFields);
    alert('Template configuration saved successfully!');
  };

  // Remove unused event handlers if they're not being used
  // const handleDrop = (e: DragEvent) => { ... };
  // const handleDragOver = (e: DragEvent) => { ... };

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