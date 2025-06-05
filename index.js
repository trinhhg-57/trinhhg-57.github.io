// index.js
import { getAccounts, updateAccount } from './account.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');

  const translations = {
    vn: {
      appTitle: 'Tiện Ích Của Trịnh Hg',
      contactText1: 'Liên hệ hỗ trợ qua: ',
      renewAccount: 'Gia hạn tài khoản: ',
      settingsTab: 'Settings',
      replaceTab: 'Replace',
      splitTab: 'Chia Chương',
      settingsTitle: 'Cài đặt tìm kiếm và thay thế',
      modeLabel: 'Chọn chế độ:',
      default: 'Mặc định',
      addMode: 'Thêm chế độ mới',
      copyMode: 'Sao Chép Chế Độ',
      matchCaseOn: 'Match Case: Bật',
      matchCaseOff: 'Match Case: Tắt',
      findPlaceholder: 'Tìm ví dụ dấu phẩy',
      replacePlaceholder: 'Thay thế ví dụ dấu chấm phẩy',
      removeButton: 'Xóa',
      addPair: 'Thêm',
      saveSettings: 'Lưu cài đặt',
      manageButton: 'Quản lý',
      replaceTitle: 'Thay thế Dấu câu',
      inputText: 'Dán văn bản của bạn vào đây...',
      replaceButton: 'Thay thế',
      outputText: 'Kết quả sẽ xuất hiện ở đây...',
      copyButton: 'Sao chép',
      splitTitle: 'Chia Chương',
      splitInputText: 'Dán văn bản của bạn vào đây...',
      splitButton: 'Chia Chương',
      output1Text: 'Kết quả chương 1 sẽ xuất hiện ở đây...',
      output2Text: 'Kết quả chương 2 sẽ xuất hiện ở đây...',
      noPairsToSave: 'Không có cặp nào để lưu!',
      settingsSaved: 'Đã lưu cài đặt cho chế độ "{mode}"!"',
      newModePrompt: 'Nhập tên chế độ mới:',
      invalidModeName: 'Tên chế độ không hợp lệ hoặc đã tồn tại!',
      modeCreated: 'Đã tạo chế độ "{mode}"!"',
      switchedMode: 'Đã chuyển sang chế độ "{mode}"',
      noTextToReplace: 'Không có văn bản để thay thế!',
      noPairsConfigured: 'Không có cặp tìm kiếm-thay thế nào được cấu hình!',
      textReplaced: 'Đã thay thế văn bản thành công!',
      textCopied: 'Đã sao chép văn bản vào clipboard!',
      failedToCopy: 'Không thể sao chép văn bản!',
      noTextToCopy: 'Không có văn bản để sao chép!',
      modeDeleted: 'Đã xóa chế độ "{mode}"!',
      renamePrompt: 'Nhập tên mới cho chế độ:',
      renameSuccess: 'Đã đổi tên chế độ thành "{mode}"!',
      renameError: 'Lỗi khi đổi tên chế độ!',
      noTextToSplit: 'Không có văn bản để chia!',
      exportSettings: 'Xuất Cài Đặt',
      importSettings: 'Nhập Cài Đặt',
      settingsExported: 'Đã xuất cài đặt thành công!',
      settingsImported: 'Đã nhập cài đặt thành công!',
      importError: 'Lỗi khi nhập cài đặt!',
      usernamePlaceholder: 'Nhập tên đăng nhập',
      passwordPlaceholder: 'Nhập mật khẩu',
      loginButton: 'Đăng Nhập',
      keyTimer: 'Thời gian còn lại: {time}',
      keyExpired: 'Tài khoản của bạn đã hết thời gian sử dụng hãy gia hạn thêm!',
      invalidCredentials: 'Tên đăng nhập hoặc mật khẩu không đúng!',
      loginSuccess: 'Đăng nhập thành công!',
      emptyCredentials: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!',
      resourceError: 'Không thể tải tài nguyên, vui lòng làm mới trang hoặc kiểm tra kết nối!'
    }
  };

  let currentLang = 'vn';
  let matchCaseEnabled = false;
  let currentMode = 'default';
  let currentUser = null;
  const LOCAL_STORAGE_KEY = 'local_settings';
  const ACCOUNTS_STORAGE_KEY = 'accounts';

  function escapeHtml(str) {
    try {
      if (typeof str !== 'string') return '';
      return str.replace(/[&<>"']/g, match => ({
        '&': '&',
        '<': '<',
        '>': '>',
        '"': '"',
        "'": ''' // Sử dụng thực thể HTML hợp lệ cho dấu nháy đơn
      }[match] || match));
    } catch (error) {
      console.error('Error in escapeHtml:', error);
      return str || '';
    }
  }

  function updateLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    const elements = {
      appTitle: document.querySelectorAll('#app-title'),
      contactText1: document.getElementById('contact-text1'),
      renewAccount: document.getElementById('renew-account'),
      settingsTab: document.getElementById('settings-tab'),
      replaceTab: document.getElementById('replace-tab'),
      splitTab: document.getElementById('split-tab'),
      settingsTitle: document.getElementById('settings-title'),
      modeLabel: document.getElementById('mode-label'),
      addMode: document.getElementById('add-mode'),
      copyMode: document.getElementById('copy-mode'),
      matchCase: document.getElementById('match-case'),
      findPlaceholder: document.querySelector('.find'),
      replacePlaceholder: document.querySelector('.replace'),
      removeButton: document.querySelector('.remove'),
      addPair: document.getElementById('add-pair'),
      saveSettings: document.getElementById('save-settings'),
      manageButton: document.getElementById('manage-button'),
      replaceTitle: document.getElementById('replace-title'),
      inputText: document.getElementById('input-text'),
      replaceButton: document.getElementById('replace-button'),
      outputText: document.getElementById('output-text'),
      copyButton: document.getElementById('copy-button'),
      splitTitle: document.getElementById('split-title'),
      splitInputText: document.getElementById('split-input-text'),
      splitButton: document.getElementById('split-button'),
      output1Text: document.getElementById('output1-text'),
      output2Text: document.getElementById('output2-text'),
      copyButton1: document.getElementById('copy-button1'),
      copyButton2: document.getElementById('copy-button2'),
      exportSettings: document.getElementById('export-settings'),
      importSettings: document.getElementById('import-settings'),
      username: document.getElementById('username'),
      password: document.getElementById('password'),
      loginButton: document.getElementById('login-button')
    };

    if (elements.appTitle) elements.appTitle.forEach(el => el.textContent = translations[lang].appTitle);
    if (elements.contactText1) {
      const textNode = Array.from(elements.contactText1.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = translations[lang].contactText1;
      else elements.contactText1.insertBefore(document.createTextNode(translations[lang].contactText1), elements.contactText1.firstChild);
    }
    if (elements.renewAccount) {
      const textNode = Array.from(elements.renewAccount.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = translations[lang].renewAccount;
      else elements.renewAccount.insertBefore(document.createTextNode(translations[lang].renewAccount), elements.renewAccount.firstChild);
    }
    if (elements.settingsTab) elements.settingsTab.textContent = translations[lang].settingsTab;
    if (elements.replaceTab) elements.replaceTab.textContent = translations[lang].replaceTab;
    if (elements.splitTab) elements.splitTab.textContent = translations[lang].splitTab;
    if (elements.settingsTitle) elements.settingsTitle.textContent = translations[lang].settingsTitle;
    if (elements.modeLabel) elements.modeLabel.textContent = translations[lang].modeLabel;
    if (elements.addMode) elements.addMode.textContent = translations[lang].addMode;
    if (elements.copyMode) elements.copyMode.textContent = translations[lang].copyMode;
    if (elements.matchCase) elements.matchCase.textContent = matchCaseEnabled ? translations[lang].matchCaseOn : translations[lang].matchCaseOff;
    if (elements.findPlaceholder) elements.findPlaceholder.placeholder = translations[lang].findPlaceholder;
    if (elements.replacePlaceholder) elements.replacePlaceholder.placeholder = translations[lang].replacePlaceholder;
    if (elements.removeButton) elements.removeButton.textContent = translations[lang].removeButton;
    if (elements.addPair) elements.addPair.textContent = translations[lang].addPair;
    if (elements.saveSettings) elements.saveSettings.textContent = translations[lang].saveSettings;
    if (elements.manageButton) elements.manageButton.textContent = translations[lang].manageButton;
    if (elements.replaceTitle) elements.replaceTitle.textContent = translations[lang].replaceTitle;
    if (elements.inputText) elements.inputText.placeholder = translations[lang].inputText;
    if (elements.replaceButton) elements.replaceButton.textContent = translations[lang].replaceButton;
    if (elements.outputText) elements.outputText.placeholder = translations[lang].outputText;
    if (elements.copyButton) elements.copyButton.textContent = translations[lang].copyButton;
    if (elements.splitTitle) elements.splitTitle.textContent = translations[lang].splitTitle;
    if (elements.splitInputText) elements.splitInputText.placeholder = translations[lang].splitInputText;
    if (elements.splitButton) elements.splitButton.textContent = translations[lang].splitButton;
    if (elements.output1Text) elements.output1Text.placeholder = translations[lang].output1Text;
    if (elements.output2Text) elements.output2Text.placeholder = translations[lang].output2Text;
    if (elements.copyButton1) elements.copyButton1.textContent = translations[lang].copyButton + ' 1';
    if (elements.copyButton2) elements.copyButton2.textContent = translations[lang].copyButton + ' 2';
    if (elements.exportSettings) elements.exportSettings.textContent = translations[lang].exportSettings;
    if (elements.importSettings) elements.importSettings.textContent = translations[lang].importSettings;
    if (elements.username) elements.username.placeholder = translations[lang].usernamePlaceholder;
    if (elements.password) elements.password.placeholder = translations[lang].passwordPlaceholder;
    if (elements.loginButton) elements.loginButton.textContent = translations[lang].loginButton;

    document.querySelectorAll('.punctuation-item').forEach(item => {
      const findInput = item.querySelector('.find');
      const replaceInput = item.querySelector('.replace');
      const removeBtn = item.querySelector('.remove');
      if (findInput) findInput.placeholder = translations[lang].findPlaceholder;
      if (replaceInput) replaceInput.placeholder = translations[lang].replacePlaceholder;
      if (removeBtn) removeBtn.textContent = translations[lang].removeButton;
    });
  }

  function updateModeButtons() {
    const renameMode = document.getElementById('rename-mode');
    const deleteMode = document.getElementById('delete-mode');
    if (currentMode !== 'default' && renameMode && deleteMode) {
      renameMode.style.display = 'inline-block';
      deleteMode.style.display = 'inline-block';
    } else if (renameMode && deleteMode) {
      renameMode.style.display = 'none';
      deleteMode.style.display = 'none';
    }
  }

  function updateButtonStates() {
    const matchCaseButton = document.getElementById('match-case');
    if (matchCaseButton) {
      matchCaseButton.textContent = matchCaseEnabled ? translations[currentLang].matchCaseOn : translations[currentLang].matchCaseOff;
      matchCaseButton.style.background = matchCaseEnabled ? '#28a745' : '#6c757d';
    }
  }

  function showNotification(message, level = 'success') {
    console.log(`Showing notification: ${message}`);
    const container = document.getElementById('notification-container');
    if (!container) {
      console.error('Notification container not found');
      return;
    }

    const notification = document.createElement('div');
    notification.className = `notification ${level}`;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  function loadModes() {
    const modeSelect = document.getElementById('mode-select');
    if (!modeSelect) {
      showNotification(translations[currentLang].resourceError, 'error');
      return;
    }

    let settings;
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      settings = storedSettings ? JSON.parse(storedSettings) : { modes: { default: { pairs: [], matchCase: false } } };
    } catch (e) {
      console.error('Invalid JSON in localStorage, resetting to default:', e);
      settings = { modes: { default: { pairs: [], matchCase: false } } };
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    }
    const modes = Object.keys(settings.modes || { default: [] });

    modeSelect.innerHTML = '';
    modes.forEach(mode => {
      const option = document.createElement('option');
      option.value = mode;
      option.textContent = mode;
      modeSelect.appendChild(option);
    });
    modeSelect.value = currentMode;
    loadSettings();
    updateModeButtons();
  }

  function loadSettings() {
    let settings;
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      settings = storedSettings ? JSON.parse(storedSettings) : { modes: { default: { pairs: [], matchCase: false } } };
    } catch (e) {
      console.error('Invalid JSON in localStorage, resetting to default:', e);
      settings = { modes: { default: { pairs: [], matchCase: false } } };
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    }
    const modeSettings = settings.modes?.[currentMode] || { pairs: [], matchCase: false };
    const listItems = document.getElementById('punctuation-list');
    if (listItems) {
      listItems.innerHTML = '';
      if (!modeSettings.pairs || modeSettings.pairs.length === 0) {
        addPair('', '');
      } else {
        modeSettings.pairs.slice().reverse().forEach(pair => {
          addPair(pair.find || '', pair.replace || '');
        });
      }
    }
    matchCaseEnabled = modeSettings.matchCase || false;
    updateButtonStates();
  }

  function addPair(find = '', replace = '') {
    const list = document.getElementById('punctuation-list');
    if (!list) {
      showNotification(translations[currentLang].resourceError, 'error');
      return;
    }

    const item = document.createElement('div');
    item.className = 'punctuation-item';

    const findInput = document.createElement('input');
    findInput.type = 'text';
    findInput.className = 'find';
    findInput.placeholder = translations[currentLang].findPlaceholder;
    findInput.value = find;

    const replaceInput = document.createElement('input');
    replaceInput.type = 'text';
    replaceInput.className = 'replace';
    replaceInput.placeholder = translations[currentLang].replacePlaceholder;
    replaceInput.value = replace;

    const removeButton = document.createElement('button');
    removeButton.className = 'remove';
    removeButton.textContent = translations[currentLang].removeButton;

    item.appendChild(findInput);
    item.appendChild(replaceInput);
    item.appendChild(removeButton);

    if (list.firstChild) {
      list.insertBefore(item, list.firstChild);
    } else {
      list.appendChild(item);
    }

    removeButton.addEventListener('click', (e) => {
      e.preventDefault();
      item.remove();
    });
  }

  function checkLoginStatus() {
    console.log('Checking login status...');
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const loginContainer = document.getElementById('login-container');
    const mainContainer = document.getElementById('main-container');
    if (!loginContainer || !mainContainer) {
      showNotification(translations[currentLang].resourceError, 'error');
      return;
    }

    let accounts;
    try {
      accounts = getAccounts(); // Lấy dữ liệu mới từ account.js
    } catch (e) {
      console.error('Failed to load accounts:', e);
      showNotification(translations[currentLang].resourceError, 'error');
      return;
    }

    if (user && user.username && user.password) {
      console.log('Found user in localStorage:', user);
      const account = accounts.find(acc => acc.username === user.username && acc.password === user.password);
      if (account) {
        // Kiểm tra lại locked từ account.js ngay cả khi đã đăng nhập
        if (account.locked || (!account.isAdmin && account.expiry && Date.now() >= account.expiry)) {
          showNotification(translations[currentLang].keyExpired, 'error');
          localStorage.removeItem('currentUser');
          loginContainer.style.display = 'block';
          mainContainer.style.display = 'none';
        } else {
          currentUser = account;
          loginContainer.style.display = 'none';
          mainContainer.style.display = 'block';
          document.getElementById('manage-button').style.display = account.isAdmin ? 'inline-block' : 'none';
          if (!account.isAdmin) {
            document.getElementById('key-timer-user').style.display = 'block';
            updateKeyTimer(account.expiry);
          } else {
            document.getElementById('key-timer-user').style.display = 'none';
          }
        }
      } else {
        localStorage.removeItem('currentUser');
        loginContainer.style.display = 'block';
        mainContainer.style.display = 'none';
      }
    } else {
      loginContainer.style.display = 'block';
      mainContainer.style.display = 'none';
    }
  }

  function updateKeyTimer(expiry) {
    const timerElement = document.getElementById('key-timer-user');
    if (!timerElement) {
      showNotification(translations[currentLang].resourceError, 'error');
      return;
    }

    const timerUpdate = () => {
      const now = Date.now();
      if (now >= expiry) {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('main-container').style.display = 'none';
        showNotification(translations[currentLang].keyExpired, 'error');
        localStorage.removeItem('currentUser');
        clearInterval(timerInterval);
        return;
      }

      const timeLeft = expiry - now;
      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
      timerElement.textContent = translations[currentLang].keyTimer.replace('{time}', `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);
    };

    timerUpdate();
    const timerInterval = setInterval(timerUpdate, 1000);
  }

  function handleLogin() {
    console.log('login attempt');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    if (!usernameInput || !passwordInput) {
      showNotification(translations[currentLang].resourceError, 'error');
      return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showNotification(translations[currentLang].emptyCredentials, 'error');
      return;
    }

    let accounts;
    try {
      accounts = getAccounts();
    } catch (e) {
      console.error('Failed to load accounts:', e);
      showNotification(translations[currentLang].resourceError, 'error');
      return;
    }

    const userAccount = accounts.find(acc => acc.username === username && acc.password === password);

    if (!userAccount) {
      showNotification(translations[currentLang].invalidCredentials, 'error');
      usernameInput.value = '';
      passwordInput.value = '';
      return;
    }

    if (userAccount.locked || (!userAccount.isAdmin && userAccount.expiry && Date.now() >= userAccount.expiry)) {
      showNotification(translations[currentLang].keyExpired, 'error');
      usernameInput.value = '';
      passwordInput.value = '';
      return;
    }

    currentUser = userAccount;
    localStorage.setItem('currentUser', JSON.stringify({ username, password }));
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
    document.getElementById('manage-button').style.display = userAccount.isAdmin ? 'inline-block' : 'none';
    document.getElementById('key-timer-user').style.display = userAccount.isAdmin ? 'none' : 'block';
    showNotification(translations[currentLang].loginSuccess, 'success');
    usernameInput.value = '';
    passwordInput.value = '';
    if (!userAccount.isAdmin) {
      updateKeyTimer(userAccount.expiry);
    }
  }

  function attachButtonEvents() {
    console.log('Attaching button events...');
    const buttons = {
      matchCaseButton: document.getElementById('match-case'),
      deleteModeButton: document.getElementById('delete-mode'),
      renameModeButton: document.getElementById('rename-mode'),
      addModeButton: document.getElementById('add-mode'),
      copyModeButton: document.getElementById('copy-mode'),
      modeSelect: document.getElementById('mode-select'),
      addPairButton: document.getElementById('add-pair'),
      saveSettingsButton: document.getElementById('save-settings'),
      manageButton: document.getElementById('manage-button'),
      replaceButton: document.getElementById('replace-button'),
      copyButton: document.getElementById('copy-button'),
      splitButton: document.getElementById('split-button'),
      copyButton1: document.getElementById('copy-button1'),
      copyButton2: document.getElementById('copy-button2'),
      exportSettingsButton: document.getElementById('export-settings'),
      importSettingsButton: document.getElementById('import-settings'),
      loginButton: document.getElementById('login-button')
    };

    const addMobileEvent = (element, callback) => {
      if (element) {
        element.addEventListener('click', callback);
        element.addEventListener('touchstart', (e) => {
          e.preventDefault();
          callback(e);
        }, { passive: false });
      }
    };

    if (buttons.matchCaseButton) {
      addMobileEvent(buttons.matchCaseButton, () => {
        matchCaseEnabled = !matchCaseEnabled;
        updateButtonStates();
        saveSettings();
      });
    }

    if (buttons.deleteModeButton) {
      addMobileEvent(buttons.deleteModeButton, () => {
        if (currentMode !== 'default' && confirm(`Bạn có chắc chắn muốn xóa chế độ "${currentMode}"?`)) {
          const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
          if (settings.modes[currentMode]) {
            delete settings.modes[currentMode];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
            currentMode = 'default';
            loadModes();
            showNotification(translations[currentLang].modeDeleted.replace('{mode}', currentMode), 'success');
          }
        }
      });
    }

    if (buttons.renameModeButton) {
      addMobileEvent(buttons.renameModeButton, () => {
        const newName = prompt(translations[currentLang].renamePrompt);
        if (newName && !newName.includes('mode_') && newName.trim() !== '' && newName !== currentMode) {
          const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
          if (settings.modes[currentMode]) {
            settings.modes[newName] = settings.modes[currentMode];
            delete settings.modes[currentMode];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
            currentMode = newName;
            loadModes();
            showNotification(translations[currentLang].renameSuccess.replace('{mode}', newName), 'success');
          } else {
            showNotification(translations[currentLang].renameError, 'error');
          }
        }
      });
    }

    if (buttons.addModeButton) {
      addMobileEvent(buttons.addModeButton, () => {
        const newMode = prompt(translations[currentLang].newModePrompt);
        if (newMode && !newMode.includes('mode_') && newMode.trim() !== '' && newMode !== 'default') {
          const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
          if (settings.modes[newMode]) {
            showNotification(translations[currentLang].invalidModeName, 'error');
            return;
          }
          settings.modes[newMode] = { pairs: [], matchCase: false };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
          currentMode = newMode;
          loadModes();
          showNotification(translations[currentLang].modeCreated.replace('{mode}', newMode), 'success');
        } else {
          showNotification(translations[currentLang].invalidModeName, 'error');
        }
      });
    }

    if (buttons.copyModeButton) {
      addMobileEvent(buttons.copyModeButton, () => {
        const newMode = prompt(translations[currentLang].newModePrompt);
        if (newMode && !newMode.includes('mode_') && newMode.trim() !== '' && newMode !== 'default') {
          const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
          if (settings.modes[newMode]) {
            showNotification(translations[currentLang].invalidModeName, 'error');
            return;
          }
          settings.modes[newMode] = JSON.parse(JSON.stringify(settings.modes[currentMode] || { pairs: [], matchCase: false }));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
          currentMode = newMode;
          loadModes();
          showNotification(translations[currentLang].modeCreated.replace('{mode}', newMode), 'success');
        } else {
          showNotification(translations[currentLang].invalidModeName, 'error');
        }
      });
    }

    if (buttons.modeSelect) {
      buttons.modeSelect.addEventListener('change', (e) => {
        currentMode = e.target.value;
        loadSettings();
        showNotification(translations[currentLang].switchedMode.replace('{mode}', currentMode), 'success');
        updateModeButtons();
      });
    }

    if (buttons.addPairButton) {
      addMobileEvent(buttons.addPairButton, () => addPair('', ''));
    }

    if (buttons.saveSettingsButton) {
      addMobileEvent(buttons.saveSettingsButton, () => saveSettings());
    }

    if (buttons.manageButton) {
      addMobileEvent(buttons.manageButton, () => window.open('manage.html', '_blank'));
    }

    if (buttons.replaceButton) {
      addMobileEvent(buttons.replaceButton, () => {
        const inputTextArea = document.getElementById('input-text');
        if (!inputTextArea || !inputTextArea.value) {
          showNotification(translations[currentLang].noTextToReplace, 'error');
          return;
        }

        const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
        let outputText = inputTextArea.value;
        const modeSettings = settings.modes?.[currentMode] || { pairs: [], matchCase: false };
        const pairs = modeSettings.pairs || [];
        if (pairs.length === 0) {
          showNotification(translations[currentLang].noPairsConfigured, 'error');
          return;
        }

        const matchCase = modeSettings.matchCase || false;

        pairs.forEach(pair => {
          let find = pair.find;
          let replace = pair.replace !== undefined ? pair.replace : '';
          if (!find) return;

          let findMatch, replaceMatch;
          const quoteRegex = /^(['"])(.*)\1$/;
          const parenRegex = /^(\()(.*)(\))$/;

          findMatch = find.match(quoteRegex) || find.match(parenRegex);
          replaceMatch = replace.match(quoteRegex) || replace.match(parenRegex);

          let findCore = findMatch ? findMatch[2] : find;
          let replaceCore = replaceMatch ? replaceMatch[2] : replace;
          let findPrefix = findMatch ? findMatch[1] : '';
          let findSuffix = findMatch ? (findMatch[3] || findMatch[1]) : '';
          let replacePrefix = replaceMatch ? replaceMatch[1] : (findMatch ? findPrefix : '');
          let replaceSuffix = replaceMatch ? (replaceMatch[3] || replaceMatch[1]) : (findMatch ? findSuffix : '');

          let regexPattern = escapeRegExp(findCore);
          if (findMatch) {
            regexPattern = `${escapeRegExp(findPrefix)}${regexPattern}${escapeRegExp(findSuffix)}`;
          }

          const regexFlags = matchCase ? 'gu' : 'giu';
          const regex = new RegExp(regexPattern, regexFlags);

          if (matchCase) {
            outputText = outputText.replace(regex, (match, offset, string) => {
              const isStartOfLine = offset === 0 || string[offset - 1] === '\n';
              const isAfterPeriod = offset > 1 && string.substring(offset - 2, offset).match(/\.\s/);

              let finalReplaceCore = replaceCore;
              if (isStartOfLine || isAfterPeriod) {
                finalReplaceCore = replaceCore.charAt(0).toUpperCase() + replaceCore.slice(1);
              }

              return `${replacePrefix}${finalReplaceCore}${replaceSuffix}`;
            });
          } else {
            const replacement = `${replacePrefix}${replaceCore}${replaceSuffix}`;
            outputText = outputText.replace(regex, replacement);
          }
        });

        const paragraphs = outputText.split('\n').filter(p => p.trim());
        outputText = paragraphs.join('\n\n');

        const outputTextArea = document.getElementById('output-text');
        if (outputTextArea) {
          outputTextArea.value = outputText;
          inputTextArea.value = '';
          showNotification(translations[currentLang].textReplaced, 'success');
        }
      });
    }

    if (buttons.copyButton) {
      addMobileEvent(buttons.copyButton, () => {
        const outputTextArea = document.getElementById('output-text');
        if (outputTextArea && outputTextArea.value) {
          navigator.clipboard.writeText(outputTextArea.value).then(() => {
            showNotification(translations[currentLang].textCopied, 'success');
          }).catch(() => {
            showNotification(translations[currentLang].failedToCopy, 'error');
          });
        } else {
          showNotification(translations[currentLang].noTextToCopy, 'error');
        }
      });
    }

    if (buttons.splitButton) {
      addMobileEvent(buttons.splitButton, () => {
        const inputTextArea = document.getElementById('split-input-text');
        const output1TextArea = document.getElementById('output1-text');
        const output2TextArea = document.getElementById('output2-text');
        if (!inputTextArea || !inputTextArea.value) {
          showNotification(translations[currentLang].noTextToSplit, 'error');
          return;
        }

        let text = inputTextArea.value;
        const chapterRegex = /^Chương\s+(\d+)(?::\s*(.*))?$/m;
        let chapterNum = 1;
        let chapterTitle = '';

        const match = text.match(chapterRegex);
        if (match) {
          chapterNum = parseInt(match[1]);
          chapterTitle = match[2] ? `: ${match[2]}` : '';
          text = text.replace(chapterRegex, '').trim();
        }

        const paragraphs = text.split('\n').filter(p => p.trim());
        const totalWords = text.split(/\s+/).filter(word => word.trim()).length;
        const targetWords = Math.floor(totalWords / 2);

        let wordCount = 0;
        let splitIndex = 0;
        for (let i = 0; i < paragraphs.length; i++) {
          const wordsInParagraph = paragraphs[i].split(/\s+/).filter(word => word.trim()).length;
          wordCount += wordsInParagraph;
          if (wordCount >= targetWords) {
            splitIndex = i + 1;
            break;
          }
        }

        const part1 = paragraphs.slice(0, splitIndex).join('\n\n');
        const part2 = paragraphs.slice(splitIndex).join('\n\n');

        if (output1TextArea && output2TextArea) {
          output1TextArea.value = `Chương ${chapterNum}.1${chapterTitle}\n\n${part1}`;
          output2TextArea.value = `Chương ${chapterNum}.2${chapterTitle}\n\n${part2}`;
          inputTextArea.value = '';
          showNotification('Đã chia chương thành công!', 'success');
        }
      });
    }

    if (buttons.copyButton1) {
      addMobileEvent(buttons.copyButton1, () => {
        const output1TextArea = document.getElementById('output1-text');
        if (output1TextArea && output1TextArea.value) {
          navigator.clipboard.writeText(output1TextArea.value).then(() => {
            showNotification(translations[currentLang].textCopied, 'success');
          }).catch(() => {
            showNotification(translations[currentLang].failedToCopy, 'error');
          });
        } else {
          showNotification(translations[currentLang].noTextToCopy, 'error');
        }
      });
    }

    if (buttons.copyButton2) {
      addMobileEvent(buttons.copyButton2, () => {
        const output2TextArea = document.getElementById('output2-text');
        if (output2TextArea && output2TextArea.value) {
          navigator.clipboard.writeText(output2TextArea.value).then(() => {
            showNotification(translations[currentLang].textCopied, 'success');
          }).catch(() => {
            showNotification(translations[currentLang].failedToCopy, 'error');
          });
        } else {
          showNotification(translations[currentLang].noTextToCopy, 'error');
        }
      });
    }

    if (buttons.exportSettingsButton) {
      addMobileEvent(buttons.exportSettingsButton, () => {
        const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extension_settings.json';
        a.click();
        URL.revokeObjectURL(url);
        showNotification(translations[currentLang].settingsExported, 'success');
      });
    }

    if (buttons.importSettingsButton) {
      addMobileEvent(buttons.importSettingsButton, () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const settings = JSON.parse(e.target.result);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
                loadModes();
                showNotification(translations[currentLang].settingsImported, 'success');
              } catch (err) {
                showNotification(translations[currentLang].importError, 'error');
              }
            };
            reader.readAsText(file);
          }
        });
        input.click();
      });
    }

    if (buttons.loginButton) {
      console.log('Attaching event to login button');
      addMobileEvent(buttons.loginButton, handleLogin);
    } else {
      console.error('Login button not found');
    }
  }

  function saveSettings() {
    const pairs = [];
    const items = document.querySelectorAll('.punctuation-item');
    if (items.length === 0) {
      showNotification(translations[currentLang].noPairsToSave, 'error');
      return;
    }
    items.forEach(item => {
      const find = item.querySelector('.find')?.value || '';
      const replace = item.querySelector('.replace')?.value || '';
      if (find) pairs.push({ find, replace });
    });

    const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
    settings.modes[currentMode] = { pairs, matchCase: matchCaseEnabled };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    loadSettings();
    showNotification(translations[currentLang].settingsSaved.replace('{mode}', currentMode), 'success');
  }

  function attachTabEvents() {
    document.querySelectorAll('.tab-button').forEach(button => {
      const handler = () => {
        const tabName = button.getAttribute('data-tab');
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) selectedTab.classList.add('active');
        button.classList.add('active');
      };
      button.addEventListener('click', handler);
      button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handler();
      }, { passive: false });
    });
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  window.addEventListener('error', (event) => {
    console.error('Resource loading error:', event.message);
    showNotification(translations[currentLang].resourceError, 'error');
  });

  window.addEventListener('storage', (event) => {
    if (event.key === ACCOUNTS_STORAGE_KEY) {
      checkLoginStatus();
    }
  });

  setInterval(checkLoginStatus, 5000);

  try {
    console.log('Initializing app...');
    updateLanguage('vn');
    loadModes();
    attachButtonEvents();
    attachTabEvents();
    checkLoginStatus();
  } catch (error) {
    console.error('Initialization error:', error);
    showNotification('Có lỗi khi khởi tạo ứng dụng!', 'error');
  }
});
