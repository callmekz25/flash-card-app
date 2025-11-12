import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus, Upload } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/shared/hooks/useToast';
import type { Flashcard } from '@/modules/flashcard/types/flashcard';
import type { Collection } from '../types/collection';

const collectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500),
  tags: z.array(z.string()),
  status: z.enum(['private', 'public', 'shared']),
  sharedWith: z.array(z.string().email()),
  flashcards: z.array(
    z.object({
      id: z.string(),
      term: z.string(),
      definition: z.string(),
    }),
  ),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

type CollectionFormProps = {
  onSubmit: (data: CollectionFormData) => void;
  onCancel: () => void;
  initialData?: Collection;
  isEditing?: boolean;
};

const CollectionForm = ({ onSubmit, onCancel, initialData, isEditing }: CollectionFormProps) => {
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [sharedWith, setSharedWith] = useState<string[]>(initialData?.sharedWith || []);
  const [emailInput, setEmailInput] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialData?.flashcards || []);
  const [termInput, setTermInput] = useState('');
  const [definitionInput, setDefinitionInput] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [termDefDelimiter, setTermDefDelimiter] = useState<'tab' | 'comma' | 'custom'>('tab');
  const [customDelimiter, setCustomDelimiter] = useState(':');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      tags: initialData?.tags || [],
      status: initialData?.status || 'private',
      sharedWith: initialData?.sharedWith || [],
      flashcards: initialData?.flashcards || [],
    },
  });

  const status = watch('status');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const handleAddEmail = () => {
    if (emailInput.trim() && !sharedWith.includes(emailInput.trim())) {
      const newEmails = [...sharedWith, emailInput.trim()];
      setSharedWith(newEmails);
      setValue('sharedWith', newEmails);
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    const newEmails = sharedWith.filter((e) => e !== email);
    setSharedWith(newEmails);
    setValue('sharedWith', newEmails);
  };

  const handleAddFlashcard = () => {
    if (termInput.trim() && definitionInput.trim()) {
      const newFlashcard: Flashcard = {
        id: Date.now().toString(),
        term: termInput.trim(),
        definition: definitionInput.trim(),
      };
      const newFlashcards = [...flashcards, newFlashcard];
      setFlashcards(newFlashcards);
      setValue('flashcards', newFlashcards);
      setTermInput('');
      setDefinitionInput('');
      toast('Flashcard added');
    }
  };

  const handleRemoveFlashcard = (id: string) => {
    const newFlashcards = flashcards.filter((f) => f.id !== id);
    setFlashcards(newFlashcards);
    setValue('flashcards', newFlashcards);
  };

  const handleBulkImport = () => {
    if (!bulkInput.trim()) return;

    const lines = bulkInput.split('\n').filter((line) => line.trim());
    const newFlashcards: Flashcard[] = [];
    let delimiter = '\t';

    if (termDefDelimiter === 'comma') {
      delimiter = ',';
    } else if (termDefDelimiter === 'custom') {
      delimiter = customDelimiter;
    }

    lines.forEach((line) => {
      const parts = line.split(delimiter);
      if (parts.length >= 2) {
        const term = parts[0].trim();
        const definition = parts.slice(1).join(delimiter).trim();
        if (term && definition) {
          newFlashcards.push({
            id: `${Date.now()}-${Math.random()}`,
            term,
            definition,
          });
        }
      }
    });

    if (newFlashcards.length > 0) {
      const updatedFlashcards = [...flashcards, ...newFlashcards];
      setFlashcards(updatedFlashcards);
      setValue('flashcards', updatedFlashcards);
      setBulkInput('');
      toast('Import successful');
    } else {
      toast('Import failed');
    }
  };

  const onFormSubmit = (data: CollectionFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-foreground">
          {isEditing ? 'Edit Collection' : 'Create New Collection'}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Collection Name *</Label>
          <Input id="name" {...register('name')} placeholder="e.g., French Basics" />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Describe your collection..."
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add a tag..."
            />
            <Button type="button" onClick={handleAddTag} variant="secondary">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-primary/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            defaultValue={initialData?.status || 'private'}
            onValueChange={(value) => setValue('status', value as 'private' | 'public' | 'shared')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="shared">Shared with specific users</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {status === 'shared' && (
          <div className="space-y-2">
            <Label htmlFor="sharedWith">Share with (emails)</Label>
            <div className="flex gap-2">
              <Input
                id="sharedWith"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                placeholder="user@example.com"
              />
              <Button type="button" onClick={handleAddEmail} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {sharedWith.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="hover:text-accent/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 pt-4 border-t border-border">
          <Label>Flashcards ({flashcards.length})</Label>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="term">Term</Label>
                  <Input
                    id="term"
                    value={termInput}
                    onChange={(e) => setTermInput(e.target.value)}
                    placeholder="e.g., hello"
                    onKeyPress={(e) =>
                      e.key === 'Enter' &&
                      (e.preventDefault(), document.getElementById('definition')?.focus())
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="definition">Definition</Label>
                  <Input
                    id="definition"
                    value={definitionInput}
                    onChange={(e) => setDefinitionInput(e.target.value)}
                    placeholder="e.g., xin chào"
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), handleAddFlashcard())
                    }
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddFlashcard}
                  variant="secondary"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Flashcard
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Delimiter between term and definition</Label>
                  <Select
                    value={termDefDelimiter}
                    onValueChange={(value: any) => setTermDefDelimiter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tab">Tab</SelectItem>
                      <SelectItem value="comma">Comma (,)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {termDefDelimiter === 'custom' && (
                    <Input
                      value={customDelimiter}
                      onChange={(e) => setCustomDelimiter(e.target.value)}
                      placeholder="Enter custom delimiter (e.g., :)"
                      maxLength={5}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulkInput">Paste your flashcards (one per line)</Label>
                  <Textarea
                    id="bulkInput"
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="hello (n): xin chào&#10;red (n): màu đỏ&#10;hit (v): đánh"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: term
                    {termDefDelimiter === 'tab'
                      ? '[TAB]'
                      : termDefDelimiter === 'comma'
                      ? ','
                      : customDelimiter}
                    definition (one per line)
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={handleBulkImport}
                  variant="secondary"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Flashcards
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {flashcards.length > 0 && (
            <div className="space-y-2 mt-4">
              <div className="text-sm font-medium text-foreground">Current flashcards:</div>
              <div className="max-h-60 overflow-y-auto space-y-2 border border-border rounded-md p-3">
                {flashcards.map((flashcard) => (
                  <div
                    key={flashcard.id}
                    className="flex items-start justify-between gap-2 p-3 bg-muted/50 rounded-md"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground truncate">
                        {flashcard.term}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {flashcard.definition}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFlashcard(flashcard.id)}
                      className="text-destructive hover:text-destructive/80 shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" size="lg" className="flex-1">
          {isEditing ? 'Update Collection' : 'Create Collection'}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CollectionForm;
