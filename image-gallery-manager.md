# 🎨 Gallery Management System - Implementation Plan

## Project Overview
A dual-purpose gallery for a photographer and painter with an admin panel for managing artwork, built with Next.js, shadcn/ui, Cloudinary, and Vercel KV.

---

## 📋 Prerequisites
- Node.js 18+ installed
- GitHub account
- Vercel account (free)
- Cloudinary account (free)
- Basic knowledge of Next.js, TypeScript, and Tailwind CSS

---

## 🗺️ Project Roadmap

### Phase 1: Project Setup (15 min)
- [ ] Create Next.js project
- [ ] Install shadcn/ui
- [ ] Set up Tailwind CSS
- [ ] Install core dependencies

### Phase 2: Services Setup (20 min)
- [ ] Configure Cloudinary
- [ ] Set up Vercel KV
- [ ] Environment variables

### Phase 3: Data Layer (20 min)
- [ ] Create Cloudinary utility
- [ ] Create storage utility

### Phase 4: Components (45 min)
- [ ] Gallery grid with lightbox
- [ ] Admin panel with drag & drop
- [ ] Image uploader
- [ ] Category filters

### Phase 5: API Routes (20 min)
- [ ] Upload endpoint
- [ ] CRUD endpoints
- [ ] Auth endpoint

### Phase 6: Pages (15 min)
- [ ] Public gallery page
- [ ] Admin page
- [ ] Auth protection

### Phase 7: Polish & Deploy (20 min)
- [ ] Responsive design
- [ ] Error handling
- [ ] Deploy to Vercel

**Total Time:** ~3 hours

---

## 🚀 Step-by-Step Implementation

### Step 1: Project Setup

```bash
# Create Next.js app
npx create-next-app@latest gallery-app --typescript --tailwind --app
cd gallery-app

# Install shadcn/ui
npx shadcn-ui@latest init

# Install core dependencies
npm install @vercel/kv cloudinary react-dropzone @hello-pangea/dnd uuid
npm install -D @types/uuid @types/cloudinary

# Install shadcn components
npx shadcn-ui@latest add button card dialog input textarea toast badge tabs
```

**Project Structure:**
```
gallery-app/
├── app/
│   ├── admin/
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── route.ts
│   │   ├── gallery/
│   │   │   └── route.ts
│   │   └── upload/
│   │       └── route.ts
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── AdminPanel.tsx
│   ├── GalleryGrid.tsx
│   ├── ImageUploader.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── cloudinary.ts
│   └── storage.ts
├── types/
│   └── index.ts
├── .env.local
└── vercel.json
```

---

### Step 2: Services Setup

#### Cloudinary Configuration

