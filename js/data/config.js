window.REGULATIONS_DATA = {};

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
      title: 'И 004-2025 - Инструкция по учёту, порядку применения и обороту бланков актов, номерных пломб и знаков визуального контроля',
      year: 2025,
      enabled: true
    },
    {
      id: 'orp-reglament-2019',
      title: 'Регламент взаимодействия исполнителя и заказчика при ограничении/возобновлении режима потребления электроэнергии',
      year: 2019,
      enabled: true
    },
    {
      id: 'rp-006-2025',
      title: 'РП 006-2025 - Регламент процесса "Технологическое присоединение"',
      year: 2025,
      enabled: true
    },
    {
      id: 'i002-2019',
      title: 'И 002-2019 - Инструкция по обслуживанию приборов учёта электроэнергии электроэнергии в электроустановках напряжением до и выше 1000В',
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
