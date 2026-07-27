export const themes = {
  toffee: {
    id: 'toffee',
    name: 'Toffee',
    frameColor: '#8A6E4E', // Warm caramel brown per spec
    frameColorDark: '#704E32',
    paperColor: '#FBF3E7',
    gridColor: '#EADFCF',
    inkColor: '#543D2B',
    accentColor: '#8A6E4E',
    noteColors: [
      '#C07030',
      '#8B5020',
      '#D4893C',
      '#704018',
      '#E8A040',
      '#9E5B26'
    ],
    noteTextColors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
    handwritingFont: "'Kalam', cursive",
    headerFont: "'Fraunces', serif",
    doodleSet: 'toffee',
    noteBorderStyle: 'torn',
    noteCornerSticker: 'mushroom',
    sidebarBg: 'rgba(243, 237, 222, 0.85)',
    cardBg: '#FBF3E7'
  },
  sage: {
    id: 'sage',
    name: 'Berry Rose',
    frameColor: '#8B1A38', // Rich deep maroon
    frameColorDark: '#5C1F32',
    paperColor: '#FDF5F2',
    gridColor: '#F2DDD8',
    inkColor: '#3D1420',
    accentColor: '#C25070',
    noteColors: [
      '#8B1A38',
      '#C03858',
      '#6A1028',
      '#D85070',
      '#A82848',
      '#801530'
    ],
    noteTextColors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
    handwritingFont: "'Kalam', cursive",
    headerFont: "'Fraunces', serif",
    doodleSet: 'sage',
    noteBorderStyle: 'scalloped',
    noteCornerSticker: 'flower',
    sidebarBg: 'rgba(252, 242, 246, 0.88)',
    cardBg: '#FDF5F2'
  },
  lilacMist: {
    id: 'lilacMist',
    name: 'Lilac Mist',
    frameColor: '#9B78C0', // Rich lilac
    frameColorDark: '#7850A0',
    paperColor: '#FBF3F8',
    gridColor: '#EDD8F0',
    inkColor: '#3C2455',
    accentColor: '#9060B8',
    noteColors: [
      '#7848B0',
      '#5030A0',
      '#9060C8',
      '#401888',
      '#B878D8',
      '#64389C'
    ],
    noteTextColors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
    handwritingFont: "'Comfortaa', sans-serif",
    headerFont: "'Quicksand', sans-serif",
    doodleSet: 'lilac',
    noteBorderStyle: 'plain',
    noteCornerSticker: 'sparkle',
    sidebarBg: 'rgba(248, 245, 252, 0.85)',
    cardBg: '#FBF3F8'
  },
  matchaFrog: {
    id: 'matchaFrog',
    name: 'Matcha Frog Café',
    frameColor: '#7A9B76',
    frameColorDark: '#5F7D5C',
    paperColor: '#EAF3E3',
    gridColor: '#D9E8CE',
    inkColor: '#33422E',
    accentColor: '#C9A876', // Latte tan
    noteColors: ['#5A8A50', '#C9A050', '#407838', '#A87830', '#72A858', '#4E7844'],
    noteTextColors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
    handwritingFont: "'Comfortaa', sans-serif",
    headerFont: "'Quicksand', sans-serif",
    doodleSet: 'matcha',
    noteBorderStyle: 'matcha',
    noteCornerSticker: 'daisy',
    sidebarBg: 'rgba(225, 235, 218, 0.85)',
    cardBg: '#EAF3E3'
  },
  sunsetMeadow: {
    id: 'sunsetMeadow',
    name: 'Sunset Meadow',
    frameColor: '#D98E5C',
    frameColorDark: '#BC7344',
    paperColor: '#FFF6EA',
    gridColor: '#F3DFC4',
    inkColor: '#5C3D2E',
    accentColor: '#E8A639', // Marigold
    noteColors: ['#C86010', '#E8A030', '#A84808', '#D07828', '#B85018', '#9B4008'],
    noteTextColors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
    handwritingFont: "'Patrick Hand', cursive",
    headerFont: "'Comfortaa', sans-serif",
    doodleSet: 'sunset',
    noteBorderStyle: 'wave',
    noteCornerSticker: 'wildflower',
    sidebarBg: 'rgba(251, 240, 226, 0.85)',
    cardBg: '#FFF6EA'
  }
};


export const applyTheme = (theme) => {
  if (!theme) return;
  const root = document.documentElement;

  root.style.setProperty('--frame-color', theme.frameColor);
  root.style.setProperty('--frame-color-dark', theme.frameColorDark);
  root.style.setProperty('--paper-color', theme.paperColor);
  root.style.setProperty('--grid-color', theme.gridColor);
  root.style.setProperty('--ink-color', theme.inkColor);
  root.style.setProperty('--accent-color', theme.accentColor);
  root.style.setProperty('--handwriting-font', theme.handwritingFont);
  root.style.setProperty('--header-font', theme.headerFont);

  // Set note colors
  theme.noteColors.forEach((color, idx) => {
    root.style.setProperty(`--color-note-${idx + 1}`, color);
  });
  theme.noteTextColors.forEach((color, idx) => {
    root.style.setProperty(`--color-note-text-${idx + 1}`, color);
  });

  // Derived styling variables
  root.style.setProperty('--color-text', theme.inkColor);
  root.style.setProperty('--color-text-muted', `${theme.inkColor}99`);
  root.style.setProperty('--color-sidebar-bg', theme.sidebarBg);
  root.style.setProperty('--color-accent', theme.accentColor);
  root.style.setProperty('--color-accent-bg', `${theme.accentColor}18`);
  root.style.setProperty('--color-accent-border', `${theme.accentColor}33`);
  root.style.setProperty('--color-accent-text', theme.accentColor);
  root.style.setProperty('--color-card-bg', theme.cardBg);
  root.style.setProperty('--color-grid-dot', theme.gridColor);
};
