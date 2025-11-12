import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Collection } from '../types/collection';
import CollectionForm from '../components/collectionForm';
import CollectionList from '../components/collectionList';

const Collections = () => {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: '1',
      name: 'French Basics',
      description: 'Essential French phrases for beginners',
      tags: ['French', 'Beginner', 'Greetings'],
      status: 'public',
      owner: 'You',
      sharedWith: [],
      flashcards: [
        { id: '1', term: 'Bonjour', definition: 'Hello' },
        { id: '2', term: 'Au revoir', definition: 'Goodbye' },
        { id: '3', term: 'Merci', definition: 'Thank you' },
        { id: '4', term: "S'il vous plaît", definition: 'Please' },
      ],
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Spanish Travel',
      description: 'Useful Spanish phrases for traveling',
      tags: ['Spanish', 'Travel', 'Intermediate'],
      status: 'private',
      owner: 'You',
      sharedWith: [],
      flashcards: [
        { id: '1', term: '¿Dónde está el baño?', definition: 'Where is the bathroom?' },
        { id: '2', term: '¿Cuánto cuesta?', definition: 'How much does it cost?' },
        { id: '3', term: 'Una mesa para dos', definition: 'A table for two' },
      ],
      createdAt: new Date(),
    },
    {
      id: '3',
      name: 'Business English',
      description: 'Professional English vocabulary and expressions',
      tags: ['English', 'Business', 'Advanced'],
      status: 'shared',
      owner: 'You',
      sharedWith: ['john@example.com', 'sarah@example.com'],
      flashcards: [
        {
          id: '1',
          term: 'Deadline',
          definition: 'The latest time by which something must be completed',
        },
        {
          id: '2',
          term: 'Stakeholder',
          definition: 'A person with an interest in a business or project',
        },
      ],
      createdAt: new Date(),
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const handleAddCollection = (collection: Omit<Collection, 'id' | 'createdAt' | 'owner'>) => {
    const newCollection: Collection = {
      ...collection,
      id: Date.now().toString(),
      owner: 'You',
      createdAt: new Date(),
    };
    setCollections([...collections, newCollection]);
    setIsFormOpen(false);
  };

  const handleEditCollection = (collection: Omit<Collection, 'id' | 'createdAt' | 'owner'>) => {
    if (editingCollection) {
      setCollections(
        collections.map((c) => (c.id === editingCollection.id ? { ...c, ...collection } : c)),
      );
      setEditingCollection(null);
      setIsFormOpen(false);
    }
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(collections.filter((c) => c.id !== id));
  };

  const handleEditClick = (collection: Collection) => {
    setEditingCollection(collection);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCollection(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <FolderOpen className="w-8 h-8 text-primary" />
                My Collections
              </h1>
              <p className="text-muted-foreground mt-1">
                Organize your flashcards into collections
              </p>
            </div>
            <Button onClick={() => setIsFormOpen(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Collection
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Total Collections</div>
              <div className="text-3xl font-bold text-foreground">{collections.length}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Total Flashcards</div>
              <div className="text-3xl font-bold text-foreground">
                {collections.reduce((sum, c) => sum + c.flashcards.length, 0)}
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Public</div>
              <div className="text-3xl font-bold text-primary">
                {collections.filter((c) => c.status === 'public').length}
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Shared</div>
              <div className="text-3xl font-bold text-accent">
                {collections.filter((c) => c.status === 'shared').length}
              </div>
            </Card>
          </div>

          {/* Form */}
          {isFormOpen && (
            <Card className="p-6">
              <CollectionForm
                onSubmit={editingCollection ? handleEditCollection : handleAddCollection}
                onCancel={handleCloseForm}
                initialData={editingCollection || undefined}
                isEditing={!!editingCollection}
              />
            </Card>
          )}

          {/* List */}
          <CollectionList
            collections={collections}
            onEdit={handleEditClick}
            onDelete={handleDeleteCollection}
          />
        </div>
      </div>
    </div>
  );
};

export default Collections;
