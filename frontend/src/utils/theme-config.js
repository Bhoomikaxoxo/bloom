// Bloom Theme Configuration - Refined, high-contrast aesthetic palettes

export const THEMES = [
  {
    id: 'caramel',
    name: 'Honey Caramel',
    accentColor: '#C26D28',
    accentColorDark: '#9C531B',
    accentBg: 'rgba(194, 109, 40, 0.10)',
    accentBorder: 'rgba(194, 109, 40, 0.25)',
    paperColor: '#FBF9F4',
    sidebarBg: '#F5F1E8',
    cardBg: '#FFFFFF',
    cardBorder: '#E8E2D5',
    gridColor: 'rgba(194, 109, 40, 0.08)',
    inkColor: '#2B2118',
    mutedColor: '#7A6B5D',
    isDark: false,
    gradient: {
      from: '#FAF7F0',
      via: '#F7F3E9',
      to: '#F0E9DA',
    },
    noteColors: [
      '#FFFFFF',
      '#FFFDF9',
      '#FFF9F0',
      '#FEF5E7',
      '#FDF8EE',
      '#FBF5E6',
    ],
    noteBorderColors: [
      '#C26D28',
      '#D98236',
      '#E59E58',
      '#D4A373',
      '#BC6C25',
      '#A0522D',
    ],
  },
  {
    id: 'rose',
    name: 'Blush & Petal',
    accentColor: '#D94A6B',
    accentColorDark: '#B83251',
    accentBg: 'rgba(217, 74, 107, 0.10)',
    accentBorder: 'rgba(217, 74, 107, 0.25)',
    paperColor: '#FDF8F9',
    sidebarBg: '#F9EFF2',
    cardBg: '#FFFFFF',
    cardBorder: '#EEDCE2',
    gridColor: 'rgba(217, 74, 107, 0.08)',
    inkColor: '#2C1D22',
    mutedColor: '#7D626B',
    isDark: false,
    gradient: {
      from: '#FCF5F7',
      via: '#F9EEF2',
      to: '#F5E4EB',
    },
    noteColors: [
      '#FFFFFF',
      '#FFF9FA',
      '#FFF3F6',
      '#FEEBF1',
      '#FDF2F5',
      '#FAEAEE',
    ],
    noteBorderColors: [
      '#D94A6B',
      '#E26D88',
      '#EFA0B2',
      '#C44569',
      '#EA7793',
      '#D65A79',
    ],
  },
  {
    id: 'matcha',
    name: 'Matcha & Sage',
    accentColor: '#2E7D52',
    accentColorDark: '#1E5838',
    accentBg: 'rgba(46, 125, 82, 0.10)',
    accentBorder: 'rgba(46, 125, 82, 0.25)',
    paperColor: '#F7FAF7',
    sidebarBg: '#EEF4EF',
    cardBg: '#FFFFFF',
    cardBorder: '#DCE7DD',
    gridColor: 'rgba(46, 125, 82, 0.08)',
    inkColor: '#17261B',
    mutedColor: '#5C7161',
    isDark: false,
    gradient: {
      from: '#F5F9F5',
      via: '#EFF5F0',
      to: '#E5EFE7',
    },
    noteColors: [
      '#FFFFFF',
      '#F9FCF9',
      '#F1F8F2',
      '#E9F4EB',
      '#F4FAF5',
      '#EBF5ED',
    ],
    noteBorderColors: [
      '#2E7D52',
      '#3F9E6B',
      '#66BB87',
      '#226640',
      '#4E8C67',
      '#357A54',
    ],
  },
  {
    id: 'lavender',
    name: 'Lavender Mist',
    accentColor: '#7551B5',
    accentColorDark: '#5B3B96',
    accentBg: 'rgba(117, 81, 181, 0.10)',
    accentBorder: 'rgba(117, 81, 181, 0.25)',
    paperColor: '#F9F8FD',
    sidebarBg: '#F1EFF8',
    cardBg: '#FFFFFF',
    cardBorder: '#E3DFEE',
    gridColor: 'rgba(117, 81, 181, 0.08)',
    inkColor: '#20192F',
    mutedColor: '#6B627D',
    isDark: false,
    gradient: {
      from: '#F8F6FC',
      via: '#F2EFF9',
      to: '#EAE5F5',
    },
    noteColors: [
      '#FFFFFF',
      '#FAF9FD',
      '#F4F1FA',
      '#EDE8F7',
      '#F6F3FC',
      '#EFEAF8',
    ],
    noteBorderColors: [
      '#7551B5',
      '#8E6DC9',
      '#AB91DC',
      '#623FA2',
      '#7F5EBE',
      '#6A48AC',
    ],
  },
  {
    id: 'midnight',
    name: 'Midnight Velvet',
    accentColor: '#38BDF8',
    accentColorDark: '#0284C7',
    accentBg: 'rgba(56, 189, 248, 0.12)',
    accentBorder: 'rgba(56, 189, 248, 0.30)',
    paperColor: '#0B0F19',
    sidebarBg: '#0F172A',
    cardBg: '#182032',
    cardBorder: '#27354E',
    gridColor: 'rgba(255, 255, 255, 0.06)',
    inkColor: '#F8FAFC',
    mutedColor: '#94A3B8',
    isDark: true,
    gradient: {
      from: '#070B13',
      via: '#0B0F19',
      to: '#111827',
    },
    noteColors: [
      '#182032',
      '#1A2438',
      '#1D2940',
      '#202E48',
      '#1E2A42',
      '#1C263C',
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

  if (theme.gradient) {
    root.style.setProperty('--color-bg-from', theme.gradient.from);
    root.style.setProperty('--color-bg-via', theme.gradient.via);
    root.style.setProperty('--color-bg-to', theme.gradient.to);
  }

  if (theme.isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};
