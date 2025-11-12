import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Flashcard } from '../types/flashcard';
type FlashcardPracticeProps = {
  flashcards: Flashcard[];
};

const FlashcardPractice = ({ flashcards }: FlashcardPracticeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (flashcards.length === 0) {
    return (
      <Card className="p-12 text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">No flashcards available</h3>
        <p className="text-muted-foreground">Add some flashcards to start practicing!</p>
      </Card>
    );
  }

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Practice Mode</h2>
          <p className="text-muted-foreground">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
        </div>
        {/* <div className="flex flex-col items-end gap-1">
          <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
            {currentCard.language}
          </div>
          <div className="text-xs text-muted-foreground">{currentCard.category}</div>
        </div> */}
      </div>

      <div className="perspective-1000">
        <Card
          onClick={handleFlip}
          className={cn(
            'relative h-80 cursor-pointer transition-all duration-500 transform-gpu',
            'hover:shadow-lg',
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center p-8 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center space-y-4">
              <p className="text-4xl font-bold text-foreground">{currentCard.term}</p>
              <p className="text-muted-foreground">Click to reveal</p>
            </div>
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center p-8 bg-primary text-primary-foreground backface-hidden rounded-lg"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-center space-y-4">
              <p className="text-4xl font-bold">{currentCard.definition}</p>
              <p className="text-primary-foreground/80">Click to flip back</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" size="lg" onClick={handlePrevious} disabled={currentIndex === 0}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        <Button variant="ghost" size="lg" onClick={handleFlip}>
          <RotateCcw className="w-5 h-5 mr-2" />
          Flip Card
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
        >
          Next
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <div className="flex gap-2 justify-center pt-4">
        {flashcards.map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-2 rounded-full transition-all',
              index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-border',
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardPractice;
