'use client';

import { useEffect, useRef, useState } from 'react';

interface CaptionDisplayProps {
  text: string;
}

export default function CaptionDisplay({ text }: CaptionDisplayProps) {
  const captionRef = useRef<HTMLDivElement>(null);
  const [showCaption, setShowCaption] = useState(false);
  
  useEffect(() => {
    // Show caption with a small delay when text is available
    if (text) {
      setShowCaption(true);
    } else {
      // Hide caption when text is empty
      setShowCaption(false);
    }
  }, [text]);
  
  return (
    <div className={`absolute bottom-0 left-0 right-0 z-10 caption-container transition-opacity duration-300 ${showCaption ? 'opacity-100' : 'opacity-0'}`}>
      <div ref={captionRef} className="p-5 pb-7 caption-text">
        <p className="text-white text-center text-lg font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}