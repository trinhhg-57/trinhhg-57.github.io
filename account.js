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
  }
];

// Kiểm tra và đồng bộ localStorage với initialAccounts
function syncAccountsWithInitial() {
  const storedAccounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || [];
  const updatedAccounts = initialAccounts.map(initialAcc => {
    const storedAcc = storedAccounts.find(acc => acc.username === initialAcc.username);
    return storedAcc ? { ...initialAcc, ...storedAcc, locked: initialAcc.locked, expiry: initialAcc.expiry } : initialAcc;
  });

  // Thêm các tài khoản mới từ localStorage mà không có trong initialAccounts
  storedAccounts.forEach(storedAcc => {
    if (!updatedAccounts.find(acc => acc.username === storedAcc.username)) {
      updatedAccounts.push(storedAcc);
    }
  });

  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
}

// Khởi tạo hoặc đồng bộ danh sách tài khoản
syncAccountsWithInitial();

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
