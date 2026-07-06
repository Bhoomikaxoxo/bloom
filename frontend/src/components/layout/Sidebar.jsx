import React, { useState, useEffect, useRef } from 'react';
import useSlateStore from '../../store/useSlateStore';
import { Grid, Trash2, Folder, Tag, Plus, X } from 'lucide-react';
import { StarDoodle } from '../ui/Doodles';

const Sidebar = () => {
  const {
    folders,
    tags,
    activeFolderId,
    activeTagId,
    viewMode,
    currentTheme,
    showTrash,
    setActiveFolderId,
    setActiveTagId,
    setViewMode,
    setCurrentTheme,
    setShowTrash,
    addFolder,
    deleteFolder,
    updateFolder,
    addTag,
    deleteTag,
    notes,
  } = useSlateStore();

  const [newFolderName, setNewFolderName] = useState('');
  const [showAddFolder, setShowAddFolder] = useState(false);
  
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('lavender');
  const [showAddTag, setShowAddTag] = useState(false);

  // Emoji customization state
  const [editingFolderId, setEditingFolderId] = useState(null);
  const emojiMenuRef = useRef(null);

  const activeNotesCount = notes.filter((n) => n.deletedAt === null).length;
  const deletedNotesCount = notes.filter((n) => n.deletedAt !== null).length;

  const handleAddFolder = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
      setShowAddFolder(false);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTagName.trim()) {
      addTag(newTagName.trim(), newTagColor);
      setNewTagName('');
      setShowAddTag(false);
    }
  };

  // Close emoji selector on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiMenuRef.current && !emojiMenuRef.current.contains(e.target)) {
        setEditingFolderId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tagColors = [
    { name: 'lavender', class: 'bg-[#e9d5ff]' },
    { name: 'mint', class: 'bg-[#ccfbf1]' },
    { name: 'pink', class: 'bg-[#fce7f3]' },
    { name: 'yellow', class: 'bg-[#fef9c3]' },
    { name: 'blue', class: 'bg-[#dbeafe]' },
  ];

  const cuteEmojis = [
    '📁', '💼', '💖', '💡', '🌟', '🍀', '🍓', '🎒', 
    '🧁', '🧸', '🎨', '🎮', '✈️', '🌸', '🍩', '🥑', 
    '🪐', '🌈', '🍪', '🐱', '🐶', '🦄', '🐝', '🔮'
  ];

  return (
    <aside className="w-64 bg-[var(--color-sidebar-bg)] backdrop-blur-md border-r border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col h-screen overflow-y-auto select-none transition-colors duration-300">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-8">
        <div className="relative">
          <span className="text-3xl">🪞</span>
          <StarDoodle className="absolute -top-1 -right-2 w-4 h-4 text-purple-400 animate-bounce" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 tracking-wide">
            Slate
          </h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 tracking-wider uppercase font-semibold">notes & tasks</p>
        </div>
      </div>

      {/* Primary Folder Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          <span>Folders 🍯</span>
          <button
            onClick={() => setShowAddFolder(!showAddFolder)}
            className="hover:text-accent p-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Create Folder"
            aria-label="Create new folder"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {showAddFolder && (
          <form onSubmit={handleAddFolder} className="mb-3 flex gap-1.5 animate-fade-in">
            <input
              type="text"
              placeholder="Jar name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="cutesy-input text-sm py-1.5 px-3 flex-1 border-slate-200 dark:border-slate-700 bg-white/90"
              autoFocus
            />
            <button type="submit" className="cutesy-btn text-xs py-1.5 px-2 bg-purple-400 hover:bg-purple-500 text-white font-bold">
              Add
            </button>
          </form>
        )}

        <div className="space-y-1">
          <button
            onClick={() => {
              setActiveFolderId(null);
              setActiveTagId(null);
              setShowTrash(false);
            }}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between group border ${
              activeFolderId === null && !activeTagId && !showTrash
                ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent-text)] border-[var(--color-accent-border)] shadow-sm'
                : 'hover:bg-white/40 dark:hover:bg-slate-800/30 text-[var(--color-text)] opacity-80 hover:opacity-100 border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>🌟</span>
              <span>All Notes</span>
            </div>
            <span className="text-xs bg-slate-200/50 dark:bg-slate-800/80 px-2 py-0.5 rounded-full text-slate-500">
              {activeNotesCount}
            </span>
          </button>

          {folders.map((folder) => {
            const isSelected = activeFolderId === folder.id;
            const count = notes.filter((n) => n.folderId === folder.id && n.deletedAt === null).length;
            const isEditing = editingFolderId === folder.id;

            return (
              <div key={folder.id} className="group relative">
                <div
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between border ${
                    isSelected
                      ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent-text)] border-[var(--color-accent-border)] shadow-sm'
                      : 'hover:bg-white/40 dark:hover:bg-slate-800/30 text-[var(--color-text)] opacity-80 hover:opacity-100 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-4 flex-1">
                    {/* Clickable Emoji Picker Trigger */}
                    <div className="relative" ref={isEditing ? emojiMenuRef : null}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFolderId(isEditing ? null : folder.id);
                        }}
                        className="hover:bg-white/60 dark:hover:bg-slate-700/60 p-1 rounded-lg transition-transform active:scale-90 select-none text-base"
                        title="Change Emoji"
                      >
                        {folder.icon}
                      </button>

                      {isEditing && (
                        <div className="absolute left-0 top-full mt-1.5 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-2 rounded-2xl shadow-xl z-50 grid grid-cols-6 gap-1 w-48 animate-fade-in text-slate-700 dark:text-slate-200">
                          {cuteEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateFolder(folder.id, { icon: emoji });
                                setEditingFolderId(null);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-base transition-transform active:scale-75"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveFolderId(folder.id)}
                      className="truncate text-left flex-1"
                    >
                      {folder.name}
                    </button>
                  </div>

                  <span className="text-xs bg-slate-200/50 dark:bg-slate-800/80 px-2 py-0.5 rounded-full text-slate-500 group-hover:hidden">
                    {count}
                  </span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete the "${folder.name}" folder? Notes will remain unassigned.`)) {
                      deleteFolder(folder.id);
                    }
                  }}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1 rounded"
                  title="Delete Folder"
                  aria-label={`Delete folder ${folder.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tags Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          <span>Tags 🏷️</span>
          <button
            onClick={() => setShowAddTag(!showAddTag)}
            className="hover:text-accent p-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Create Tag"
            aria-label="Create new tag"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {showAddTag && (
          <form onSubmit={handleAddTag} className="mb-3 p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl space-y-2 animate-fade-in">
            <input
              type="text"
              placeholder="Tag name..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="cutesy-input text-sm py-1 px-2.5 w-full border-slate-200 dark:border-slate-700 bg-white"
              autoFocus
            />
            <div className="flex gap-1 items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">Color:</span>
              <div className="flex gap-1">
                {tagColors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setNewTagColor(color.name)}
                    className={`w-4.5 h-4.5 rounded-full border transition-all ${color.class} ${
                      newTagColor === color.name ? 'ring-2 ring-purple-400 border-white scale-110' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-1">
              <button
                type="button"
                onClick={() => setShowAddTag(false)}
                className="text-[10px] px-2 py-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cutesy-btn text-[10px] py-1 px-2 bg-purple-400 hover:bg-purple-500 text-white font-bold"
              >
                Create
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => {
            const isSelected = activeTagId === tag.id;
            const colorMap = {
              pink: 'bg-rose-100 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/30',
              lavender: 'bg-purple-100 text-purple-700 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/30',
              mint: 'bg-teal-100 text-teal-700 border-teal-200/60 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/30',
              yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200/60 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900/30',
              blue: 'bg-blue-100 text-blue-700 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/30',
            };
            const colorClass = colorMap[tag.color] || colorMap.blue;

            return (
              <div key={tag.id} className="relative group/tag flex items-center">
                <button
                  onClick={() => setActiveTagId(isSelected ? null : tag.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'ring-2 ring-purple-400 scale-105 shadow-sm font-bold'
                      : 'opacity-85 hover:opacity-100'
                  } ${colorClass}`}
                >
                  #{tag.name}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Remove the tag "#${tag.name}"? It will be removed from all notes.`)) {
                      deleteTag(tag.id);
                    }
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-red-400 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/tag:opacity-100 transition-opacity border border-white"
                  title="Remove Tag"
                  aria-label={`Remove tag ${tag.name}`}
                >
                  <X className="w-2 h-2" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theme Picker */}
      <div className="mb-6">
        <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-3">
          Palette 🎨
        </span>
        <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
          {[
            { id: 'pastel-dream', name: 'Pastel Dream', colors: ['bg-[#e9d5ff]', 'bg-[#ccfbf1]', 'bg-[#fce7f3]'] },
            { id: 'mint-garden', name: 'Mint Garden', colors: ['bg-[#d1fae5]', 'bg-[#e6fffa]', 'bg-[#faf5ff]'] },
            { id: 'sunset-peach', name: 'Sunset Peach', colors: ['bg-[#ffedd5]', 'bg-[#fee2e2]', 'bg-[#fef3c7]'] },
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => setCurrentTheme(theme.id)}
              className={`w-full aspect-square rounded-xl border flex flex-col p-1.5 items-center justify-center gap-0.5 hover:scale-105 active:scale-95 transition-all relative ${
                currentTheme === theme.id ? 'border-purple-400 ring-2 ring-purple-400/40 scale-105' : 'border-slate-200 dark:border-slate-700'
              }`}
              title={theme.name}
            >
              <div className="grid grid-cols-3 gap-0.5 w-full h-full rounded overflow-hidden">
                <div className={`h-full w-full ${theme.colors[0]}`} />
                <div className={`h-full w-full ${theme.colors[1]}`} />
                <div className={`h-full w-full ${theme.colors[2]}`} />
              </div>
              {currentTheme === theme.id && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-400 rounded-full border border-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-8">
        <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-3">
          Workspace View 🗺️
        </span>
        <div className="flex bg-slate-50 dark:bg-slate-800/40 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600 dark:text-purple-300'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('board')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'board'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600 dark:text-purple-300'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Board
          </button>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
        {/* Memory Box (Trash) Toggle */}
        <button
          onClick={() => setShowTrash(!showTrash)}
          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between border ${
            showTrash
              ? 'bg-pink-100/50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-300 shadow-sm border-pink-200/30 dark:border-pink-900/20'
              : 'hover:bg-white/40 dark:hover:bg-slate-800/30 text-[var(--color-text)] opacity-80 hover:opacity-100 border-transparent'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>📦</span>
            <span>Memory Box</span>
          </div>
          <span className="text-xs bg-slate-200/50 dark:bg-slate-800/80 px-2 py-0.5 rounded-full text-slate-500">
            {deletedNotesCount}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
