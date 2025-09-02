// js/data/config.js - ПОЛНЫЙ файл должен выглядеть так:
// 1. Сначала создаем глобальный объект для данных
window.REGULATIONS_DATA = window.REGULATIONS_DATA || {};
// 2. Потом объявляем конфигурацию
const APP_CONFIG = {
  // Название организации
  organizationName: 'РОССЕТИ КУБАНЬ',
  
  // Заголовок приложения
  appTitle: 'МЕТОДИКА ОРГАНИЗАЦИИ РАБОТЫ БЛОКА РЕАЛИЗАЦИИ И РАЗВИТИЯ УСЛУГ',
  
  // Доступные темы
  themes: [
    { id: 'default', name: 'Классическая тема' },
    { id: 'energy', name: 'Энергия' },
    { id: 'purple', name: 'Фиолетовые сумерки' },
    { id: 'ocean', name: 'Океан' }
  ],
  
  // Список регламентов
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
    }
  ],
  
  // Остальные настройки
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
