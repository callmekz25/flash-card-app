export type Collection = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  status: 'private' | 'public' | 'shared';
  owner: string;
  sharedWith: string[];
  flashcards: Flashcard[];
  createdAt: Date;
};
