import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, Users, Lock, Globe } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Collection } from '../types/collection';
import { useToast } from '@/shared/hooks/useToast';

interface CollectionListProps {
  collections: Collection[];
  onEdit: (collection: Collection) => void;
  onDelete: (id: string) => void;
}

const CollectionList = ({ collections, onEdit, onDelete }: CollectionListProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
      toast('Collection deleted');
    }
  };

  const getStatusIcon = (status: Collection['status']) => {
    switch (status) {
      case 'public':
        return <Globe className="w-4 h-4 text-primary" />;
      case 'shared':
        return <Users className="w-4 h-4 text-accent" />;
      case 'private':
        return <Lock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: Collection['status']) => {
    switch (status) {
      case 'public':
        return 'Public';
      case 'shared':
        return 'Shared';
      case 'private':
        return 'Private';
    }
  };

  if (collections.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          No collections yet. Create your first collection to get started!
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Card key={collection.id} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-foreground">{collection.name}</h3>
                <div className="flex items-center gap-1 text-sm">
                  {getStatusIcon(collection.status)}
                  <span className="text-muted-foreground">{getStatusText(collection.status)}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">{collection.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {collection.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-border">
              <div className="text-sm text-muted-foreground">
                {collection.flashcards.length} flashcards
              </div>
            </div>

            {collection.status === 'shared' && collection.sharedWith.length > 0 && (
              <div className="pt-2 text-sm">
                <span className="text-muted-foreground">Shared with: </span>
                <span className="text-foreground">{collection.sharedWith.join(', ')}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => navigate(`/collections/${collection.id}`)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(collection)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleteId(collection.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this collection and all its flashcards. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CollectionList;
