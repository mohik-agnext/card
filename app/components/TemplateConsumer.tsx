import React, { useState, useRef, useEffect, useCallback } from 'react';
import NextImage from "next/image";

interface TemplateField {
  id: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  value: string;
}

interface TemplateConsumerProps {
  templateUrl: string;
  fields: TemplateField[];
  onFieldChange: (id: string, value: string) => void;
}

export default function TemplateConsumer({ templateUrl, fields, onFieldChange }: TemplateConsumerProps) {
  const [isTemplateLoaded, setIsTemplateLoaded] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = useCallback(() => {
    setIsTemplateLoaded(true);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = handleImageLoad;
    img.src = templateUrl;
  }, [templateUrl, handleImageLoad]);

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full">
        {/* Template Background Image */}
        <NextImage
          src={templateUrl}
          alt="Template"
          layout="fill"
          objectFit="contain"
          onLoad={handleImageLoad}
          crossOrigin="anonymous"
          unoptimized
        />
        
        {/* Template Fields */}
        {isTemplateLoaded && (
          <div className="absolute top-0 left-0 w-full h-full">
            {fields.map(field => (
              <div
                key={field.id}
                style={{
                  position: 'absolute',
                  left: `${field.x}px`,
                  top: `${field.y}px`,
                  width: field.width ? `${field.width}px` : 'auto',
                  height: field.height ? `${field.height}px` : 'auto',
                }}
              >
                {field.type === 'text' ? (
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => onFieldChange(field.id, e.target.value)}
                    className="border p-1"
                  />
                ) : (
                  <NextImage
                    src={field.value}
                    alt="Field"
                    width={field.width || 100}
                    height={field.height || 100}
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 