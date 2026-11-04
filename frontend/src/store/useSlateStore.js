import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Request persistent browser storage so local device data is never evicted
if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().catch(() => {});
}

// Seamlessly migrate legacy storage key if present
if (typeof window !== 'undefined') {
  try {
    if (!localStorage.getItem('bloom-workspace-storage') && localStorage.getItem('slate-notes-storage')) {
      localStorage.setItem('bloom-workspace-storage', localStorage.getItem('slate-notes-storage'));
    }
  } catch (e) {
    // ignore quota/private mode restrictions
  }
}

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
          title: 'Welcome to Bloom',
          type: 'text',
          content: 'Bloom is a clean workspace for your notes, to-do lists, and calendar tracking.\n\n• Organize notes and checklists into custom-themed folders\n• Mark tasks and keep items in mind using the Calendar & Planner\n• Drag notes in Freeform Board or align neatly in Grid view\n• Device-first storage keeps your data strictly private on this computer',
          colorIndex: 1, // Lavender
          isPinned: true,
          isFavorite: false,
          deletedAt: null,
          folderId: 'folder-ideas',
          tags: ['tag-creative'],
          scheduledDate: getTodayDateStr(),
          boardPosition: { x: 50, y: 80 },
          createdAt: Date.now() - 3600000 * 2, // 2 hours ago
          updatedAt: Date.now() - 3600000 * 2,
          stickers: [],
        },
        {
          id: 'starter-checklist',
          title: 'Daily Checklist',
          type: 'checklist',
          checklist: [
            { id: 'item-1', text: 'Water office plants and check workspace', done: true },
            { id: 'item-2', text: 'Drink a glass of water and review agenda', done: true },
            { id: 'item-3', text: 'Complete top priority items for today', done: false },
            { id: 'item-4', text: 'Plan next day tasks on the Calendar', done: false },
          ],
          colorIndex: 3, // Buttery Yellow
          isPinned: false,
          isFavorite: true,
          deletedAt: null,
          folderId: 'folder-personal',
          tags: ['tag-daily'],
          scheduledDate: getTodayDateStr(),
          boardPosition: { x: 450, y: 120 },
          createdAt: Date.now() - 3600000 * 24, // 1 day ago
          updatedAt: Date.now() - 3600000 * 24,
          stickers: [],
        }
      ],

      folders: [
        { id: 'folder-work', name: 'Work', icon: '💼', theme: 'matcha' },
        { id: 'folder-personal', name: 'Personal', icon: '💖', theme: 'rose' },
        { id: 'folder-ideas', name: 'Ideas', icon: '💡', theme: 'lavender' }
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
      activeAestheticTheme: 'bloom-v2',
      sidebarCollapsed: true,
      folderThemes: {
        'folder-work': 'matcha',
        'folder-personal': 'rose',
        'folder-ideas': 'caramel',
      },
      sortMode: 'newest', // 'newest' | 'oldest' | 'az' | 'color'
      openNoteId: null, // ID of note open in full editor
      calendarEvents: [
        {
          id: 'evt-1',
          date: getTodayDateStr(),
          title: 'Morning review and workspace setup',
          category: 'personal',
          time: '09:00',
          completed: true,
        },
        {
          id: 'evt-2',
          date: getTomorrowDateStr(),
          title: 'Review project milestones and deliverables',
          category: 'work',
          time: '11:00',
          completed: false,
        },
        {
          id: 'evt-3',
          date: getTomorrowDateStr(),
          title: 'Evening wrap-up and task planning',
          category: 'reminder',
          time: '19:30',
          completed: false,
        },
      ],

      // --- ACTIONS ---
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveFolderId: (id) => {
        const folder = get().folders.find((f) => f.id === id);
        const folderTheme = folder?.theme || get().folderThemes?.[id];
        set({
          activeFolderId: id,
          activeTagId: null,
          showTrash: false,
          showFavorites: false,
          showCalendar: false,
          ...(folderTheme ? { activeAestheticTheme: folderTheme } : {})
        });
      },
      setActiveTagId: (id) => set({ activeTagId: id, activeFolderId: null, showTrash: false, showFavorites: false, showCalendar: false }),
      setShowFavorites: (show) => set({ showFavorites: show, activeFolderId: null, activeTagId: null, showTrash: false, showCalendar: false }),
      setShowCalendar: (show) => set({ showCalendar: show, activeFolderId: null, activeTagId: null, showTrash: false, showFavorites: false }),
      addCalendarEvent: (eventData) => {
        const newEvent = {
          id: 'evt-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
          title: eventData.title || 'Untitled task',
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

      workspaceView: 'spine', // 'spine' (Daily Stream) | 'canvas' (Macro Desk) | 'calendar' (Month Grid)
      setWorkspaceView: (view) => set({ workspaceView: view, showCalendar: view === 'calendar' }),
      toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setTaskStatus: (id, status) => set((state) => {
        let isDone = status === 'completed';
        return {
          notes: state.notes.map((note) => {
            if (note.id !== id) return note;
            return {
              ...note,
              status,
              updatedAt: Date.now(),
              completedAt: isDone ? Date.now() : null,
            };
          }),
        };
      }),

      setTodayAnchor: (id) => set((state) => ({
        notes: state.notes.map((note) => ({
          ...note,
          isAnchor: note.id === id ? !note.isAnchor : false,
          updatedAt: note.id === id ? Date.now() : note.updatedAt,
        })),
      })),

      scheduleItem: (id, scheduledDate, timeBlock = null) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id
            ? { ...note, scheduledDate, timeBlock, updatedAt: Date.now() }
            : note
        ),
      })),

      quickCapture: (title, overrides = {}) => {
        if (!title.trim()) return null;
        const id = 'item-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
        const isTask = overrides.type === 'task' || !overrides.content;
        const newItem = {
          id,
          title: title.trim(),
          type: isTask ? 'task' : 'note',
          status: 'todo',
          isAnchor: overrides.isAnchor || false,
          scheduledDate: overrides.scheduledDate || getTodayDateStr(),
          timeBlock: overrides.timeBlock || null,
          durationMinutes: overrides.durationMinutes || 30,
          energyDomain: overrides.energyDomain || 'focus',
          colorIndex: 1,
          isPinned: false,
          isFavorite: false,
          deletedAt: null,
          folderId: overrides.folderId || get().activeFolderId,
          tags: overrides.tags || (get().activeTagId ? [get().activeTagId] : []),
          content: overrides.content || '',
          checklist: overrides.checklist || [],
          boardPosition: { x: 100 + Math.random() * 80, y: 100 + Math.random() * 80 },
          createdAt: Date.now(),
          updatedAt: Date.now(),
          stickers: [],
        };
        set((state) => ({
          notes: [newItem, ...state.notes]
        }));
        return id;
      },

      convertNoteToTask: (noteId, taskText, scheduledDate = null, timeBlock = null) => {
        const id = 'task-' + Date.now().toString(36);
        const newTask = {
          id,
          title: taskText.trim(),
          type: 'task',
          status: 'todo',
          isAnchor: false,
          scheduledDate: scheduledDate || getTodayDateStr(),
          timeBlock: timeBlock || null,
          energyDomain: 'focus',
          colorIndex: 2,
          isPinned: false,
          isFavorite: false,
          deletedAt: null,
          folderId: get().activeFolderId,
          tags: ['from-note'],
          content: '',
          checklist: [],
          boardPosition: { x: 140, y: 140 },
          createdAt: Date.now(),
          updatedAt: Date.now(),
          stickers: [],
        };
        set((state) => ({
          notes: [newTask, ...state.notes]
        }));
        return id;
      },

      getSurfacedInsight: () => {
        const state = get();
        const today = getTodayDateStr();
        const todayItems = state.notes.filter(
          (n) => n.deletedAt === null && (n.scheduledDate === today || n.isAnchor)
        );
        const inProgress = todayItems.find((n) => n.status === 'in_progress');
        const anchor = todayItems.find((n) => n.isAnchor && n.status !== 'completed');
        const openTasks = todayItems.filter(
          (n) => (n.type === 'task' || n.type === 'checklist') && n.status !== 'completed'
        );
        const hour = new Date().getHours();

        if (inProgress) {
          return {
            type: 'in_progress',
            badge: 'Active Attention',
            headline: inProgress.title,
            subtext: 'Holding active working memory. Ready to close or defer?',
            itemId: inProgress.id,
          };
        }

        if (anchor) {
          return {
            type: 'anchor',
            badge: "Today's Anchor",
            headline: anchor.title,
            subtext: 'Highest leverage outcome designated for today.',
            itemId: anchor.id,
          };
        }

        if (hour >= 17 && openTasks.length > 0) {
          return {
            type: 'slipping',
            badge: 'Attention Horizon',
            headline: `${openTasks.length} ${openTasks.length === 1 ? 'commitment' : 'commitments'} open before day closes`,
            subtext: `"${openTasks[0].title}" — complete or reschedule to protect your streak.`,
            itemId: openTasks[0].id,
          };
        }

        if (openTasks.length > 0) {
          return {
            type: 'next_up',
            badge: 'Next Priority',
            headline: openTasks[0].title,
            subtext: `${openTasks.length} active tasks scheduled on today's timeline.`,
            itemId: openTasks[0].id,
          };
        }

        return {
          type: 'clear',
          badge: 'Clear Horizon',
          headline: 'All commitments for today are completed',
          subtext: 'Working memory unburdened. Rest or capture intentions for tomorrow.',
          itemId: null,
        };
      },

      getReflectionPrompt: () => {
        const hour = new Date().getHours();
        if (hour < 12) {
          return {
            timeOfDay: 'Morning Intention',
            prompt: 'What is the single most meaningful outcome you want to protect today?',
            suggestedTag: 'intention',
          };
        }
        if (hour < 17) {
          return {
            timeOfDay: 'Midday Checkpoint',
            prompt: 'What small win can you finish right now before the afternoon slips?',
            suggestedTag: 'momentum',
          };
        }
        return {
          timeOfDay: 'Evening Reflection',
          prompt: 'What went well today that gave you genuine energy and clarity?',
          suggestedTag: 'reflection',
        };
      },

      // --- NOTES CRUD ---
      addNote: (type = 'text', scheduledDate = null) => {
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
          scheduledDate: scheduledDate || null,
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
        const newFolder = { id, name, icon: randomIcon, theme: themeId };

        set((state) => ({
          folders: [...state.folders, newFolder],
          folderThemes: { ...state.folderThemes, [id]: themeId },
        }));
        return id;
      },

      setFolderTheme: (folderId, themeId) => set((state) => ({
        folders: state.folders.map((f) => f.id === folderId ? { ...f, theme: themeId } : f),
        folderThemes: { ...state.folderThemes, [folderId]: themeId },
        ...(state.activeFolderId === folderId ? { activeAestheticTheme: themeId } : {})
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

      lastActiveAt: Date.now(),
      retentionSettings: {
        autoPurgeTrash30Days: true,
      },

      removeSticker: (noteId, stickerId) => set((state) => ({
        notes: state.notes.map((note) => {
          if (note.id !== noteId) return note;
          return {
            ...note,
            stickers: (note.stickers || []).filter((sticker) => sticker.id !== stickerId),
            updatedAt: Date.now()
          };
        })
      })),

      updateRetentionSettings: (settings) => set((state) => ({
        retentionSettings: { ...(state.retentionSettings || {}), ...settings }
      })),

      importWorkspace: (importedData) => set((state) => ({
        ...state,
        notes: importedData.notes || state.notes,
        folders: importedData.folders || state.folders,
        tags: importedData.tags || state.tags,
        journals: importedData.journals || state.journals,
        calendarEvents: importedData.calendarEvents || state.calendarEvents,
        activeAestheticTheme: importedData.activeAestheticTheme || state.activeAestheticTheme,
        folderThemes: importedData.folderThemes || state.folderThemes,
        lastActiveAt: Date.now(),
      })),

      resetWorkspace: () => {
        try {
          localStorage.removeItem('bloom-workspace-storage');
          localStorage.removeItem('slate-notes-storage');
        } catch (e) {}
        window.location.reload();
      },

    }),
    {
      name: 'bloom-workspace-storage', // Independent local-first device storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.journalViewMode = 'notes';
          state.lastActiveAt = Date.now();

          // Smart Inactivity & Memory Box Purge: auto-delete trash notes older than 30 days
          const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
          const now = Date.now();
          if (Array.isArray(state.notes)) {
            state.notes = state.notes.filter((n) => {
              if (n.deletedAt && (now - n.deletedAt > THIRTY_DAYS_MS)) {
                return false; // Automatically purge notes in Memory Box older than 30 days
              }
              return true;
            });
          }
          if (!state.activeAestheticTheme || state.activeAestheticTheme === 'toffee' || state.activeAestheticTheme === 'sunsetMeadow') {
            state.activeAestheticTheme = 'bloom-v2';
          } else if (state.activeAestheticTheme === 'sage') {
            state.activeAestheticTheme = 'matcha';
          } else if (state.activeAestheticTheme === 'matchaFrog') {
            state.activeAestheticTheme = 'matcha';
          } else if (state.activeAestheticTheme === 'lilacMist') {
            state.activeAestheticTheme = 'lavender';
          }
          const defaultThemes = {
            'folder-work': 'matcha',
            'folder-personal': 'rose',
            'folder-ideas': 'lavender',
          };

          if (Array.isArray(state.folders)) {
            state.folders.forEach((f) => {
              if (!f.theme) {
                f.theme = state.folderThemes?.[f.id] || defaultThemes[f.id] || 'caramel';
              }
            });
          }

          state.folderThemes = { ...defaultThemes, ...(state.folderThemes || {}) };

          // Enforce signature classy Bloom v2 theme and collapsed collections drawer
          if (state.activeAestheticTheme !== 'bloom-v2') {
            state.activeAestheticTheme = 'bloom-v2';
          }
          state.sidebarCollapsed = true;

          if (state.activeFolderId) {
            const activeF = (state.folders || []).find((f) => f.id === state.activeFolderId);
            if (activeF?.theme) {
              state.activeAestheticTheme = activeF.theme;
            }
          }

          if (!Array.isArray(state.calendarEvents) || state.calendarEvents.length === 0) {
            state.calendarEvents = [
              {
                id: 'evt-1',
                date: getTodayDateStr(),
                title: 'Morning review and workspace setup',
                category: 'personal',
                time: '09:00',
                completed: true,
              },
              {
                id: 'evt-2',
                date: getTomorrowDateStr(),
                title: 'Review project milestones and deliverables',
                category: 'work',
                time: '11:00',
                completed: false,
              },
              {
                id: 'evt-3',
                date: getTomorrowDateStr(),
                title: 'Evening wrap-up and task planning',
                category: 'reminder',
                time: '19:30',
                completed: false,
              },
            ];
          }
          if (Array.isArray(state.notes)) {
            state.notes.forEach((n) => {
              if (n.id === 'welcome-note') {
                n.title = 'Welcome to Bloom';
                n.content = 'Bloom is a clean workspace for your notes, to-do lists, and calendar tracking.\n\n• Organize notes and checklists into custom-themed folders\n• Mark tasks and keep items in mind using the Calendar & Planner\n• Drag notes in Freeform Board or align neatly in Grid view\n• Device-first storage keeps your data strictly private on this computer';
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
