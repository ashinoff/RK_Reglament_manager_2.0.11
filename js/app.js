// Главный модуль приложения
(function() {
  'use strict';
  
  // Состояние приложения
  let expandedSections = new Set();
  let currentTheme = 'default';
  
  // ======= Утилиты =======
  function normalizeStr(s) {
    return String(s)
      .toLowerCase()
      .replace(/ё/g,'е')
      .replace(/[\s._(),\-–—\[\]{}:;!?"'`~+/\\]+/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }
  
  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  function highlightText(text, searchTerm) {
    if (!searchTerm || text == null || typeof text !== 'string') return text;
    const pattern = escapeRegExp(searchTerm);
    if (!pattern) return text;
    const regex = new RegExp(`(${pattern})`, 'giu');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
  
  // ======= Поиск =======
  function searchInObject(obj, termNorm) {
    for (let key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const value = obj[key];
      if (typeof value === 'string') {
        if (normalizeStr(value).includes(termNorm)) return true;
      } else if (Array.isArray(value)) {
        for (let item of value) {
          if (typeof item === 'string') {
            if (normalizeStr(item).includes(termNorm)) return true;
          } else if (item && typeof item === 'object' && searchInObject(item, termNorm)) return true;
        }
      } else if (value && typeof value === 'object') {
        if (searchInObject(value, termNorm)) return true;
      }
    }
    return false;
  }
  
  // ======= Рендеринг =======
  function renderContent() {
    const container = document.getElementById('contentContainer');
    const selectedReglament = document.getElementById('reglamentSelect').value;
    const rawInput = document.getElementById('searchInput').value || '';
    const normTerm = normalizeStr(rawInput);
    const rawTerm = rawInput.trim();
    
    const clearBtn = document.getElementById('clearSearch');
    clearBtn.style.display = rawTerm ? 'block' : 'none';
    
    container.innerHTML = '';
    
    const algorithms = window.REGULATIONS_DATA[selectedReglament];
    if (!algorithms) {
      container.innerHTML = '<div class="no-results">Регламент не найден</div>';
      return;
    }
    
    let list = algorithms;
    if (normTerm) {
      list = list.filter(algo => searchInObject(algo, normTerm));
    }
    
    if (list.length === 0) {
      container.innerHTML = '<div class="no-results">По вашему запросу ничего не найдено</div>';
      return;
    }
    
    list.forEach(algo => container.appendChild(createSection(algo, rawTerm)));
  }
  
  function createSection(algo, rawTerm) {
    const card = document.createElement('div');
    card.className = 'section-card';
    
    // Заголовок
    const header = document.createElement('div');
    header.className = 'section-header';
    header.onclick = () => toggleSection(algo.id);
    
    const title = document.createElement('div');
    title.className = 'section-title';
    title.innerHTML = highlightText(algo.title, rawTerm);
    
    const arrow = document.createElement('div');
    arrow.className = 'section-arrow';
    arrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
    if (expandedSections.has(algo.id)) {
      arrow.classList.add('expanded');
    }
    
    header.appendChild(title);
    header.appendChild(arrow);
    
    // Содержимое
    const content = document.createElement('div');
    content.className = 'section-content';
    content.id = `content-${algo.id}`;
    if (expandedSections.has(algo.id)) content.classList.add('expanded');
    
    // Добавляем различные блоки контента
    if (algo.content.steps) content.appendChild(createBlock('Порядок действий:', algo.content.steps, rawTerm, true));
    
    if (algo.content.actions) {
      algo.content.actions.forEach(action => {
        const actionDiv = document.createElement('div');
        actionDiv.className = 'algorithm-block';
        actionDiv.innerHTML = `<h4>${highlightText(action.text, rawTerm)}</h4>`;
        if (action.list) {
          const ul = document.createElement('ul');
          action.list.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = highlightText(item, rawTerm);
            ul.appendChild(li);
          });
          actionDiv.appendChild(ul);
        }
        content.appendChild(actionDiv);
      });
    }
    
    // Добавляем остальные поля контента по необходимости
    const skipFields = ['responsible', 'deadline', 'steps', 'actions'];
const specialFields = {
  'period': 'Период расчёта:',
  'formulas': 'Формулы расчёта:',
  'parameters': 'Параметры:',
  'correction': 'Корректировка:',
  'unauthorizedConnection': 'Самовольное подключение:',
  'meterIntervention': 'Вмешательство в ПУ:',
  'periodDetails': 'Детализация периодов:',
  'pricing': 'Тарификация:',
  'important': '⚠️ Важно:',
  'nonAdmission': 'При недопуске:',
  'riskCriteria': 'Критерии риска:',
  'raids': 'Рейды:',
  'sources': 'Источники информации:',
  'overview': 'Общие положения:',
  'nonPayment': 'При неоплате:',
  'documents': 'Необходимые документы:',
  'deadlines': 'Сроки:',
  'reporting': 'Отчётность:',
  'structure': 'Структура:',
  'tasks': 'Задачи:',
  'special': 'Особые случаи:',
  'keyPoints': 'Ключевые моменты:',
  'timing': 'Сроки:',
  'forms': 'Формы заявлений:',
  'storage': 'Хранение:',
  'control': 'Контроль:',
  'scope': 'Область применения:',
  'documentation': 'Документация:',
  'mustSeal': 'Обязательная пломбировка:',
  'antimagnetic': 'Антимагнитные пломбы:',
  'rules': 'Правила:',
  'escalation': 'Эскалация:',
  'quarterly': 'Ежеквартальная отчётность:',
  'annual': 'Ежегодная отчётность:',
  'positions': 'Уполномоченные должности:',
  'keyTerms': 'Ключевые термины:',
  'legalBasis': 'Нормативная база:',
  'zakazchikLists': 'Перечни Заказчика:',
  'ispolnitelLists': 'Перечни Исполнителя:',
  'grounds': 'Основания:',
  'notificationContent': 'Содержание уведомления:',
  'execution': 'Исполнение:',
  'specialCases': 'Особые случаи:',
  'actContent': 'Содержание акта:',
  'monthlyProcess': 'Ежемесячный процесс:',
  'disputes': 'Разногласия:',
  'notifications': 'Уведомления:',
  'registers': 'Реестры:',
  'frequency': 'Периодичность:',
  'actions': 'Действия:',
  'violations': 'Нарушения:',
  'Abbreviations': 'Аббревиатуры',
  'period': 'Период расчёта:',
  'formulas': 'Формулы расчёта:',
  'parameters': 'Параметры:',
  'requirements': 'Требования:',
  'equipment': 'Оборудование:',
  'stages': 'Этапы:',
  'keyPoint': 'Ключевой момент:',
  'abbreviations': 'Аббревиатуры:',
  'criteria': 'Критерии:',
  'priority': 'Приоритет:',
  'sorting': 'Сортировка:',
  'measures': 'Мероприятия:',
  'schedule': 'График:',
  'provision': 'Обеспечение:',
  'analysis': 'Анализ:'
};

// Обработка специальных полей
for (let field in algo.content) {
  if (skipFields.includes(field) || !algo.content[field]) continue;
  
  const fieldTitle = specialFields[field] || field.charAt(0).toUpperCase() + field.slice(1) + ':';
  const fieldValue = algo.content[field];
  
  if (typeof fieldValue === 'string') {
    // Простая строка
    const block = document.createElement('div');
    block.className = 'algorithm-block';
    block.innerHTML = `<p><strong>${fieldTitle}</strong> ${highlightText(fieldValue, rawTerm)}</p>`;
    content.appendChild(block);
    
  } else if (Array.isArray(fieldValue)) {
    // Массив элементов
    if (fieldValue.length > 0 && typeof fieldValue[0] === 'object') {
      // Массив объектов (например, formulas, periodDetails)
      fieldValue.forEach(item => {
        const block = document.createElement('div');
        block.className = 'algorithm-block';
        
        if (item.title) {
          block.innerHTML = `<h4>${highlightText(item.title, rawTerm)}</h4>`;
        }
        
        if (item.text) {
          block.innerHTML += `<p>${highlightText(item.text, rawTerm)}</p>`;
        }
        
        if (item.formula) {
          block.innerHTML += `<p><code>${highlightText(item.formula, rawTerm)}</code></p>`;
        }
        
        if (item.list) {
          const ul = document.createElement('ul');
          item.list.forEach(listItem => {
            const li = document.createElement('li');
            li.innerHTML = listItem.includes('=') || listItem.includes('×') 
              ? `<code>${highlightText(listItem, rawTerm)}</code>`
              : highlightText(listItem, rawTerm);
            ul.appendChild(li);
          });
          block.appendChild(ul);
        }
        
        content.appendChild(block);
      });
    } else {
      // Простой массив строк
      content.appendChild(createBlock(fieldTitle, fieldValue, rawTerm));
    }
  }
}
    
    // Ответственный и срок
    const footer = document.createElement('div');
    footer.className = 'algorithm-block';
    if (algo.content.responsible) footer.innerHTML += `<p><strong>Ответственный:</strong> ${highlightText(algo.content.responsible, rawTerm)}</p>`;
    if (algo.content.deadline) footer.innerHTML += `<p><strong>Срок:</strong> ${highlightText(algo.content.deadline, rawTerm)}</p>`;
    if (footer.innerHTML) content.appendChild(footer);
    
    // Кнопки действий
    const buttons = document.createElement('div');
    buttons.className = 'action-buttons';
    
    // Кнопка приложений
    if (algo.attachments && algo.attachments.length > 0) {
      const attachBtn = document.createElement('button');
      attachBtn.className = 'action-btn btn-action-secondary';
      attachBtn.innerHTML = `📎 Приложения (${algo.attachments.length})`;
      attachBtn.onclick = () => openAttachments(algo.id);
      buttons.appendChild(attachBtn);
    }
    
    const openBtn = document.createElement('button');
    openBtn.className = 'action-btn btn-action-primary';
    openBtn.innerHTML = '📄 Документ';
    openBtn.onclick = () => openSourceDocument(algo.id);
    
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'action-btn btn-action-secondary';
    collapseBtn.innerHTML = '↥ Свернуть';
    collapseBtn.onclick = () => toggleSection(algo.id);
    
    buttons.appendChild(openBtn);
    buttons.appendChild(collapseBtn);
    content.appendChild(buttons);
    
    card.appendChild(header);
    card.appendChild(content);
    return card;
  }
  
  function createBlock(title, items, rawTerm, ordered = false) {
    const block = document.createElement('div');
    block.className = 'algorithm-block';
    block.innerHTML = `<h4>${title}</h4>`;
    const list = ordered ? document.createElement('ol') : document.createElement('ul');
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = highlightText(item, rawTerm);
      list.appendChild(li);
    });
    block.appendChild(list);
    return block;
  }
  
  // ======= Управление секциями =======
  function toggleSection(sectionId) {
    const content = document.getElementById(`content-${sectionId}`);
    if (!content) return;
    
    const arrow = content.previousElementSibling?.querySelector('.section-arrow');
    if (!arrow) return;
    
    if (expandedSections.has(sectionId)) {
      expandedSections.delete(sectionId);
      content.classList.remove('expanded');
      arrow.classList.remove('expanded');
    } else {
      expandedSections.add(sectionId);
      content.classList.add('expanded');
      arrow.classList.add('expanded');
    }
    updateCollapseButton();
  }
  
  function collapseAll() {
    expandedSections.clear();
    document.querySelectorAll('.section-content').forEach(content => {
      if (content) content.classList.remove('expanded');
    });
    document.querySelectorAll('.section-arrow').forEach(arrow => {
      if (arrow) arrow.classList.remove('expanded');
    });
    updateCollapseButton();
  }
  
  function expandAll() {
    const selectedReglament = document.getElementById('reglamentSelect').value;
    const algorithms = window.REGULATIONS_DATA[selectedReglament];
    if (algorithms) {
      algorithms.forEach(algo => {
        expandedSections.add(algo.id);
      });
      document.querySelectorAll('.section-content').forEach(content => {
        if (content) content.classList.add('expanded');
      });
      document.querySelectorAll('.section-arrow').forEach(arrow => {
        if (arrow) arrow.classList.add('expanded');
      });
    }
    updateCollapseButton();
  }
  // ======= Экспорт в Word =======
function exportToWord() {
  const selectedReglament = document.getElementById('reglamentSelect').value;
  const selectedTitle = document.getElementById('reglamentSelect').selectedOptions[0].text;
  const algorithms = window.REGULATIONS_DATA[selectedReglament];
  
  if (!algorithms) {
    alert('Регламент не найден');
    return;
  }
  
  // Создаем HTML документ для Word
  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${selectedTitle}</title>
      <style>
        @page { size: A4; margin: 2cm; }
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333;
          max-width: 21cm;
          margin: 0 auto;
        }
        h1 { 
          color: #8B1538; 
          font-size: 24px; 
          margin-bottom: 20px;
          text-align: center;
          page-break-after: avoid;
        }
        h2 { 
          color: #8B1538; 
          font-size: 20px; 
          margin-top: 30px; 
          margin-bottom: 15px;
          page-break-after: avoid;
        }
        h3 { 
          color: #333; 
          font-size: 16px; 
          margin-top: 20px; 
          margin-bottom: 10px;
          page-break-after: avoid;
        }
        p { margin: 10px 0; text-align: justify; }
        ul, ol { margin: 10px 0; padding-left: 30px; }
        li { margin: 5px 0; }
        .section { 
          margin-bottom: 30px; 
          page-break-inside: avoid; 
        }
        .important { 
          background-color: #fff3cd; 
          padding: 15px;
          border-left: 4px solid #F39200; 
          margin: 15px 0;
          font-weight: bold;
        }
        .responsible { 
          margin-top: 20px;
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 5px;
        }
        .responsible strong { color: #8B1538; }
        code {
          background-color: #f4f4f4;
          padding: 2px 5px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
        }
        table { 
          border-collapse: collapse; 
          width: 100%; 
          margin: 15px 0;
          page-break-inside: avoid;
        }
        td, th { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left; 
        }
        th { 
          background-color: #8B1538;
          color: white;
          font-weight: bold; 
        }
        .page-break { page-break-after: always; }
      </style>
    </head>
    <body>
      <h1>${selectedTitle}</h1>
      <p style="text-align: center; color: #666;">
        Краткое содержание регламента<br>
        Дата формирования: ${new Date().toLocaleDateString('ru-RU')}
      </p>
      <div class="page-break"></div>
  `;
  
  // Добавляем оглавление
  html += '<h2>Содержание</h2><ol>';
  algorithms.forEach((algo, index) => {
    html += `<li><a href="#section${index}">${algo.title}</a></li>`;
  });
  html += '</ol><div class="page-break"></div>';
  
  // Добавляем содержимое разделов
  algorithms.forEach((algo, index) => {
    html += `<div class="section" id="section${index}">`;
    html += `<h2>${index + 1}. ${algo.title}</h2>`;
    
    const content = algo.content;
    
    // Основные шаги
    if (content.steps) {
      html += '<h3>Порядок действий:</h3><ol>';
      content.steps.forEach(step => {
        html += `<li>${step}</li>`;
      });
      html += '</ol>';
    }
    
    // Действия
    if (content.actions) {
      content.actions.forEach(action => {
        html += `<h3>${action.text}</h3>`;
        if (action.list) {
          html += '<ul>';
          action.list.forEach(item => {
            html += `<li>${item}</li>`;
          });
          html += '</ul>';
        }
      });
    }
    
    // Ключевые моменты
    if (content.keyPoints) {
      html += '<h3>Ключевые моменты:</h3><ul>';
      content.keyPoints.forEach(point => {
        html += `<li>${point}</li>`;
      });
      html += '</ul>';
    }
    
    // Документы
    if (content.documents) {
      html += '<h3>Необходимые документы:</h3><ul>';
      content.documents.forEach(doc => {
        html += `<li>${doc}</li>`;
      });
      html += '</ul>';
    }
    
    // Сроки
    if (content.timing) {
      html += '<h3>Сроки выполнения:</h3><ul>';
      content.timing.forEach(time => {
        html += `<li>${time}</li>`;
      });
      html += '</ul>';
    }
    
    // Формулы
    if (content.formulas) {
      html += '<h3>Формулы расчета:</h3>';
      content.formulas.forEach(formula => {
        html += `<p><strong>${formula.title}:</strong><br>`;
        html += `<code>${formula.formula}</code>`;
        if (formula.text) html += `<br>${formula.text}`;
        html += '</p>';
      });
    }
    
    // Важная информация
    if (content.important) {
      html += `<div class="important">⚠️ Важно: ${content.important}</div>`;
    }
    
    // Особые случаи
    if (content.specialCases) {
      html += `<h3>Особые случаи:</h3><p>${content.specialCases}</p>`;
    }
    
    // Ответственный и срок
    html += '<div class="responsible">';
    if (content.responsible) {
      html += `<p><strong>Ответственный:</strong> ${content.responsible}</p>`;
    }
    if (content.deadline) {
      html += `<p><strong>Срок:</strong> ${content.deadline}</p>`;
    }
    html += '</div>';
    
    // Приложения
    if (algo.attachments && algo.attachments.length > 0) {
      html += '<h3>Приложения:</h3><ul>';
      algo.attachments.forEach(att => {
        html += `<li>${att.name} (${att.file})</li>`;
      });
      html += '</ul>';
    }
    
    html += '</div>';
    
    // Разрыв страницы после каждого раздела (кроме последнего)
    if (index < algorithms.length - 1) {
      html += '<div class="page-break"></div>';
    }
  });
  
  html += '</body></html>';
  
  // Создаем Blob и скачиваем файл
  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${selectedReglament}_краткое_содержание.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Добавить в функцию initEventListeners() новый обработчик:
// document.getElementById('exportWordBtn').addEventListener('click', exportToWord);
  function updateCollapseButton() {
    const collapseBtn = document.getElementById('collapseAllBtn');
    const expandBtn = document.getElementById('expandAllBtn');
    if (!collapseBtn || !expandBtn) return;
    
    if (expandedSections.size > 0) {
      collapseBtn.style.display = 'flex';
      expandBtn.style.display = 'none';
    } else {
      collapseBtn.style.display = 'none';
      expandBtn.style.display = 'flex';
    }
  }
  
  // ======= Работа с темами =======
  function switchTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    currentTheme = theme;
    
    document.querySelectorAll('.theme-dot').forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`.theme-dot[data-theme="${theme}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    localStorage.setItem(APP_CONFIG.storage.themeKey, theme);
  }
  
  // ======= Работа с приложениями =======
  function openAttachments(sectionId) {
    const selectedReglament = document.getElementById('reglamentSelect').value;
    const algorithms = window.REGULATIONS_DATA[selectedReglament];
    const algo = algorithms.find(a => a.id === sectionId);
    
    if (!algo || !algo.attachments || algo.attachments.length === 0) {
      alert('Приложения не найдены');
      return;
    }
    
    const modal = document.getElementById('attachmentsModal');
    const listContainer = document.getElementById('attachmentsList');
    
    let html = '<div class="attachments-list">';
    algo.attachments.forEach(attachment => {
      const fileExt = attachment.file.split('.').pop().toUpperCase();
      const icon = APP_CONFIG.fileIcons[fileExt] || '📎';
      html += `
        <a href="regulations/${selectedReglament}/${attachment.file}" 
           class="attachment-item" 
           download="${attachment.file}"
           target="_blank">
          <div class="attachment-icon">${icon}</div>
          <div class="attachment-info">
            <div class="attachment-name">${attachment.name}</div>
            <div class="attachment-type">Файл ${fileExt}</div>
          </div>
        </a>
      `;
    });
    html += '</div>';
    
    listContainer.innerHTML = html;
    modal.style.display = 'block';
  }
  
  window.closeAttachmentsModal = function() {
    document.getElementById('attachmentsModal').style.display = 'none';
  };
  
  function openSourceDocument(sectionId) {
  const selectedReglament = document.getElementById('reglamentSelect').value;
  const navMap = navigationMaps[selectedReglament];
  if (!navMap || !navMap.sections[sectionId]) {
    alert('Раздел не найден в навигационной карте');
    return;
  }
  const page = navMap.sections[sectionId].page;
  
  // Удалите только эти две строки:
  // const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
  // const pdfUrl = `${baseUrl}${navMap.docUrl}#page=${page}`;
  
  // И замените на эту одну строку:
  const pdfUrl = `${navMap.docUrl}#page=${page}`;
  
  // Всё остальное оставьте как есть:
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    const modal = document.getElementById('sourceModal');
    const sourceText = document.getElementById('sourceText');
    sourceText.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h3 style="color: var(--primary); margin-bottom: 1rem;">Раздел ${navMap.sections[sectionId].section || page}</h3>
        <p style="margin-bottom: 1.5rem;">Откройте документ и перейдите на страницу <strong>${page}</strong></p>
        <a href="${navMap.docUrl}" class="action-btn btn-action-primary" style="display: inline-block; text-decoration: none; padding: 0.75rem 1.5rem;">Скачать PDF</a>
        <button onclick="window.open('${navMap.docUrl}', '_blank')" class="action-btn btn-action-primary" style="margin-left: 1rem; padding: 0.75rem 1.5rem;">Открыть PDF</button>
      </div>
    `;
    modal.style.display = 'block';
  } else {
    window.open(pdfUrl, '_blank');
  }
}
  
  // ======= Бегущая строка =======
  function checkMarqueeNeeded() {
    const select = document.getElementById('reglamentSelect');
    const wrapper = select.closest('.select-wrapper');
    if (!select || !wrapper) return;
    
    const selectedText = select.options[select.selectedIndex].text;
    
    const temp = document.createElement('span');
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.whiteSpace = 'nowrap';
    temp.style.font = window.getComputedStyle(select).font;
    temp.textContent = selectedText;
    document.body.appendChild(temp);
    
    const textWidth = temp.offsetWidth;
    const selectWidth = select.offsetWidth - 60;
    
    document.body.removeChild(temp);
    
    if (textWidth > selectWidth) {
      wrapper.classList.add('marquee-active');
      wrapper.setAttribute('data-text', selectedText + '     •            •     ' + selectedText + '     •            •     ' + selectedText + '     •            •     ' + selectedText + '     •            •     ');
    } else {
      wrapper.classList.remove('marquee-active');
      wrapper.removeAttribute('data-text');
    }
  }
  
  // ======= Инициализация селекта регламентов =======
  function initRegulationsSelect() {
    const select = document.getElementById('reglamentSelect');
    if (!select) return;
    
    select.innerHTML = '';
    APP_CONFIG.regulations.forEach(reg => {
      const option = document.createElement('option');
      option.value = reg.id;
      option.textContent = reg.title;
      option.disabled = !reg.enabled;
      select.appendChild(option);
    });
  }
  
  // ======= Обработчики событий =======
  function initEventListeners() {
    // Селект регламентов
    document.getElementById('reglamentSelect').addEventListener('change', () => {
      renderContent();
      checkMarqueeNeeded();
    });
    
    // Поиск
    document.getElementById('searchInput').addEventListener('input', renderContent);
    document.getElementById('clearSearch').addEventListener('click', () => {
      const input = document.getElementById('searchInput');
      input.value = '';
      input.focus();
      renderContent();
    });
    
    // Кнопки управления
    document.getElementById('collapseAllBtn').addEventListener('click', collapseAll);
    document.getElementById('expandAllBtn').addEventListener('click', expandAll);
    document.getElementById('scrollTopBtn').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('exportWordBtn').addEventListener('click', exportToWord);
    // Модальные окна
    document.querySelector('.close-modal').addEventListener('click', () => {
      document.getElementById('sourceModal').style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
      const sourceModal = document.getElementById('sourceModal');
      const attachModal = document.getElementById('attachmentsModal');
      if (e.target === sourceModal) sourceModal.style.display = 'none';
      if (e.target === attachModal) attachModal.style.display = 'none';
    });
    
    // Скролл
    window.addEventListener('scroll', () => {
      const btn = document.getElementById('scrollTopBtn');
      btn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
    });
    
    // Горячие клавиши
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === APP_CONFIG.hotkeys.search.key) {
        e.preventDefault();
        document.getElementById('searchInput').focus();
      }
    });
    
    // Переключатель тем
    document.querySelectorAll('.theme-dot').forEach(btn => {
      btn.addEventListener('click', () => {
        switchTheme(btn.getAttribute('data-theme'));
      });
    });
    
    // Адаптивность
    window.addEventListener('resize', () => {
      checkMarqueeNeeded();
    });
  }
  
  // ======= Инициализация приложения =======
  function init() {
    // Загрузка сохраненной темы
    const savedTheme = localStorage.getItem(APP_CONFIG.storage.themeKey) || 'default';
    switchTheme(savedTheme);
    
    // Инициализация селекта регламентов
    initRegulationsSelect();
    
    // Инициализация обработчиков
    initEventListeners();
    
    // Рендеринг контента
    renderContent();
    updateCollapseButton();
    checkMarqueeNeeded();
  }
  
  // Запуск приложения
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
