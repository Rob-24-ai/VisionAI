import { useEffect, useRef } from "react";

interface CaptionDisplayProps {
  text: string;
}

export default function CaptionDisplay({ text }: CaptionDisplayProps) {
  const captionRef = useRef<HTMLParagraphElement>(null);
  
  // Scroll to the latest caption when text changes
  useEffect(() => {
    if (captionRef.current) {
      captionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [text]);

  // If no text is available, use a placeholder that indicates waiting
  const displayText = text || "Waiting for response...";

  return (
    <div className="absolute bottom-0 left-0 right-0 caption-container px-4 pb-6 pt-12">
      <div className="max-w-[95%] mx-auto bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3">
        <p 
          ref={captionRef}
          className="caption-text text-center text-white text-lg font-medium"
        >
          {displayText}
        </p>
      </div>
    </div>
  );
}
