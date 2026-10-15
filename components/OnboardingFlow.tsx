'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { EnhancedButton } from '@/components/EnhancedButton';
import { ChevronRight } from 'lucide-react';

interface OnboardingFlowProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingFlow({ open, onClose }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Reset to step 1 when modal opens
  useEffect(() => {
    if (open) {
      setCurrentStep(1);
    }
  }, [open]);

  if (!open) return null;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleClose = () => {
    console.log('🚪 OnboardingFlow: Closing and setting localStorage...');
    setCurrentStep(1);
    localStorage.setItem('bechdel_seen_onboarding', '1');
    console.log('💾 OnboardingFlow: localStorage set, calling onClose...');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-2 sm:p-4" onClick={handleClose}>
      <div
        className="max-w-4xl w-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-indigo-50 text-indigo-900 border border-black/10 p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step 1: What is the Bechdel Test? */}
        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">Test The Classics</h2>
            
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-center">
              {/* Left: Placeholder image */}
              <div className="w-full lg:w-1/2">
                <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden max-w-sm mx-auto lg:max-w-none">
                  <Image
                    src="/bechdel-illustration.png"
                    alt="Bechdel Test illustration"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
              
              {/* Right: Content */}
              <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">What is the Bechdel Test?</h3>
                <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed">
                  The Bechdel Test is a simple measure of gender representation in fiction. 
                  To pass, a work must feature at least two women who talk to each other 
                  about something other than a man. Created by cartoonist Alison Bechdel, 
                  it highlights how rarely women's stories and relationships are centered 
                  in popular media.
                </p>
                <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed">
  <strong>This should in no way be a measure of a movie's quality</strong>, it
  shows us common storytelling patterns across different eras of cinema.
</p>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-center sm:justify-end">
              <EnhancedButton variant="ghost" onClick={handleNext} className="flex items-center gap-2 text-sm sm:text-base">
                Next
                <ChevronRight className="w-4 h-4" />
              </EnhancedButton>
            </div>
          </div>
        )}

        {/* Step 2: The Four Ratings */}
        {currentStep === 2 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center space-y-1 sm:space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">The Four Ratings</h2>
              <p className="text-gray-600 font-medium text-sm sm:text-base md:text-lg">There are 4 ratings for every movie that exists.</p>
            </div>
            
            {/* Rating images and captions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 border-red-200">
                  <Image
                    src="/rating-0.png"
                    alt="Bechdel Test Rating 0"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 px-1">
                  <div className="text-xs sm:text-sm text-gray-700 font-medium leading-tight">No two women ever share the screen.</div>
                </div>
              </div>
              
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 border-yellow-200">
                  <Image
                    src="/rating-1.png"
                    alt="Bechdel Test Rating 1"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 px-1">
                  <div className="text-xs sm:text-sm text-gray-700 font-medium leading-tight">Two women appear, but never speak to each other.</div>
                </div>
              </div>
              
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 border-pink-200">
                  <Image
                    src="/rating-2.png"
                    alt="Bechdel Test Rating 2"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 px-1">
                  <div className="text-xs sm:text-sm text-gray-700 font-medium leading-tight">They talk — mostly about him.</div>
                </div>
              </div>
              
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 border-emerald-200">
                  <Image
                    src="/rating-3.png"
                    alt="Bechdel Test Rating 3"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 px-1">
                  <div className="text-xs sm:text-sm text-gray-700 font-medium leading-tight">They talk — and it's not about men.</div>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-center sm:justify-end">
              <EnhancedButton variant="ghost" onClick={handleNext} className="flex items-center gap-2 text-sm sm:text-base">
                Next
                <ChevronRight className="w-4 h-4" />
              </EnhancedButton>
            </div>
          </div>
        )}

        {/* Step 3: How To Play */}
        {currentStep === 3 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How To Play</h2>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base md:text-lg text-gray-700 font-medium">
                  <li>Scan the title & poster.</li>
                  <li>Pick a rating (0–3).</li>
                  <li>See the AI "rating poster" + scoring, then go to the next film.</li>
                </ol>
              </div>
              
              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200">
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  <strong>Shortcuts:</strong> <kbd className="px-1 sm:px-2 py-1 bg-gradient-to-br from-white to-indigo-50 rounded border text-xs sm:text-sm">0</kbd>–<kbd className="px-1 sm:px-2 py-1 bg-gradient-to-br from-white to-indigo-50 rounded border text-xs sm:text-sm">3</kbd> to guess, <kbd className="px-1 sm:px-2 py-1 bg-gradient-to-br from-white to-indigo-50 rounded border text-xs sm:text-sm">N</kbd> for next.
                </p>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-center">
              <EnhancedButton variant="gradient" onClick={handleClose} size="lg" className="px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg">
                Let's Play
              </EnhancedButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}