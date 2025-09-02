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
    const contentFields = [
      { field: 'keyPoints', title: 'Ключевые моменты:' },
      { field: 'timing', title: 'Сроки:' },
      { field: 'forms', title: 'Формы заявлений:' },
      { field: 'storage', title: 'Хранение:' }
    ];
    
    contentFields.forEach(({ field, title }) => {
      if (algo.content[field]) {
        content.appendChild(createBlock(title, algo.content[field], rawTerm));
      }
    });
    
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
    const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    const pdfUrl = `${baseUrl}${navMap.docUrl}#page=${page}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      const modal = document.getElementById('sourceModal');
      const sourceText = document.getElementById('sourceText');
      sourceText.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h3 style="color: var(--primary); margin-bottom: 1rem;">Раздел ${navMap.sections[sectionId].section || page}</h3>
          <p style="margin-bottom: 1.5rem;">Откройте документ и перейдите на страницу <strong>${page}</strong></p>
          <a href="${baseUrl}${navMap.docUrl}" class="action-btn btn-action-primary" style="display: inline-block; text-decoration: none; padding: 0.75rem 1.5rem;">Скачать PDF</a>
          <button onclick="window.open('${baseUrl}${navMap.docUrl}', '_blank')" class="action-btn btn-action-primary" style="margin-left: 1rem; padding: 0.75rem 1.5rem;">Открыть PDF</button>
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
      wrapper.setAttribute('data-text', selectedText + '     •     ' + selectedText + '     •     ');
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
