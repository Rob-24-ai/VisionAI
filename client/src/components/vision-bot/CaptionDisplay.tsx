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

  return (
    <div className="absolute bottom-0 left-0 right-0 caption-container px-4 pb-4 pt-10">
      <p 
        ref={captionRef}
        className="caption-text text-center text-white text-lg font-medium"
      >
        {text || "Waiting for response..."}
      </p>
    </div>
  );
}
