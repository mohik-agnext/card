import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

type TemplateField = {
  id: string;
  type: 'text' | 'image' | 'date';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: string;
};

type TemplateEditorProps = {
  templateUrl: string;
  fields: TemplateField[];
  onSave: (fields: TemplateField[]) => void;
};

export default function TemplateEditor({ templateUrl, fields: initialFields, onSave }: TemplateEditorProps) {
  const [fields, setFields] = useState<TemplateField[]>(initialFields);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [templateDimensions, setTemplateDimensions] = useState({ width: 0, height: 0 });
  
  const templateRef = useRef<HTMLDivElement>(null);

  // Handle image load
  const handleImageLoad = (event: any) => {
    setImageLoaded(true);
    setTemplateDimensions({
      width: event.target.naturalWidth,
      height: event.target.naturalHeight
    });
  };

  // Handle field selection
  const handleFieldSelect = (id: string) => {
    setSelectedField(id);
  };

  // Start dragging a field
  const handleDragStart = (id: string, e: React.MouseEvent) => {
    if (!templateRef.current) return;
    
    const field = fields.find(f => f.id === id);
    if (!field) return;
    
    const rect = templateRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - field.x;
    const offsetY = e.clientY - rect.top - field.y;
    
    setDraggedField(id);
    setDragOffset({ x: offsetX, y: offsetY });
    setSelectedField(id);
  };

  // Handle dragging
  const handleDrag = (e: React.MouseEvent) => {
    if (!draggedField || !templateRef.current) return;
    
    const rect = templateRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 50));
    const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 20));
    
    setFields(fields.map(field => 
      field.id === draggedField ? { ...field, x, y } : field
    ));
  };

  // End dragging
  const handleDragEnd = () => {
    setDraggedField(null);
  };

  // Update field value
  const handleFieldValueChange = (id: string, value: string) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, value } : field
    ));
  };

  // Save template configuration
  const handleSave = () => {
    onSave(fields);
  };

  useEffect(() => {
    if (draggedField) {
      const handleMouseMove = (e: MouseEvent) => {
        if (!templateRef.current) return;
        
        const rect = templateRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 50));
        const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 20));
        
        setFields(fields.map(field => 
          field.id === draggedField ? { ...field, x, y } : field
        ));
      };
      
      const handleMouseUp = () => {
        setDraggedField(null);
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedField, dragOffset, fields]);

  return (
    <div className="w-full flex flex-col">
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Template Editor</h2>
        <p className="text-sm text-gray-600 mb-4">Drag fields to position them on the template. Click a field to edit its properties.</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {fields.map(field => (
            <button
              key={field.id}
              className={`px-3 py-1 text-sm rounded ${selectedField === field.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => handleFieldSelect(field.id)}
            >
              {field.label}
            </button>
          ))}
        </div>
        
        {selectedField && (
          <div className="mb-4 p-3 border rounded">
            <h3 className="font-medium mb-2">{fields.find(f => f.id === selectedField)?.label}</h3>
            <div className="grid gap-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Value</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={fields.find(f => f.id === selectedField)?.value || ''}
                  onChange={(e) => handleFieldValueChange(selectedField, e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">X Position</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={Math.round(fields.find(f => f.id === selectedField)?.x || 0)}
                    onChange={(e) => {
                      const x = parseInt(e.target.value);
                      if (!isNaN(x)) {
                        setFields(fields.map(field => 
                          field.id === selectedField ? { ...field, x } : field
                        ));
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Y Position</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={Math.round(fields.find(f => f.id === selectedField)?.y || 0)}
                    onChange={(e) => {
                      const y = parseInt(e.target.value);
                      if (!isNaN(y)) {
                        setFields(fields.map(field => 
                          field.id === selectedField ? { ...field, y } : field
                        ));
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          Save Template
        </button>
      </div>
      
      <div className="relative bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Template Preview</h2>
        <div 
          ref={templateRef}
          className="relative border rounded overflow-hidden" 
          style={{ 
            width: '100%', 
            height: templateDimensions.height ? `${templateDimensions.height}px` : 'auto',
            maxHeight: '600px'
          }}
        >
          {/* Template Background */}
          <img 
            src={templateUrl} 
            alt="Template" 
            className="w-full h-auto"
            onLoad={handleImageLoad}
          />
          
          {/* Template Fields */}
          {imageLoaded && fields.map(field => (
            <div
              key={field.id}
              className={`absolute cursor-move ${selectedField === field.id ? 'ring-2 ring-blue-500' : ''}`}
              style={{
                left: `${field.x}px`,
                top: `${field.y}px`,
                width: field.width ? `${field.width}px` : 'auto',
                height: field.height ? `${field.height}px` : 'auto',
              }}
              onMouseDown={(e) => handleDragStart(field.id, e)}
            >
              {field.type === 'text' && (
                <div className="p-1 bg-white bg-opacity-75 rounded">
                  {field.value || field.label}
                </div>
              )}
              {field.type === 'image' && (
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-full">
                  {field.value ? (
                    <img src={field.value} alt="User" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-xs text-gray-500">Photo</span>
                  )}
                </div>
              )}
              {field.type === 'date' && (
                <div className="p-1 bg-white bg-opacity-75 rounded">
                  {field.value || 'MM/DD/YYYY'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 