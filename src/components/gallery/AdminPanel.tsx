'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GalleryItem } from '@/types/gallery';
import { ImageUploader } from './ImageUploader';
import ImageNext from 'next/image';
import { Plus, GripVertical, X } from 'lucide-react';

export function AdminPanel({ initialItems }: { initialItems: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setItems(data);
    };
    loadItems();
  }, []);

  const saveToServer = async (updatedItems: GalleryItem[]) => {
    try {
      await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems }),
      });
    } catch (error) {
      console.error('Failed to save', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    const updated = reordered.map((item, index) => ({ ...item, order: index }));
    setItems(updated);
    await saveToServer(updated);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are youbard sure?')) return;
    try {
      await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const updated = items.filter(item => item.id !== id);
      setItems(updated);
      await saveToServer(updated);
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Manage Gallery</h2>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Image
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-zinc-900 p-6 rounded-xl max-w-lg w-full border border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Add New Artwork</h3>
              <button onClick={() => setIsAdding(false)} className="text-white"><X /></button>
            </div>
            <ImageUploader 
              onUpload={(item) => {
                setItems([...items, item]);
                setIsAdding(false);
                saveToServer([...items, item]);
              }}
              onCancel={() => setIsAdding(false)}
            />
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
                      <div {...provided.dragHandleProps} className="absolute top-2 left-2 z-10 p-1 bg-black/50 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-4 w-int" />
                      </div>
                      <button 
                        className="absolute top-2 right-2 z-10 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="relative aspect-square">
                        <ImageNext src={item.thumbnailUrl || item.imageUrl} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-white truncate">{item.title || <span className="text-zinc-500 italic">Untitled</span>}</p>
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
