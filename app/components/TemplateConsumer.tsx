import { useState, useEffect, useRef } from 'react';

type TemplateField = {
  id: string;
  type: 'text' | 'image' | 'date';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: string;
  editable?: boolean;
};

type TemplateConsumerProps = {
  templateUrl: string;
  templateConfig: TemplateField[];
  userData: Record<string, string>;
  onImageLoad?: () => void;
  onImageError?: () => void;
};

export default function TemplateConsumer({ 
  templateUrl, 
  templateConfig, 
  userData,
  onImageLoad,
  onImageError
}: TemplateConsumerProps) {
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [templateDimensions, setTemplateDimensions] = useState({ width: 1080, height: 1080 });
  const imgRef = useRef<HTMLImageElement>(null);

  // Apply user data to template fields
  useEffect(() => {
    const updatedFields = templateConfig.map(field => {
      // Only apply user data to editable fields
      if (field.editable !== false && userData[field.id]) {
        return {
          ...field,
          value: userData[field.id]
        };
      }
      return field;
    });
    
    setFields(updatedFields);
  }, [templateConfig, userData]);

  // Reset loading state when template URL changes
  useEffect(() => {
    console.log("Template URL changed to:", templateUrl);
    setImageLoaded(false);
    
    // Pre-load data URL templates
    if (templateUrl.startsWith('data:')) {
      console.log("Using data URL template, pre-setting dimensions");
      // For data URLs, we can assume they're loaded immediately
      setTimeout(() => {
        setImageLoaded(true);
        if (onImageLoad) onImageLoad();
      }, 100);
    }
  }, [templateUrl, onImageLoad]);

  // Check if the image is already loaded when component mounts
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      console.log("Image was already complete on mount");
      handleImageLoad({ target: imgRef.current });
    }
  }, []);

  // Handle image load
  const handleImageLoad = (event: any) => {
    console.log("Template image loaded successfully with dimensions:", 
      event.target.naturalWidth, "x", event.target.naturalHeight);
    
    setImageLoaded(true);
    setTemplateDimensions({
      width: event.target.naturalWidth || 1080,
      height: event.target.naturalHeight || 1080
    });
    
    if (onImageLoad) {
      onImageLoad();
    }
  };

  // Handle image error
  const handleImageError = (e: any) => {
    console.error("Failed to load template image in TemplateConsumer:", e.target.src);
    if (onImageError) {
      onImageError();
    }
  };

  // Get field specific styling
  const getFieldStyles = (field: TemplateField) => {
    // Calculate the scale ratio for responsive sizing
    const scaleFactor = 1080 / templateDimensions.width;
    
    // Base styles
    const styles: any = {
      position: 'absolute',
      left: `${field.x / scaleFactor}px`,
      top: `${field.y / scaleFactor}px`,
      width: field.width ? `${field.width / scaleFactor}px` : 'auto',
      height: field.height ? `${field.height / scaleFactor}px` : 'auto',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      pointerEvents: 'none',
    };

    // Special handling for specific fields
    if (field.id === 'years') {
      styles.fontSize = `${110 / scaleFactor}px`;
      styles.fontWeight = 'bold';
      styles.color = 'white';
      styles.fontFamily = 'serif, cursive';
      styles.lineHeight = '1';
      styles.textShadow = '2px 2px 4px rgba(0,0,0,0.2)';
    }
    
    if (field.id === 'name') {
      styles.fontSize = `${40 / scaleFactor}px`;
      styles.fontWeight = 'bold';
      styles.color = 'white';
      styles.fontFamily = 'serif, sans-serif';
      styles.width = '100%';
      styles.maxWidth = `${field.width / scaleFactor}px`;
      styles.textShadow = '1px 1px 2px rgba(0,0,0,0.1)';
      styles.textTransform = 'uppercase';
      styles.letterSpacing = '1px';
    }
    
    if (field.id === 'message') {
      styles.fontSize = `${18 / scaleFactor}px`;
      styles.color = 'white';
      styles.fontFamily = 'sans-serif';
      styles.left = `${(field.x - field.width/2) / scaleFactor}px`; // Center the text
      styles.width = `${field.width / scaleFactor}px`;
      styles.lineHeight = '1.4';
      styles.transform = '';
    }
    
    return styles;
  };

  return (
    <div className="relative w-full max-w-full">
      <div 
        className="relative"
        style={{ 
          width: '100%', 
          paddingBottom: '100%', // Creates a 1:1 aspect ratio
          overflow: 'hidden',
          backgroundColor: '#f5f5f5', // Light background to show while loading
        }}
      >
        {/* Template Background Image */}
        <img 
          ref={imgRef}
          src={templateUrl} 
          alt="Template" 
          className="absolute top-0 left-0 w-full h-full object-contain"
          onLoad={handleImageLoad}
          onError={handleImageError}
          crossOrigin="anonymous"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
        
        {/* Template Fields */}
        {imageLoaded && (
          <div className="absolute top-0 left-0 w-full h-full">
            {fields.map(field => (
              <div
                key={field.id}
                style={getFieldStyles(field)}
                className={field.editable ? "editable-field" : ""}
              >
                {field.type === 'text' && (
                  <div>
                    {field.value || field.label}
                  </div>
                )}
                {field.type === 'image' && (
                  <div className="w-full h-full flex items-center justify-center overflow-hidden" style={{ borderRadius: '50%' }}>
                    {field.value ? (
                      <img 
                        src={field.value} 
                        alt="User" 
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error("Failed to load user image:", field.value);
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 24 24' fill='none' stroke='%23666666' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-1/2 w-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
                {field.type === 'date' && (
                  <div>
                    {field.value || 'MM/DD/YYYY'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 