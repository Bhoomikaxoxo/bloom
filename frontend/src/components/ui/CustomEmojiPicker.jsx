import React, { useState, useMemo } from 'react';
import emojiData from '@emoji-mart/data';
import { Search, X } from 'lucide-react';

/**
 * Category Definitions mapping @emoji-mart/data categories to friendly icons and names
 */
const CATEGORY_MAP = [
  { id: 'frequent', name: 'Cute & Cozy', icon: '🌸' },
  { id: 'people', name: 'Smileys & People', icon: '😀' },
  { id: 'nature', name: 'Animals & Nature', icon: '🐱' },
  { id: 'foods', name: 'Food & Drink', icon: '🍔' },
  { id: 'activity', name: 'Activities', icon: '⚽' },
  { id: 'places', name: 'Travel & Places', icon: '✈️' },
  { id: 'objects', name: 'Objects', icon: '💡' },
  { id: 'symbols', name: 'Symbols', icon: '🔣' },
  { id: 'flags', name: 'Flags', icon: '🚩' }
];

const CustomEmojiPicker = ({ onSelect, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('people');
  const [search, setSearch] = useState('');

  // Process and index all emojis from @emoji-mart/data
  const allEmojis = useMemo(() => {
    const list = [];
    const emojiMap = emojiData.emojis || {};

    Object.keys(emojiMap).forEach((id) => {
      const item = emojiMap[id];
      const native = item.skins?.[0]?.native;
      if (native) {
        list.push({
          id: item.id,
          name: item.name,
          keywords: item.keywords || [],
          native: native,
        });
      }
    });

    return list;
  }, []);

  // Category to emoji list map
  const categoryEmojisMap = useMemo(() => {
    const map = {};
    const categories = emojiData.categories || [];
    const emojiMap = emojiData.emojis || {};

    categories.forEach((cat) => {
      const items = (cat.emojis || [])
        .map((id) => {
          const item = emojiMap[id];
          if (!item) return null;
          const native = item.skins?.[0]?.native;
          return native
            ? { id: item.id, name: item.name, keywords: item.keywords || [], native }
            : null;
        })
        .filter(Boolean);

      map[cat.id] = items;
    });

    // Special "Cute & Cozy" category fallback / default
    map['frequent'] = (map['people'] || []).slice(0, 18).concat((map['nature'] || []).slice(0, 12));

    return map;
  }, []);

  // Instant live search across names AND keywords
  const searchResults = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return [];

    return allEmojis.filter((emoji) => {
      if (emoji.name.toLowerCase().includes(query)) return true;
      if (emoji.id.toLowerCase().includes(query)) return true;
      return emoji.keywords.some((kw) => kw.toLowerCase().includes(query));
    });
  }, [search, allEmojis]);

  const isSearching = search.trim().length > 0;
  const displayEmojis = isSearching
    ? searchResults
    : categoryEmojisMap[activeCategory] || [];

  const currentCategoryName = CATEGORY_MAP.find((c) => c.id === activeCategory)?.name || 'Emojis';

  return (
    <div className="w-[330px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-3 flex flex-col gap-2.5 animate-fade-in text-slate-800 dark:text-slate-100 select-none">
      {/* Header Search Input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search all emojis by name or keyword (e.g. happy)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100 dark:bg-slate-700/60 rounded-xl outline-none border border-transparent focus:border-purple-400 transition-all placeholder-slate-400"
            autoFocus
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Close picker"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Category Tabs: Shown ONLY when NOT searching */}
      {!isSearching && (
        <div className="flex gap-1 border-b border-slate-100 dark:border-slate-700/60 pb-1.5 overflow-x-auto no-scrollbar">
          {CATEGORY_MAP.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 shadow-xs'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500'
              }`}
              title={cat.name}
            >
              <span>{cat.icon}</span>
            </button>
          ))}
        </div>
      )}

      {/* Category Header: Shown ONLY when NOT searching */}
      {!isSearching && (
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
          {currentCategoryName}
        </div>
      )}

      {/* Search Header: Shown ONLY when searching */}
      {isSearching && (
        <div className="text-[11px] font-bold uppercase tracking-wider text-purple-500 px-1">
          Search Results ({searchResults.length}):
        </div>
      )}

      {/* Emoji Grid */}
      <div className="h-[250px] overflow-y-auto pr-1">
        {displayEmojis.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
            <span>No matching emojis found 🔎</span>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-1">
            {displayEmojis.map((emoji, index) => (
              <button
                key={`${emoji.id}-${index}`}
                type="button"
                onClick={() => onSelect(emoji.native)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-purple-100/70 dark:hover:bg-slate-700 text-2xl transition-transform active:scale-75 cursor-pointer"
                title={`${emoji.name} (${emoji.native})`}
              >
                {emoji.native}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomEmojiPicker;
