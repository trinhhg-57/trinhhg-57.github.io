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
      adminAccount: 'Tài khoản admin không có thời hạn',
      accountLocked: 'Tài khoản đã bị khóa!',
      accountActivated: 'Tài khoản đã được kích hoạt!'
    }
  };

  let currentLang = 'vn';
  const ACCOUNTS_STORAGE_KEY = 'accounts';

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
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || getAccounts();

    accounts.forEach(account => {
      const row = document.createElement('tr');
      const accountCell = document.createElement('td');
      const expiryCell = document.createElement('td');
      const actionCell = document.createElement('td');
      const actionButton = document.createElement('button');

      // Hiển thị username và password trong cùng một cột
      const usernameDiv = document.createElement('div');
      usernameDiv.textContent = `Tên: ${account.username}`;
      const passwordDiv = document.createElement('div');
      passwordDiv.textContent = `Mật khẩu: ${account.password}`;
      accountCell.appendChild(usernameDiv);
      accountCell.appendChild(passwordDiv);
      accountCell.style.border = '1px solid #ccc';
      accountCell.style.padding = '8px';

      // Hiển thị thời gian còn lại
      if (account.isAdmin) {
        expiryCell.textContent = translations[currentLang].adminAccount;
      } else if (account.locked) {
        expiryCell.textContent = 'Đã khóa';
      } else if (account.expiry) {
        const timeLeft = account.expiry - Date.now();
        if (timeLeft > 0) {
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          expiryCell.textContent = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          expiryCell.textContent = 'Hết hạn';
        }
      } else {
        expiryCell.textContent = 'Không có thời hạn';
      }
      expiryCell.style.border = '1px solid #ccc';
      expiryCell.style.padding = '8px';

      // Nút khóa/kích hoạt
      actionButton.textContent = account.locked ? translations[currentLang].activateAccount : translations[currentLang].lockAccount;
      actionButton.style.padding = '5px 10px';
      actionButton.style.background = account.locked ? '#28a745' : '#dc3545';
      actionButton.style.color = 'white';
      actionButton.style.border = 'none';
      actionButton.style.cursor = 'pointer';
      actionButton.addEventListener('click', () => {
        const newLockedState = !account.locked;
        updateAccount(account.username, { locked: newLockedState });
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));

        // Nếu tài khoản bị khóa là tài khoản hiện tại, đăng xuất
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.username === account.username && newLockedState) {
          localStorage.removeItem('currentUser');
          showNotification(translations[currentLang].accountLocked, 'success');
          // Gửi sự kiện storage để các tab khác cập nhật
          localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
        } else {
          showNotification(newLockedState ? translations[currentLang].accountLocked : translations[currentLang].accountActivated, 'success');
        }

        updateAccountList();
      });

      actionCell.style.border = '1px solid #ccc';
      actionCell.style.padding = '8px';
      actionCell.appendChild(actionButton);

      row.appendChild(accountCell);
      row.appendChild(expiryCell);
      row.appendChild(actionCell);
      accountList.appendChild(row);
    });
  }

  try {
    updateLanguage('vn');
    updateAccountList();
    setInterval(updateAccountList, 1000); // Cập nhật mỗi giây để hiển thị thời gian chính xác
  } catch (error) {
    console.error('Error in manage.js:', error);
    showNotification('Có lỗi khi khởi tạo trang quản lý!', 'error');
  }
});
