// manage.js
import { getAccounts, updateAccount, syncLockedStates } from './account.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Manage DOM fully loaded');

  const translations = {
    vn: {
      appTitle: 'Quản Lý Tài Khoản',
      lockAccount: 'Khóa',
      activateAccount: 'Kích hoạt',
      adminAccount: 'Tài khoản admin không có thời hạn',
      accountLocked: 'Tài khoản đã bị khóa!',
      accountActivated: 'Tài khoản đã được kích hoạt!',
      keyTimer: 'Thời gian còn lại: {time}',
      keyExpired: 'Hết hạn'
    }
  };

  let currentLang = 'vn';
  const ACCOUNTS_STORAGE_KEY = 'accounts';

  function updateLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.getElementById('app-title').textContent = translations[lang].appTitle;
  }

  function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  function updateAccountList() {
    const accountList = document.getElementById('account-list');
    if (!accountList) return;

    accountList.innerHTML = '';
    const accounts = getAccounts();

    accounts.forEach(account => {
      const row = document.createElement('tr');
      const accountCell = document.createElement('td');
      const expiryCell = document.createElement('td');
      const actionCell = document.createElement('td');

      const usernameDiv = document.createElement('div');
      usernameDiv.textContent = `Tên: ${account.username}`;
      const passwordDiv = document.createElement('div');
      passwordDiv.textContent = `Mật khẩu: ${account.password}`;
      accountCell.appendChild(usernameDiv);
      accountCell.appendChild(passwordDiv);
      accountCell.style.border = '1px solid #ccc';
      accountCell.style.padding = '8px';

      if (account.isAdmin) {
        expiryCell.textContent = translations[currentLang].adminAccount;
      } else if (account.locked) {
        expiryCell.textContent = 'Đã khóa';
      } else if (account.expiry) {
        const timeLeft = account.expiry - Date.now();
        if (timeLeft > 0) {
          const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
          expiryCell.textContent = translations[currentLang].keyTimer.replace('{time}', `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);
        } else {
          expiryCell.textContent = translations[currentLang].keyExpired;
        }
      } else {
        expiryCell.textContent = 'Không có thời hạn';
      }
      expiryCell.style.border = '1px solid #ccc';
      expiryCell.style.padding = '8px';

      const actionButtons = document.createElement('div');
      actionButtons.className = 'action-buttons';

      const lockButton = document.createElement('button');
      lockButton.className = 'lock-button';
      lockButton.textContent = translations[currentLang].lockAccount;
      lockButton.disabled = account.locked;

      const activateButton = document.createElement('button');
      activateButton.className = 'activate-button';
      activateButton.textContent = translations[currentLang].activateAccount;
      activateButton.disabled = !account.locked;

      const handleLock = () => {
        updateAccount(account.username, { locked: true });
        syncLockedStates(); // Đồng bộ sau khi khóa
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(getAccounts()));
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.username === account.username) {
          localStorage.removeItem('currentUser');
          showNotification(translations[currentLang].accountLocked, 'success');
        } else {
          showNotification(translations[currentLang].accountLocked, 'success');
        }
        updateAccountList();
      };

      const handleActivate = () => {
        updateAccount(account.username, { locked: false });
        syncLockedStates(); // Đồng bộ sau khi kích hoạt
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(getAccounts()));
        showNotification(translations[currentLang].accountActivated, 'success');
        updateAccountList();
      };

      lockButton.addEventListener('click', handleLock);
      lockButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleLock();
      });

      activateButton.addEventListener('click', handleActivate);
      activateButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleActivate();
      });

      actionButtons.appendChild(lockButton);
      actionButtons.appendChild(activateButton);
      actionCell.appendChild(actionButtons);
      actionCell.style.border = '1px solid #ccc';
      actionCell.style.padding = '8px';

      row.appendChild(accountCell);
      row.appendChild(expiryCell);
      row.appendChild(actionCell);
      accountList.appendChild(row);
    });
  }

  try {
    syncLockedStates(); // Đồng bộ trạng thái locked khi tải trang
    updateLanguage('vn');
    updateAccountList();
  } catch (error) {
    console.error('Error in manage.js:', error);
    showNotification('Có lỗi khi khởi tạo trang quản lý!', 'error');
  }
});
