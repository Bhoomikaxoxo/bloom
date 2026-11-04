// Bloom Theme Configuration - High-contrast, rich aesthetic stationery palettes

export const TAG_COLOR_MAP = {
  pink: {
    badge: 'bg-rose-100/90 text-rose-800 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60',
    dot: '#F43F5E',
  },
  lavender: {
    badge: 'bg-purple-100/90 text-purple-800 border-purple-200/80 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60',
    dot: '#A855F7',
  },
  mint: {
    badge: 'bg-emerald-100/90 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60',
    dot: '#10B981',
  },
  sage: {
    badge: 'bg-teal-100/90 text-teal-800 border-teal-200/80 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800/60',
    dot: '#14B8A6',
  },
  amber: {
    badge: 'bg-amber-100/90 text-amber-800 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60',
    dot: '#F59E0B',
  },
  sky: {
    badge: 'bg-sky-100/90 text-sky-800 border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/60',
    dot: '#0EA5E9',
  },
};

export const THEMES = [
  {
    id: 'bloom-v2',
    name: 'Botanical Linen',
    accentColor: '#A8491F',
    accentColorDark: '#87330E',
    accentBg: 'rgba(168, 73, 31, 0.12)',
    accentBorder: 'rgba(168, 73, 31, 0.32)',
    paperColor: '#EFE9DC',
    sidebarBg: '#E4DDCC',
    cardBg: '#F7F4EC',
    cardBorder: '#D8D0BC',
    gridColor: 'rgba(107, 127, 99, 0.15)',
    inkColor: '#1B2420',
    mutedColor: '#3A463E',
    isDark: false,
    gradient: {
      from: '#EFE9DC',
      via: '#EFE9DC',
      to: '#E4DDCC',
    },
    noteColors: [
      '#F7F4EC',
      '#FAF8F2',
      '#F3EEE2',
      '#FBF9F4',
      '#F5EFE3',
      '#EDE7D9',
    ],
    noteBorderColors: [
      '#A8491F',
      '#6B7F63',
      '#C9A135',
      '#3A463E',
      '#9DAC95',
      '#D4673A',
    ],
  },
  {
    id: 'caramel',
    name: 'Honey Caramel',
    accentColor: '#B65E19',
    accentColorDark: '#8F460E',
    accentBg: 'rgba(182, 94, 25, 0.14)',
    accentBorder: 'rgba(182, 94, 25, 0.32)',
    paperColor: '#DFD1BD',
    sidebarBg: '#E9DFCFCF',
    cardBg: '#FFFFFF',
    cardBorder: '#C4B198',
    gridColor: 'rgba(182, 94, 25, 0.16)',
    inkColor: '#261C14',
    mutedColor: '#6B5A4B',
    isDark: false,
    gradient: {
      from: '#E8DBC9',
      via: '#DFD0BC',
      to: '#D2C1A8',
    },
    noteColors: [
      '#FFFFFF',
      '#FFFEFC',
      '#FFFCF7',
      '#FFF9F2',
      '#FFFBF5',
      '#FFFDF9',
    ],
    noteBorderColors: [
      '#B65E19',
      '#CC7325',
      '#DB8B40',
      '#C5925E',
      '#AD5D1B',
      '#93471D',
    ],
  },
  {
    id: 'rose',
    name: 'Blush & Petal',
    accentColor: '#C93B5D',
    accentColorDark: '#A82545',
    accentBg: 'rgba(201, 59, 93, 0.14)',
    accentBorder: 'rgba(201, 59, 93, 0.32)',
    paperColor: '#EBCDD7',
    sidebarBg: '#F3DEE5CF',
    cardBg: '#FFFFFF',
    cardBorder: '#D4A8B6',
    gridColor: 'rgba(201, 59, 93, 0.16)',
    inkColor: '#28171D',
    mutedColor: '#704E59',
    isDark: false,
    gradient: {
      from: '#F2D7E0',
      via: '#EBCDD7',
      to: '#DEBCC7',
    },
    noteColors: [
      '#FFFFFF',
      '#FFFEFE',
      '#FFF8FA',
      '#FFF5F8',
      '#FFF9FB',
      '#FFFCFD',
    ],
    noteBorderColors: [
      '#C93B5D',
      '#D75C7B',
      '#E3839C',
      '#B83353',
      '#DF6C8A',
      '#C74B6A',
    ],
  },
  {
    id: 'matcha',
    name: 'Matcha & Sage',
    accentColor: '#246D46',
    accentColorDark: '#185032',
    accentBg: 'rgba(36, 109, 70, 0.14)',
    accentBorder: 'rgba(36, 109, 70, 0.32)',
    paperColor: '#D3E2D5',
    sidebarBg: '#E0EBE2CF',
    cardBg: '#FFFFFF',
    cardBorder: '#AEC7B1',
    gridColor: 'rgba(36, 109, 70, 0.16)',
    inkColor: '#122116',
    mutedColor: '#4A6150',
    isDark: false,
    gradient: {
      from: '#DDE8DF',
      via: '#D3E2D5',
      to: '#C3D7C5',
    },
    noteColors: [
      '#FFFFFF',
      '#FFFEFE',
      '#F8FCF9',
      '#F4FAF5',
      '#F7FBF8',
      '#FAFCFA',
    ],
    noteBorderColors: [
      '#246D46',
      '#358C5D',
      '#54A879',
      '#1C5938',
      '#437E5C',
      '#2C6D4A',
    ],
  },
  {
    id: 'lavender',
    name: 'Lavender Mist',
    accentColor: '#6741AA',
    accentColorDark: '#4F2B8E',
    accentBg: 'rgba(103, 65, 170, 0.14)',
    accentBorder: 'rgba(103, 65, 170, 0.32)',
    paperColor: '#DBD0EA',
    sidebarBg: '#E7DEF2CF',
    cardBg: '#FFFFFF',
    cardBorder: '#BEB0D8',
    gridColor: 'rgba(103, 65, 170, 0.16)',
    inkColor: '#1B142B',
    mutedColor: '#5D5072',
    isDark: false,
    gradient: {
      from: '#E4DAF0',
      via: '#DBD0EA',
      to: '#CCC0DF',
    },
    noteColors: [
      '#FFFFFF',
      '#FFFEFE',
      '#FAF8FD',
      '#F6F3FB',
      '#F8F5FD',
      '#FCFBFE',
    ],
    noteBorderColors: [
      '#6741AA',
      '#7F5BBB',
      '#9979CD',
      '#563198',
      '#7350B0',
      '#5F3B9F',
    ],
  },
  {
    id: 'midnight',
    name: 'Midnight Velvet',
    accentColor: '#38BDF8',
    accentColorDark: '#0284C7',
    accentBg: 'rgba(56, 189, 248, 0.16)',
    accentBorder: 'rgba(56, 189, 248, 0.38)',
    paperColor: '#070B13',
    sidebarBg: '#0C121FCF',
    cardBg: '#131B2A',
    cardBorder: '#23324C',
    gridColor: 'rgba(56, 189, 248, 0.09)',
    inkColor: '#F8FAFC',
    mutedColor: '#94A3B8',
    isDark: true,
    gradient: {
      from: '#05070D',
      via: '#090D17',
      to: '#0D1320',
    },
    noteColors: [
      '#131B2A',
      '#151F30',
      '#172336',
      '#141D2D',
      '#162133',
      '#141C2C',
    ],
    noteBorderColors: [
      '#38BDF8',
      '#818CF8',
      '#C084FC',
      '#F472B6',
      '#34D399',
      '#FBBF24',
    ],
  },
];