1. **Sign up at [Cloudinary](https://cloudinary.com)** (free tier)
2. Get your cloud name, API key, and API secret from the dashboard

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(file: string, folder: string = 'gallery') {
  const result = await cloudinary.uploader.upload(file, {
    folder: folder,
    quality: 'auto:good',
    fetch_format: 'auto',
    responsive_breakpoints: {
      create_derived: true,
      bytes_step: 20000,
      min_width: 200,
      max_width: 1200,
      max_images: 5,
    },
  });

  return {
    id: result.public_id,
    url: result.secure_url,
    thumbnail: cloudinary.url(result.public_id, {
      width: 400,
      height: 400,
      crop: 'fill',
      quality: 'auto',
    }),
    width: result.width,
    height: result.height,
  };
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}
```

#### Vercel KV Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Link project to Vercel
vercel link

# Create KV store
vercel kv create gallery-store

# Get KV environment variables (copy these)
vercel kv list
```

---

### Step 3: Data Layer

```typescript
// types/index.ts
export interface GalleryItem {
  id: string;
  cloudinaryId: string;
  imageUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  category: 'photography' | 'painting';
  artist: string;
  date: string;
  order: number;
  width?: number;
  height?: number;
}
```

```typescript
// lib/storage.ts
import { kv } from '@vercel/kv';
import { GalleryItem } from '@/types';

const KEY = 'gallery:items';

export async function getItems(): Promise<GalleryItem[]> {
  const items = await kv.get<GalleryItem[]>(KEY);
  return items || [];
}

export async function saveItems(items: GalleryItem[]) {
  await kv.set(KEY, items);
}

export async function addItem(item: GalleryItem) {
  const items = await getItems();
  items.push(item);
  await saveItems(items);
  return item;
}

export async function updateItem(id: string, data: Partial<GalleryItem>) {
  const items = await getItems();
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...data };
    await saveItems(items);
    return items[index];
  }
  return null;
}

export async function deleteItem(id: string) {
  const items = await getItems();
  const item = items.find(i => i.id === id);
  if (item) {
    const { deleteImage } = await import('./cloudinary');
    await deleteImage(item.cloudinaryId);
    await saveItems(items.filter(i => i.id !== id));
    return true;
  }
  return false;
}

export async function getItemsByCategory(category: 'photography' | 'painting') {
  const items = await getItems();
  return items.filter(item => item.category === category);
}
```

---

### Step 4: Components

#### Gallery Grid with Lightbox

```tsx
// components/GalleryGrid.tsx
'use client';

import { useState } from 'react';
import { GalleryItem } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { X } from 'lucide-react';

function Lightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white hover:scale-110 transition"
        onClick={onClose}
      >
        <X className="h-8 w-8" />
      </button>
      <div 
        className="relative max-w-5xl max-h-[90vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 80vw"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <h2 className="text-2xl font-bold">{item.title}</h2>
          <p className="text-white/80">{item.description}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{item.category}</Badge>
            <Badge variant="secondary">by {item.artist}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No artwork yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card 
            key={item.id} 
            className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative aspect-[4/3] bg-slate-100">
              <Image
                src={item.thumbnailUrl || item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge variant="secondary" className="bg-black/50 text-white border-none">
                  {item.category === 'photography' ? '📸' : '🎨'} {item.artist}
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {selectedItem && (
        <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  );
}
```

#### Image Uploader

```tsx
// components/ImageUploader.tsx
'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploaderProps {
  onUpload: (item: any) => void;
  onCancel: () => void;
}

export function ImageUploader({ onUpload, onCancel }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'photography' as 'photography' | 'painting',
    artist: '',
  });
  const { toast } = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast({ 
            title: 'File too large', 
            description: 'Maximum 10MB',
            variant: 'destructive' 
          });
          return;
        }
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!file || !formData.title || !formData.artist) {
      toast({ 
        title: 'Missing fields', 
        description: 'Please fill in title and artist name',
        variant: 'destructive' 
      });
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    Object.entries(formData).forEach(([key, value]) => {
      uploadFormData.append(key, value);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      onUpload(data);
      toast({ title: 'Uploaded successfully!' });
    } catch (error) {
      toast({ 
        title: 'Upload failed', 
        description: 'Please try again',
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!preview ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'}`}
        >
          <input {...getInputProps()} />
          <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-2 text-sm">Drop an image here, or click to select</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
        </div>
      ) : (
        <Card className="relative overflow-hidden">
          <div className="relative aspect-video bg-slate-100">
            <Image src={preview} alt="Preview" fill className="object-contain" />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2"
              onClick={() => { setFile(null); setPreview(''); }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input 
          placeholder="Artist Name *" 
          value={formData.artist}
          onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
        />
        <select 
          className="rounded-md border border-input bg-background px-3 py-2"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
        >
          <option value="photography">📸 Photography</option>
          <option value="painting">🎨 Painting</option>
        </select>
      </div>
      
      <Input 
        placeholder="Title *" 
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <Textarea 
        placeholder="Description" 
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          disabled={uploading || !file || !formData.title || !formData.artist}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
    </div>
  );
}
```

#### Admin Panel

```tsx
// components/AdminPanel.tsx
'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GalleryItem } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, GripVertical, X } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { ImageUploader } from './ImageUploader';

