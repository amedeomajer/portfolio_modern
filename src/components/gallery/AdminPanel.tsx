'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GalleryItem } from '@/types/gallery';
import { ImageUploader } from './ImageUploader';
import ImageNext from 'next/image';
import { Plus, GripVertical, X, LogOut } from 'lucide-react';

interface AdminPanelProps {
  initialItems: GalleryItem[];
  onLogout: () => void;
}

export function AdminPanel({ initialItems, onLogout }: AdminPanelProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveOrder = async (updatedItems: GalleryItem[]) => {
    setSaving(true);
    try {
      const response = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save order');
      }
    } catch (error) {
      console.error('Failed to save', error);
      alert(error instanceof Error ? error.message : 'Failed to save order');
    } finally {
      setSaving(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    const updated = reordered.map((item, index) => ({ ...item, order: index }));
    setItems(updated);
    await saveOrder(updated);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    const previous = items;
    const updated = items.filter((item) => item.id !== id);
    setItems(updated); // optimistic

    try {
      const response = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Delete failed');
      }
      // DELETE already persists + removes Cloudinary asset — no second PUT
    } catch (error) {
      console.error('Delete failed', error);
      setItems(previous);
      alert(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  const handleUpload = (item: GalleryItem) => {
    // Upload route already persisted the item — only update local UI.
    // Modal stays open so bulk uploads can report progress per file.
    setItems((prev) => [...prev, item].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-white">Manage Gallery</h2>
        <div className="flex items-center gap-2">
          {saving && <span className="text-xs text-zinc-500">Saving…</span>}
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Image
          </button>
          <button
            className="px-4 py-2 bg-zinc-800 text-white rounded-md flex items-center border border-zinc-700"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-zinc-900 p-6 rounded-xl max-w-2xl w-full border border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Add New Artwork</h3>
              <button onClick={() => setIsAdding(false)} className="text-white">
                <X />
              </button>
            </div>
            <ImageUploader onUpload={handleUpload} onCancel={() => setIsAdding(false)} />
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="group relative bg-zinc-900 overflow-hidden border border-zinc-800"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="absolute top-2 left-2 z-10 p-1 bg-black/50 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <button
                        className="absolute top-2 right-2 z-10 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="relative aspect-square">
                        <ImageNext
                          src={item.thumbnailUrl || item.imageUrl}
                          alt={item.title || 'Gallery image'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-white truncate">
                          {item.title || <span className="text-zinc-500 italic">Untitled</span>}
                        </p>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
