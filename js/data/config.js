window.REGULATIONS_DATA = window.REGULATIONS_DATA || {};

const APP_CONFIG = {
  organizationName: 'РОССЕТИ КУБАНЬ',
  appTitle: 'МЕТОДИКА ОРГАНИЗАЦИИ РАБОТЫ БЛОКА РЕАЛИЗАЦИИ И РАЗВИТИЯ УСЛУГ',
  themes: [
    { id: 'default', name: 'Классическая тема' },
    { id: 'energy', name: 'Энергия' },
    { id: 'purple', name: 'Фиолетовые сумерки' },
    { id: 'ocean', name: 'Океан' }
  ],
  regulations: [
    {
      id: 'r057-2022',
      title: 'Р 057-2022 - Регламент работы по выявлению, сокращению и исключению бездоговорного и безучетного потребления электроэнергии',
      year: 2022,
      enabled: true
    },
    {
      id: 'i004-2025',
      title: 'И 004-2025 - Инструкция по учёту пломб и актов',
      year: 2025,
      enabled: true
    },
    {
      id: 'orp-reglament-2019',
      title: 'Регламент взаимодействия при ОРП',
      year: 2019,
      enabled: true
    }
  ],
  animations: {
    marqueeSpeed: 15,
    sectionExpandDuration: 0.4,
    hoverDelay: 0.3
  },
  storage: {
    themeKey: 'selectedTheme',
    expandedSectionsKey: 'expandedSections'
  },
  hotkeys: {
    search: { key: 'k', ctrl: true, label: 'Ctrl+K' }
  },
  fileIcons: {
    'DOCX': '📄',
    'DOC': '📄',
    'PDF': '📑',
    'XLSX': '📊',
    'XLS': '📊',
    'TXT': '📝',
    'ZIP': '📦',
    'RAR': '📦'
  }
};