// Map lookup by ID
export const themes = THEMES.reduce((acc, t) => {
  acc[t.id] = t;
  return acc;
}, {});

// Backward compatibility aliases
themes.toffee = themes.caramel;
themes.sage = themes.matcha;
themes.matchaFrog = themes.matcha;
themes.lilacMist = themes.lavender;
themes.sunsetMeadow = themes.caramel;

export const applyTheme = (theme) => {
  if (!theme) return;
  const root = document.documentElement;

  root.style.setProperty('--frame-color', theme.accentColor);
  root.style.setProperty('--frame-color-dark', theme.accentColorDark);
  root.style.setProperty('--paper-color', theme.paperColor);
  root.style.setProperty('--grid-color', theme.gridColor);
  root.style.setProperty('--ink-color', theme.inkColor);
  root.style.setProperty('--accent-color', theme.accentColor);

  theme.noteColors.forEach((color, idx) => {
    root.style.setProperty(`--color-note-${idx + 1}`, color);
  });
  theme.noteBorderColors.forEach((color, idx) => {
    root.style.setProperty(`--color-note-border-${idx + 1}`, color);
  });

  root.style.setProperty('--color-text', theme.inkColor);
  root.style.setProperty('--color-text-muted', theme.mutedColor);
  root.style.setProperty('--color-sidebar-bg', theme.sidebarBg);
  root.style.setProperty('--color-accent', theme.accentColor);
  root.style.setProperty('--color-accent-bg', theme.accentBg);
  root.style.setProperty('--color-accent-border', theme.accentBorder);
  root.style.setProperty('--color-card-bg', theme.cardBg);
  root.style.setProperty('--color-card-border', theme.cardBorder);
  root.style.setProperty('--color-grid-dot', theme.gridColor);

  // Bloom v2 Botanical Linen Tokens - Always preserve iconic classy linen & forest ink
  root.style.setProperty('--bone', '#EFE9DC');
  root.style.setProperty('--bone-dim', '#E4DDCC');
  root.style.setProperty('--ink', '#1B2420');
  root.style.setProperty('--ink-soft', '#3A463E');
  root.style.setProperty('--card', '#F7F4EC');
  root.style.setProperty('--line', '#D8D0BC');
  root.style.setProperty('--sage', '#6B7F63');
  root.style.setProperty('--sage-dim', '#9DAC95');
  root.style.setProperty('--brick', '#A8491F');
  root.style.setProperty('--gold', '#C9A135');
  root.style.setProperty('--rail', '#1B2420');

  root.style.setProperty('--color-bg-from', '#EFE9DC');
  root.style.setProperty('--color-bg-via', '#EFE9DC');
  root.style.setProperty('--color-bg-to', '#E4DDCC');

  if (theme.isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};