export function AdminPanel({ initialItems }: { initialItems: GalleryItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveToServer = async (updatedItems: GalleryItem[]) => {
    try {
      const response = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems }),
      });
      if (!response.ok) throw new Error('Failed to save');
      toast({ title: 'Saved!', description: 'Changes saved successfully' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to save changes', 
        variant: 'destructive' 
      });
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
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to delete');
      
      const updated = items.filter(item => item.id !== id);
      setItems(updated);
      toast({ title: 'Deleted', description: 'Item removed from gallery' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to delete item', 
        variant: 'destructive' 
      });
    }
  };

  const handleEdit = async (id: string, data: Partial<GalleryItem>) => {
    try {
      const response = await fetch('/api/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      if (!response.ok) throw new Error('Failed to update');
      
      const updated = items.map(item => 
        item.id === id ? { ...item, ...data } : item
      );
      setItems(updated);
      setEditingItem(null);
      toast({ title: 'Updated!', description: 'Changes saved' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update item', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {items.length} items • Drag to reorder
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Image
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="group relative"
                    >
                      <Card className="overflow-hidden">
                        <div className="relative h-48 bg-slate-100">
                          <Image
                            src={item.thumbnailUrl || item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div 
                              {...provided.dragHandleProps} 
                              className="p-1 bg-white/80 rounded cursor-grab"
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div 
                          className="p-3 cursor-pointer hover:bg-slate-50"
                          onClick={() => setEditingItem(item)}
                        >
                          <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {item.category === 'photography' ? '📸' : '🎨'} {item.artist}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Dialog */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Artwork</DialogTitle>
          </DialogHeader>
          <ImageUploader 
            onUpload={(item) => {
              setItems([...items, item]);
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <Input 
                placeholder="Title" 
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              />
              <Textarea 
                placeholder="Description" 
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input 
                  placeholder="Artist" 
                  value={editingItem.artist}
                  onChange={(e) => setEditingItem({ ...editingItem, artist: e.target.value })}
                />
                <select
                  className="rounded-md border border-input bg-background px-3 py-2"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ 
                    ...editingItem, 
                    category: e.target.value as 'photography' | 'painting' 
                  })}
                >
                  <option value="photography">📸 Photography</option>
                  <option value="painting">🎨 Painting</option>
                </select>
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleEdit(editingItem.id, editingItem)}
              >
                Update Item
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

### Step 5: API Routes

```typescript
// app/api/auth/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();
  const isValid = password === process.env.ADMIN_PASSWORD;
  
  if (isValid) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json(
    { error: 'Invalid password' },
    { status: 401 }
  );
}
```

```typescript
// app/api/gallery/route.ts
import { NextResponse } from 'next/server';
import { getItems, saveItems, updateItem, deleteItem } from '@/lib/storage';

export async function GET() {
  const items = await getItems();
  return NextResponse.json(items);
}

export async function PUT(request: Request) {
  const { items } = await request.json();
  await saveItems(items);
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const { id, ...data } = await request.json();
  const updated = await updateItem(id, data);
  if (updated) {
    return NextResponse.json(updated);
  }
  return NextResponse.json({ error: 'Item not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const success = await deleteItem(id);
  if (success) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Item not found' }, { status: 404 });
}
```

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { addItem } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const artist = formData.get('artist') as string;

    if (!file || !title || !artist) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadImage(base64, category);

    // Save to KV
    const newItem = {
      id: uuidv4(),
      cloudinaryId: result.id,
      imageUrl: result.url,
      thumbnailUrl: result.thumbnail,
      title,
      description,
      category: category as 'photography' | 'painting',
      artist,
      date: new Date().toISOString(),
      order: 0,
      width: result.width,
      height: result.height,
    };

    await addItem(newItem);
    return NextResponse.json(newItem);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
```

---

### Step 6: Pages

```tsx
// app/page.tsx
import { getItems } from '@/lib/storage';
import { GalleryGrid } from '@/components/GalleryGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function HomePage() {
  const items = await getItems();
  
  const photography = items.filter(i => i.category === 'photography');
  const painting = items.filter(i => i.category === 'painting');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">🎨 Art Gallery</h1>
          <p className="text-muted-foreground">
            Featuring {items.length} incredible works of art
          </p>
        </header>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-center mb-8">
            <TabsTrigger value="all">All ({items.length})</TabsTrigger>
            <TabsTrigger value="photography">📸 Photography ({photography.length})</TabsTrigger>
            <TabsTrigger value="painting">🎨 Painting ({painting.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <GalleryGrid items={items} />
          </TabsContent>
          <TabsContent value="photography">
            <GalleryGrid items={photography} />
          </TabsContent>
          <TabsContent value="painting">
            <GalleryGrid items={painting} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
```

```tsx
// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { AdminPanel } from '@/components/AdminPanel';
import { GalleryItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('adminAuth');
    if (saved === 'true') {
      setAuthenticated(true);
      loadItems();
    } else {
      setLoading(false);
    }
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (response.ok) {
        localStorage.setItem('adminAuth', 'true');
        setAuthenticated(true);
        await loadItems();
      } else {
        alert('Wrong password');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <form onSubmit={handleLogin} className="w-96 bg-white p-8 rounded-xl shadow-lg space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">🔐 Admin Access</h2>
            <p className="text-sm text-muted-foreground mt-1">Enter password to manage gallery</p>
          </div>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-lg"
          />
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🎨 Gallery Manager</h1>
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem('adminAuth');
              setAuthenticated(false);
            }}
          >
            Logout
          </Button>
        </div>
        <AdminPanel initialItems={items} />
      </div>
    </div>
  );
}
```

---

### Step 7: Environment Variables

Create `.env.local`:

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin
ADMIN_PASSWORD=your-secure-password

# Vercel KV (added automatically when you create KV store)
KV_URL=your-kv-url
KV_REST_API_URL=your-kv-api-url
KV_REST_API_TOKEN=your-kv-token
KV_REST_API_READ_ONLY_TOKEN=your-read-only-token
```

---

### Step 8: Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/gallery-app.git
git push -u origin main

# 2. Deploy to Vercel
# Option A: Using Vercel CLI
vercel --prod

# Option B: Connect GitHub to Vercel
# 1. Go to vercel.com
# 2. Import your GitHub repository
# 3. Add environment variables
# 4. Deploy
```

#### Environment Variables on Vercel
Add these in Vercel dashboard:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `ADMIN_PASSWORD`
- `KV_URL` (added automatically)
- `KV_REST_API_URL` (added automatically)
- `KV_REST_API_TOKEN` (added automatically)
- `KV_REST_API_READ_ONLY_TOKEN` (added automatically)

---

## 🎯 Features Checklist

| Feature | Status | Description |
|---------|--------|-------------|
| ✅ Public Gallery | Complete | Beautiful grid display with category filters |
| ✅ Lightbox | Complete | Full-screen image viewing with details |
| ✅ Admin Panel | Complete | Password-protected management interface |
| ✅ Image Upload | Complete | Drag & drop with Cloudinary integration |
| ✅ Drag & Drop | Complete | Sort images by dragging |
| ✅ Edit Items | Complete | Edit titles, descriptions, artist names |
| ✅ Delete Items | Complete | Remove with Cloudinary cleanup |
| ✅ Categories | Complete | Photography/Painting filters |
| ✅ Responsive | Complete | Works on all devices |
| ✅ Fast Images | Complete | Cloudinary CDN with optimization |
| ✅ Free Tier | Complete | Uses Vercel + Cloudinary free plans |

---

##
