"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Text } from 'react-konva';
import useImage from 'use-image';

interface BBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

interface SketchEditorProps {
  imageUrl?: string | null;
  detectedObjects?: any[];
}

export default function SketchEditor({ imageUrl, detectedObjects = [] }: SketchEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [image] = useImage(imageUrl || '');

  // Update canvas size to match container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate image scale to fit canvas
  const getScale = () => {
    if (!image) return 1;
    const scaleX = dimensions.width / image.width;
    const scaleY = dimensions.height / image.height;
    // Fit within the container while maintaining aspect ratio
    return Math.min(scaleX, scaleY) * 0.9; 
  };

  const scale = getScale();
  const imageX = image ? (dimensions.width - image.width * scale) / 2 : 0;
  const imageY = image ? (dimensions.height - image.height * scale) / 2 : 0;

  return (
    <div ref={containerRef} className="w-full h-full relative bg-slate-50">
      {imageUrl ? (
        <Stage width={dimensions.width} height={dimensions.height}>
          <Layer>
            {image && (
              <KonvaImage
                image={image}
                x={imageX}
                y={imageY}
                scaleX={scale}
                scaleY={scale}
              />
            )}
            
            {/* Draw Bounding Boxes for detected objects */}
            {detectedObjects.map((obj, i) => {
              // Convert actual bbox [x1, y1, x2, y2] to Konva coordinates [x, y, width, height]
              // Note: our mock bbox is [x1, y1, x2, y2]. Here we scale it.
              const x1 = obj.bbox[0];
              const y1 = obj.bbox[1];
              const x2 = obj.bbox[2];
              const y2 = obj.bbox[3];
              
              const kx = imageX + (x1 * scale);
              const ky = imageY + (y1 * scale);
              const kw = (x2 - x1) * scale;
              const kh = (y2 - y1) * scale;
              
              const isLocked = obj.locked;
              const strokeColor = isLocked ? "#f43f5e" : "#6366f1"; // rose for locked, indigo for normal
              
              return (
                <React.Fragment key={obj.id}>
                  <Rect
                    x={kx}
                    y={ky}
                    width={kw}
                    height={kh}
                    stroke={strokeColor}
                    strokeWidth={2}
                    dash={isLocked ? [] : [4, 4]}
                    fill={`${strokeColor}1A`} // 10% opacity
                  />
                  <Rect
                    x={kx}
                    y={ky - 24}
                    width={Math.max(obj.label.length * 8 + 20, 60)}
                    height={24}
                    fill={strokeColor}
                    cornerRadius={[4, 4, 0, 0]}
                  />
                  <Text
                    x={kx + 8}
                    y={ky - 18}
                    text={`${obj.label} ${isLocked ? '(Locked)' : ''}`}
                    fill="white"
                    fontSize={12}
                    fontFamily="Inter, sans-serif"
                    fontStyle="bold"
                  />
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-slate-400">Upload an image to start the interactive editor.</p>
        </div>
      )}
    </div>
  );
}
