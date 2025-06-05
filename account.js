// account.js
const ACCOUNTS_STORAGE_KEY = 'accounts';

const initialAccounts = [
  {
    username: "trinhhg",
    password: "trinhhg572007",
    isAdmin: true,
    locked: false,
    expiry: null // Admin không có thời hạn
  },
  {
    username: "user1",
    password: "password1",
    isAdmin: false,
    locked: true,
    expiry: Date.now() + 24 * 60 * 60 * 1000 // Hết hạn sau 24 giờ
  },
  {
    username: "user2",
    password: "password2",
    isAdmin: false,
    locked: true, // Tài khoản này bị khóa để kiểm tra
    expiry: Date.now() + 48 * 60 * 60 * 1000 // Hết hạn sau 48 giờ
  },
  {
    username: "user3",
    password: "password3",
    isAdmin: false,
    locked: true, // Tài khoản này bị khóa để kiểm tra
    expiry: Date.now() + 2 * 60 * 60 * 1000 // Hết hạn sau 2 giờ
  }
];

// Khởi tạo danh sách tài khoản trong localStorage nếu chưa có
if (!localStorage.getItem(ACCOUNTS_STORAGE_KEY)) {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(initialAccounts));
}

export function getAccounts() {
  return JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || initialAccounts;
}

export function updateAccount(username, updates) {
  const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || initialAccounts;
  const account = accounts.find(acc => acc.username === username);
  if (account) {
    Object.assign(account, updates);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  }
}

export function addAccount(account) {
  const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || initialAccounts;
  accounts.push(account);
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}
