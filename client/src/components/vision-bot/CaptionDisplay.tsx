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
    <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-36 px-4 pointer-events-none">
      <div 
        ref={captionRef}
        className="max-w-md w-full bg-gradient-to-t from-black/80 to-black/20 backdrop-blur-sm rounded-lg px-4 py-3 overflow-hidden"
      >
        {text ? (
          <p className="text-white text-center text-lg font-medium line-clamp-2 max-h-[4rem]">
            {text}
          </p>
        ) : (
          <p className="text-gray-400 text-center text-lg italic">
            Waiting for response...
          </p>
        )}
      </div>
    </div>
  );
}