// manage.js
import { getAccounts, updateAccount } from './account.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Manage DOM fully loaded');

  const translations = {
    vn: {
      appTitle: 'Quản Lý - Tiện Ích Của Trịnh Hg',
      manageTitle: 'Quản Lý Tài Khoản',
      lockAccount: 'Khóa',
      activateAccount: 'Kích hoạt',
      adminAccount: 'Tài khoản admin không có thời hạn'
    }
  };

  let currentLang = 'vn';

  function updateLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.getElementById('app-title').textContent = translations[lang].appTitle;
    document.getElementById('manage-title').textContent = translations[lang].manageTitle;
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
      const usernameCell = document.createElement('td');
      const expiryCell = document.createElement('td');
      const actionCell = document.createElement('td');
      const actionButton = document.createElement('button');

      usernameCell.textContent = account.username;
      usernameCell.style.border = '1px solid #ccc';
      usernameCell.style.padding = '8px';

      if (account.isAdmin) {
        expiryCell.textContent = translations[currentLang].adminAccount;
      } else if (account.locked) {
        expiryCell.textContent = 'Đã khóa';
      } else if (account.expiry) {
        const timeLeft = account.expiry - Date.now();
        if (timeLeft > 0) {
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          expiryCell.textContent = `${hours}h ${minutes}m`;
        } else {
          expiryCell.textContent = 'Hết hạn';
        }
      } else {
        expiryCell.textContent = 'Không có thời hạn';
      }
      expiryCell.style.border = '1px solid #ccc';
      expiryCell.style.padding = '8px';

      actionButton.textContent = account.locked ? translations[currentLang].activateAccount : translations[currentLang].lockAccount;
      actionButton.style.padding = '5px 10px';
      actionButton.style.background = account.locked ? '#28a745' : '#dc3545';
      actionButton.style.color = 'white';
      actionButton.style.border = 'none';
      actionButton.style.cursor = 'pointer';
      actionButton.addEventListener('click', () => {
        updateAccount(account.username, { locked: !account.locked });
        updateAccountList();
        showNotification(account.locked ? 'Tài khoản đã được kích hoạt!' : 'Tài khoản đã bị khóa!', 'success');
      });

      actionCell.style.border = '1px solid #ccc';
      actionCell.style.padding = '8px';
      actionCell.appendChild(actionButton);

      row.appendChild(usernameCell);
      row.appendChild(expiryCell);
      row.appendChild(actionCell);
      accountList.appendChild(row);
    });
  }

  try {
    updateLanguage('vn');
    updateAccountList();
    setInterval(updateAccountList, 60000); // Cập nhật mỗi phút
  } catch (error) {
    console.error('Error in manage.js:', error);
    showNotification('Có lỗi khi khởi tạo trang quản lý!', 'error');
  }
});