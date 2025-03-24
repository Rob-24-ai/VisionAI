'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-dark-900">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Vision Bot</h1>
          <p className="text-lg text-gray-300">
            AI-powered visual conversation assistant
          </p>
        </div>
        
        <div className="space-y-4 pt-8">
          <Button 
            onClick={() => router.push('/vision-bot')}
            className="w-full py-6 text-lg bg-primary/90 hover:bg-primary transition-colors"
          >
            Start Conversation
          </Button>
          
          <p className="text-sm text-gray-400">
            Speak naturally with an AI that can see what you see
          </p>
        </div>
      </div>
    </div>
  );
}