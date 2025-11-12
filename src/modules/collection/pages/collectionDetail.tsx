import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, BookOpen, Play } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Flashcard } from '@/modules/flashcard/types/flashcard';
import FlashcardPractice from '@/modules/flashcard/components/flashcardPractice';
import FlashcardForm from '@/modules/flashcard/components/flashcardForm';
import FlashcardList from '@/modules/flashcard/components/flashcardList';

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Demo collection data
  const collection = {
    id: id,
    name: 'French Basics',
    description: 'Essential French phrases for beginners',
    tags: ['French', 'Beginner', 'Greetings'],
    status: 'public' as const,
    owner: 'You',
    sharedWith: [],
  };

  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: '1',
      term: 'Hello',
      definition: 'Bonjour',
    },
    {
      id: '2',
      term: 'Thank you',
      definition: 'Merci',
    },
    {
      id: '3',
      term: 'Good morning',
      definition: 'Bonjour',
    },
    {
      id: '4',
      term: 'Goodbye',
      definition: 'Au revoir',
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  const handleAddCard = (card: Omit<Flashcard, 'id' | 'createdAt'>) => {
    const newCard: Flashcard = {
      ...card,
      id: Date.now().toString(),
      // createdAt: new Date(),
    };
    setFlashcards([...flashcards, newCard]);
    setIsFormOpen(false);
  };

  const handleEditCard = (card: Omit<Flashcard, 'id' | 'createdAt'>) => {
    if (editingCard) {
      setFlashcards(flashcards.map((c) => (c.id === editingCard.id ? { ...c, ...card } : c)));
      setEditingCard(null);
      setIsFormOpen(false);
    }
  };

  const handleDeleteCard = (id: string) => {
    setFlashcards(flashcards.filter((c) => c.id !== id));
  };

  const handleEditClick = (card: Flashcard) => {
    setEditingCard(card);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCard(null);
  };

  // Quiz data
  const quizQuestions = flashcards.map((card, index) => ({
    id: `q${index + 1}`,
    question: `What is the translation of "${card.term}"?`,
    options: [
      card.definition,
      index > 0 ? flashcards[index - 1].definition : 'Salut',
      index < flashcards.length - 1 ? flashcards[index + 1].definition : 'Bonsoir',
      'Je ne sais pas',
    ].sort(() => Math.random() - 0.5),
    correctAnswer: card.definition,
  }));

  if (isPracticeMode) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => setIsPracticeMode(false)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collection
          </Button>
          <FlashcardPractice flashcards={flashcards} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <Button variant="ghost" onClick={() => navigate('/collections')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collections
            </Button>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{collection.name}</h1>
                <p className="text-muted-foreground mt-1">{collection.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {collection.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsPracticeMode(true)}
                  variant="outline"
                  size="lg"
                  disabled={flashcards.length === 0}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Practice
                </Button>
                <Button onClick={() => setIsFormOpen(true)} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Card
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Total Cards</div>
              <div className="text-3xl font-bold text-foreground">{flashcards.length}</div>
            </Card>
            {/* <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Languages</div>
              <div className="text-3xl font-bold text-primary">
                {new Set(flashcards.map((c) => c.language)).size}
              </div>
            </Card> */}
            {/* <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Categories</div>
              <div className="text-3xl font-bold text-accent">
                {new Set(flashcards.map((c) => c.category)).size}
              </div>
            </Card> */}
          </div>

          {/* Form */}
          {isFormOpen && (
            <Card className="p-6">
              <FlashcardForm
                onSubmit={editingCard ? handleEditCard : handleAddCard}
                onCancel={handleCloseForm}
                initialData={editingCard || undefined}
                isEditing={!!editingCard}
              />
            </Card>
          )}

          {/* Tabs */}
          <Tabs defaultValue="flashcards" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
            </TabsList>

            <TabsContent value="flashcards" className="space-y-4">
              <FlashcardList
                flashcards={flashcards}
                onEdit={handleEditClick}
                onDelete={handleDeleteCard}
              />
            </TabsContent>

            <TabsContent value="quiz" className="space-y-4">
              {flashcards.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    Add some flashcards to start taking quizzes!
                  </p>
                </Card>
              ) : (
                <Card className="p-12 text-center space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Ready to Test Your Knowledge?
                    </h2>
                    <p className="text-muted-foreground">
                      {quizQuestions.length} questions waiting for you
                    </p>
                  </div>
                  <Link to={`/collections/${id}/quiz`} state={{ flashcards: flashcards }}>
                    <Button size="lg">
                      <Play className="w-5 h-5 mr-2" />
                      Start Quiz
                    </Button>
                  </Link>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
