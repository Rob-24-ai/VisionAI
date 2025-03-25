import { useEffect, useRef } from 'react';

interface CaptionDisplayProps {
  text: string;
}

export default function CaptionDisplay({ text }: CaptionDisplayProps) {
  const captionRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the latest caption
  useEffect(() => {
    if (captionRef.current) {
      captionRef.current.scrollTop = captionRef.current.scrollHeight;
    }
  }, [text]);
  
  return (
    <div 
      ref={captionRef}
      className="w-full bg-gradient-to-t from-black/80 to-black/20 backdrop-blur-sm rounded-lg px-4 py-2 overflow-hidden pointer-events-none"
    >
      {text ? (
        <p className="text-white text-center text-base font-medium line-clamp-2 max-h-[3.5rem]">
          {text}
        </p>
      ) : (
        <p className="text-gray-400 text-center text-base italic">
          Waiting for response...
        </p>
      )}
    </div>
  );
}