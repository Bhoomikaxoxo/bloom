import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getTodayDateStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getTomorrowDateStr = () => {
  const d = new Date(Date.now() + 86400000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const useSlateStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      notes: [
        {
          id: 'welcome-note',
          title: 'Welcome to Bloom! 🌸✨',
          type: 'text',
          content: 'Bloom is an aesthetic, serene space for your thoughts, daily journal, and ideas.\n\n✨ Pin or star notes to keep favorites close\n✨ Switch between Grid view and freeform Canvas Board\n✨ Explore dedicated color themes for each folder\n✨ Write in your personal Journal with bold, italic, lists, and cursive handwriting',
          colorIndex: 1, // Lavender
          isPinned: true,
          isFavorite: false,
          deletedAt: null,
          folderId: 'folder-ideas',
          tags: ['tag-creative'],
          boardPosition: { x: 50, y: 80 },
          createdAt: Date.now() - 3600000 * 2, // 2 hours ago
          updatedAt: Date.now() - 3600000 * 2,
          stickers: [],
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
          stickers: [],
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
      currentTheme: 'pastel-dream',
      showTrash: false,
      showFavorites: false,
      showCalendar: false,
      confettiTrigger: null,
      journalViewMode: 'notes',
      journals: {},
      activeAestheticTheme: 'caramel',
      folderThemes: {
        'folder-work': 'matcha',
        'folder-personal': 'rose',
        'folder-ideas': 'lavender',
      },
      sortMode: 'newest', // 'newest' | 'oldest' | 'az' | 'color'
      openNoteId: null, // ID of note open in full editor
      calendarEvents: [
        {
          id: 'evt-1',
          date: getTodayDateStr(),
          title: 'Water plants & morning matcha 🍵🌱',
          category: 'personal',
          time: '09:00',
          completed: true,
        },
        {
          id: 'evt-2',
          date: getTomorrowDateStr(),
          title: 'Review project milestones & plan ahead 🌸',
          category: 'work',
          time: '11:00',
          completed: false,
        },
        {
          id: 'evt-3',
          date: getTomorrowDateStr(),
          title: 'Self-care & evening reading 📖✨',
          category: 'selfcare',
          time: '19:30',
          completed: false,
        },
      ],

      // --- ACTIONS ---
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveFolderId: (id) => set({ activeFolderId: id, activeTagId: null, showTrash: false, showFavorites: false, showCalendar: false }),
      setActiveTagId: (id) => set({ activeTagId: id, activeFolderId: null, showTrash: false, showFavorites: false, showCalendar: false }),
      setShowFavorites: (show) => set({ showFavorites: show, activeFolderId: null, activeTagId: null, showTrash: false, showCalendar: false }),
      setShowCalendar: (show) => set({ showCalendar: show, activeFolderId: null, activeTagId: null, showTrash: false, showFavorites: false }),
      addCalendarEvent: (eventData) => {
        const newEvent = {
          id: 'evt-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
          title: eventData.title || 'Untitled reminder',
          date: eventData.date || getTodayDateStr(),
          time: eventData.time || '',
          category: eventData.category || 'personal',
          color: eventData.color || 'pink',
          completed: false,
          createdAt: Date.now(),
        };
        set((state) => ({
          calendarEvents: [...(state.calendarEvents || []), newEvent],
        }));
        return newEvent.id;
      },
      updateCalendarEvent: (id, updates) => set((state) => ({
        calendarEvents: (state.calendarEvents || []).map((evt) =>
          evt.id === id ? { ...evt, ...updates } : evt
        ),
      })),
      deleteCalendarEvent: (id) => set((state) => ({
        calendarEvents: (state.calendarEvents || []).filter((evt) => evt.id !== id),
      })),
      toggleCalendarEvent: (id) => set((state) => ({
        calendarEvents: (state.calendarEvents || []).map((evt) =>
          evt.id === id ? { ...evt, completed: !evt.completed } : evt
        ),
      })),
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
        showFavorites: false,
        showCalendar: false,
        activeFolderId: show ? null : get().activeFolderId,
        activeTagId: show ? null : get().activeTagId
      }),
      triggerConfetti: (x, y) => set({
        confettiTrigger: { id: 'confetti-' + Math.random().toString(36).substr(2, 9), x, y }
      }),
      setJournalViewMode: (mode) => set({ journalViewMode: mode }),
      setSortMode: (mode) => set({ sortMode: mode }),
      setOpenNoteId: (id) => set({ openNoteId: id }),
      updateJournal: (folderId, updates) => set((state) => {
        const key = folderId || 'global';
        return {
          journals: {
            ...state.journals,
            [key]: {
              ...(state.journals[key] || { title: '', content1: '', content2: '' }),
              ...updates
            }
          }
        };
      }),
      setAestheticTheme: (themeId) => set({ activeAestheticTheme: themeId }),
      setFolderTheme: (folderId, themeId) => set((state) => ({
        folderThemes: {
          ...state.folderThemes,
          [folderId]: themeId
        }
      })),
      removeFolderTheme: (folderId) => set((state) => {
        const newFolderThemes = { ...state.folderThemes };
        delete newFolderThemes[folderId];
        return { folderThemes: newFolderThemes };
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
          stickers: [],
        };

        if (type === 'checklist') {
          newNote.checklist = [];
        } else {
          newNote.content = '';
          newNote.richText = ''; // HTML from TipTap editor
        }

        set((state) => ({
          notes: [newNote, ...state.notes]
        }));
        return id;
      },

      duplicateNote: (noteId) => {
        const orig = get().notes.find((n) => n.id === noteId);
        if (!orig) return null;
        const newId = 'note-' + Math.random().toString(36).substr(2, 9);
        const dup = {
          ...orig,
          id: newId,
          title: orig.title ? `${orig.title} (Copy)` : 'Untitled (Copy)',
          isPinned: false,
          boardPosition: {
            x: (orig.boardPosition?.x || 100) + 24,
            y: (orig.boardPosition?.y || 100) + 24,
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        if (orig.checklist) {
          dup.checklist = orig.checklist.map((item) => ({
            ...item,
            id: 'item-' + Math.random().toString(36).substr(2, 9),
          }));
        }
        set((state) => ({
          notes: [dup, ...state.notes],
        }));
        return newId;
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
      addFolder: (name, themeId = 'rose') => {
        const id = 'folder-' + Math.random().toString(36).substr(2, 9);
        const icons = ['📁', '💖', '💼', '💡', '🌟', '🍀', '🍓', '🎒'];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        const newFolder = { id, name, icon: randomIcon };

        set((state) => ({
          folders: [...state.folders, newFolder],
          folderThemes: { ...state.folderThemes, [id]: themeId },
        }));
        return id;
      },

      setFolderTheme: (folderId, themeId) => set((state) => ({
        folderThemes: { ...state.folderThemes, [folderId]: themeId },
      })),

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
      })),

      addSticker: (noteId, type) => set((state) => ({
        notes: state.notes.map((note) => {
          if (note.id !== noteId) return note;
          const currentStickers = note.stickers || [];
          if (currentStickers.length >= 6) return note;
          const newSticker = {
            id: 'sticker-' + Math.random().toString(36).substr(2, 9),
            type,
            x: 25 + Math.random() * 50,
            y: 25 + Math.random() * 50,
            rotation: Math.floor(Math.random() * 40) - 20, // -20deg to 20deg
          };
          return {
            ...note,
            stickers: [...currentStickers, newSticker],
            updatedAt: Date.now()
          };
        })
      })),

      updateStickerPosition: (noteId, stickerId, x, y) => set((state) => ({
        notes: state.notes.map((note) => {
          if (note.id !== noteId) return note;
          return {
            ...note,
            stickers: (note.stickers || []).map((sticker) =>
              sticker.id === stickerId ? { ...sticker, x, y } : sticker
            )
          };
        })
      })),

      removeSticker: (noteId, stickerId) => set((state) => ({
        notes: state.notes.map((note) => {
          if (note.id !== noteId) return note;
          return {
            ...note,
            stickers: (note.stickers || []).filter((sticker) => sticker.id !== stickerId),
            updatedAt: Date.now()
          };
        })
      }))

    }),
    {
      name: 'slate-notes-storage', // name of item in localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.journalViewMode = 'notes';
          if (state.activeAestheticTheme === 'toffee' || state.activeAestheticTheme === 'sunsetMeadow') {
            state.activeAestheticTheme = 'caramel';
          } else if (state.activeAestheticTheme === 'sage') {
            state.activeAestheticTheme = 'rose';
          } else if (state.activeAestheticTheme === 'matchaFrog') {
            state.activeAestheticTheme = 'matcha';
          } else if (state.activeAestheticTheme === 'lilacMist') {
            state.activeAestheticTheme = 'lavender';
          }
          if (!state.folderThemes || Object.keys(state.folderThemes).length === 0) {
            state.folderThemes = {
              'folder-work': 'matcha',
              'folder-personal': 'rose',
              'folder-ideas': 'lavender',
            };
          }
          if (!Array.isArray(state.calendarEvents) || state.calendarEvents.length === 0) {
            state.calendarEvents = [
              {
                id: 'evt-1',
                date: getTodayDateStr(),
                title: 'Water plants & morning matcha 🍵🌱',
                category: 'personal',
                time: '09:00',
                completed: true,
              },
              {
                id: 'evt-2',
                date: getTomorrowDateStr(),
                title: 'Review project milestones & plan ahead 🌸',
                category: 'work',
                time: '11:00',
                completed: false,
              },
              {
                id: 'evt-3',
                date: getTomorrowDateStr(),
                title: 'Self-care & evening reading 📖✨',
                category: 'selfcare',
                time: '19:30',
                completed: false,
              },
            ];
          }
          if (Array.isArray(state.notes)) {
            state.notes.forEach((n) => {
              if (n.id === 'welcome-note' && n.title && n.title.includes('Slate')) {
                n.title = 'Welcome to Bloom! 🌸✨';
                n.content = 'Bloom is an aesthetic, serene space for your thoughts, daily journal, and ideas.\n\n✨ Pin or star notes to keep favorites close\n✨ Switch between Grid view and freeform Canvas Board\n✨ Explore dedicated color themes for each folder\n✨ Write in your personal Journal with bold, italic, lists, and cursive handwriting';
              }
              if (Array.isArray(n.checklist)) {
                n.checklist.forEach((item) => {
                  if (item.text && item.text.includes('-')) {
                    // Replace hyphens that separate words
                    item.text = item.text.replace(/-/g, ' ').trim();
                  }
                });
              }
            });
          }
        }
      },
    }
  )
);

export default useSlateStore;
