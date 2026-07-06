import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSlateStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      notes: [
        {
          id: 'welcome-note',
          title: 'Welcome to Slate! 📝✨',
          type: 'text',
          content: 'Slate is a cozy space for all your notes and checklists! \n\nHere are some things you can try:\n🌸 Click the pin icon to stick this note to the top with a cute badge.\n🌸 Switch between "Grid" and "Board" views at the bottom of the sidebar to drag cards around freely!\n🌸 Choose from 3 pastel themes in the sidebar.\n🌸 Drag notes into folders or organize them with tags.',
          colorIndex: 1, // Lavender
          isPinned: true,
          isFavorite: false,
          deletedAt: null,
          folderId: 'folder-ideas',
          tags: ['tag-creative'],
          boardPosition: { x: 50, y: 80 },
          createdAt: Date.now() - 3600000 * 2, // 2 hours ago
          updatedAt: Date.now() - 3600000 * 2,
        },
        {
          id: 'starter-checklist',
          title: 'Happy Day Checklist 🌟',
          type: 'checklist',
          checklist: [
            { id: 'item-1', text: 'Water the cute little plants 🌱', done: true },
            { id: 'item-2', text: 'Drink a big glass of water 💧', done: true },
            { id: 'item-3', text: 'Take a deep breath and smile ☀️', done: false },
            { id: 'item-4', text: 'Write down one nice thing that happened today 📔', done: false },
          ],
          colorIndex: 3, // Buttery Yellow
          isPinned: false,
          isFavorite: true,
          deletedAt: null,
          folderId: 'folder-personal',
          tags: ['tag-daily'],
          boardPosition: { x: 450, y: 120 },
          createdAt: Date.now() - 3600000 * 24, // 1 day ago
          updatedAt: Date.now() - 3600000 * 24,
        }
      ],
      
      folders: [
        { id: 'folder-work', name: 'Work', icon: '💼' },
        { id: 'folder-personal', name: 'Personal', icon: '💖' },
        { id: 'folder-ideas', name: 'Ideas', icon: '💡' }
      ],
      
      tags: [
        { id: 'tag-urgent', name: 'Urgent', color: 'pink' },
        { id: 'tag-creative', name: 'Creative', color: 'lavender' },
        { id: 'tag-daily', name: 'Daily', color: 'mint' }
      ],
      
      searchQuery: '',
      activeFolderId: null,
      activeTagId: null,
      viewMode: 'grid', // 'grid' | 'board'
      currentTheme: 'pastel-dream', // 'pastel-dream' | 'mint-garden' | 'sunset-peach'
      showTrash: false,

      // --- ACTIONS ---
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveFolderId: (id) => set({ activeFolderId: id, activeTagId: null, showTrash: false }),
      setActiveTagId: (id) => set({ activeTagId: id, activeFolderId: null, showTrash: false }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setCurrentTheme: (theme) => {
        const selectedTheme = theme === 'midnight-stars' ? 'pastel-dream' : theme;
        set({ currentTheme: selectedTheme });
        
        const root = document.documentElement;
        
        // Remove existing theme classes
        const classesToRemove = Array.from(root.classList).filter(
          (c) => c.startsWith('theme-') || c === 'dark'
        );
        classesToRemove.forEach((c) => root.classList.remove(c));
        
        // Add new classes
        root.classList.add(`theme-${selectedTheme}`);
      },
      setShowTrash: (show) => set({ 
        showTrash: show, 
        // Reset category/tag filters when entering trash, and vice versa
        activeFolderId: show ? null : get().activeFolderId,
        activeTagId: show ? null : get().activeTagId
      }),

      // --- NOTES CRUD ---
      addNote: (type = 'text') => {
        const id = 'note-' + Math.random().toString(36).substr(2, 9);
        const newNote = {
          id,
          title: type === 'checklist' ? 'New Checklist' : 'New Note',
          type,
          colorIndex: Math.floor(Math.random() * 6) + 1, // Random soft color 1-6
          isPinned: false,
          isFavorite: false,
          deletedAt: null,
          folderId: get().activeFolderId, // Assign current active folder if selected
          tags: get().activeTagId ? [get().activeTagId] : [], // Assign current active tag if selected
          boardPosition: { x: 100 + Math.random() * 100, y: 100 + Math.random() * 100 },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        if (type === 'checklist') {
          newNote.checklist = [];
        } else {
          newNote.content = '';
        }

        set((state) => ({
          notes: [newNote, ...state.notes]
        }));
        return id;
      },

      updateNote: (noteId, updates) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId
            ? { ...note, ...updates, updatedAt: Date.now() }
            : note
        )
      })),

      deleteNote: (noteId) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId ? { ...note, deletedAt: Date.now(), isPinned: false } : note
        )
      })),

      restoreNote: (noteId) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId ? { ...note, deletedAt: null } : note
        )
      })),

      deleteNotePermanently: (noteId) => set((state) => ({
        notes: state.notes.filter((note) => note.id !== noteId)
      })),

      emptyTrash: () => set((state) => ({
        notes: state.notes.filter((note) => note.deletedAt === null)
      })),

      updateNotePosition: (noteId, x, y) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId ? { ...note, boardPosition: { x, y } } : note
        )
      })),

      // --- CHECKLIST ITEMS ---
      addChecklistItem: (noteId, text) => set((state) => ({
        notes: state.notes.map((note) => {
          if (note.id !== noteId || note.type !== 'checklist') return note;
          const newItem = {
            id: 'item-' + Math.random().toString(36).substr(2, 9),
            text,
            done: false
          };
          return {
            ...note,
            checklist: [...(note.checklist || []), newItem],
            updatedAt: Date.now()
          };
        })
      })),

      updateChecklistItem: (noteId, itemId, updates) => set((state) => ({
        notes: state.notes.map((note) => {
          if (note.id !== noteId || note.type !== 'checklist') return note;
          return {
            ...note,
            checklist: (note.checklist || []).map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
            updatedAt: Date.now()
          };
        })
      })),

      deleteChecklistItem: (noteId, itemId) => set((state) => ({
        notes: state.notes.map((note) => {
          if (note.id !== noteId || note.type !== 'checklist') return note;
          return {
            ...note,
            checklist: (note.checklist || []).filter((item) => item.id !== itemId),
            updatedAt: Date.now()
          };
        })
      })),

      // --- FOLDERS CRUD ---
      addFolder: (name) => {
        const id = 'folder-' + Math.random().toString(36).substr(2, 9);
        const icons = ['📁', '💖', '💼', '💡', '🌟', '🍀', '🍓', '🎒'];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        const newFolder = { id, name, icon: randomIcon };
        
        set((state) => ({
          folders: [...state.folders, newFolder]
        }));
        return id;
      },

      deleteFolder: (folderId) => set((state) => ({
        folders: state.folders.filter((f) => f.id !== folderId),
        // Disassociate notes from the deleted folder
        notes: state.notes.map((note) =>
          note.folderId === folderId ? { ...note, folderId: null } : note
        ),
        activeFolderId: state.activeFolderId === folderId ? null : state.activeFolderId
      })),

      updateFolder: (folderId, updates) => set((state) => ({
        folders: state.folders.map((f) =>
          f.id === folderId ? { ...f, ...updates } : f
        )
      }))

    }),
    {
      name: 'slate-notes-storage', // name of item in localStorage
    }
  )
);

export default useSlateStore;
