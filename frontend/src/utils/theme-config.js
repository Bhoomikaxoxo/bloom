// Bloom Theme Configuration - High-contrast aesthetic stationery palettes

export const THEMES = [
  {
    id: 'caramel',
    name: 'Honey Caramel',
    accentColor: '#C26D28',
    accentColorDark: '#9C531B',
    accentBg: 'rgba(194, 109, 40, 0.12)',
    accentBorder: 'rgba(194, 109, 40, 0.28)',
    paperColor: '#EFE6D8',
    sidebarBg: '#F6F0E6',
    cardBg: '#FFFFFF',
    cardBorder: '#D8CAB7',
    gridColor: 'rgba(194, 109, 40, 0.12)',
    inkColor: '#2B2118',
    mutedColor: '#7A6B5D',
    isDark: false,
    gradient: {
      from: '#F4ECE0',
      via: '#EFE5D6',
      to: '#E3D7C4',
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
    accentBg: 'rgba(217, 74, 107, 0.12)',
    accentBorder: 'rgba(217, 74, 107, 0.28)',
    paperColor: '#F6E5EB',
    sidebarBg: '#FAF0F3',
    cardBg: '#FFFFFF',
    cardBorder: '#E5CBD3',
    gridColor: 'rgba(217, 74, 107, 0.12)',
    inkColor: '#2C1D22',
    mutedColor: '#7D626B',
    isDark: false,
    gradient: {
      from: '#F9EBEF',
      via: '#F5E3E9',
      to: '#EED6DE',
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
    accentBg: 'rgba(46, 125, 82, 0.12)',
    accentBorder: 'rgba(46, 125, 82, 0.28)',
    paperColor: '#E2ECE3',
    sidebarBg: '#EEF5EF',
    cardBg: '#FFFFFF',
    cardBorder: '#C6D8C8',
    gridColor: 'rgba(46, 125, 82, 0.12)',
    inkColor: '#17261B',
    mutedColor: '#5C7161',
    isDark: false,
    gradient: {
      from: '#E8F1E9',
      via: '#E1EBE2',
      to: '#D4E2D6',
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
    accentBg: 'rgba(117, 81, 181, 0.12)',
    accentBorder: 'rgba(117, 81, 181, 0.28)',
    paperColor: '#EAE4F4',
    sidebarBg: '#F3EEFA',
    cardBg: '#FFFFFF',
    cardBorder: '#D4CAE5',
    gridColor: 'rgba(117, 81, 181, 0.12)',
    inkColor: '#20192F',
    mutedColor: '#6B627D',
    isDark: false,
    gradient: {
      from: '#EFE8F7',
      via: '#E8E0F2',
      to: '#DCD4EB',
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
    accentBg: 'rgba(56, 189, 248, 0.14)',
    accentBorder: 'rgba(56, 189, 248, 0.35)',
    paperColor: '#090D16',
    sidebarBg: '#0F1626',
    cardBg: '#151D2E',
    cardBorder: '#26344F',
    gridColor: 'rgba(56, 189, 248, 0.08)',
    inkColor: '#F8FAFC',
    mutedColor: '#94A3B8',
    isDark: true,
    gradient: {
      from: '#060910',
      via: '#0A0E18',
      to: '#0F1524',
    },
    noteColors: [
      '#151D2E',
      '#172033',
      '#192338',
      '#161F32',
      '#182136',
      '#151D2F',
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
