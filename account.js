// accounts.js
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
    locked: fasle,
    expiry: Date.now() + 24 * 60 * 60 * 1000 // Hết hạn sau 24 giờ
  },
  {
    username: "user2",
    password: "password2",
    isAdmin: false,
    locked: true, // Đã đặt thành true
    expiry: Date.now() + 48 * 60 * 60 * 1000 // Hết hạn sau 48 giờ
  },
  {
    username: "user3",
    password: "password3",
    isAdmin: false,
    locked: false,
    expiry: Date.now() + 2 * 60 * 60 * 1000 // Hết hạn sau 2 giờ
  }
];

// Đồng bộ trạng thái locked từ initialAccounts
function syncLockedStates() {
  let storedAccounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || [];
  let updatedAccounts = [];

  initialAccounts.forEach(initialAcc => {
    const storedAcc = storedAccounts.find(acc => acc.username === initialAcc.username);
    if (storedAcc) {
      updatedAccounts.push({
        ...storedAcc,
        locked: initialAcc.locked,
        isAdmin: initialAcc.isAdmin
      });
    } else {
      updatedAccounts.push({ ...initialAcc });
    }
  });

  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
}

// Reset hoàn toàn localStorage và đồng bộ lại từ initialAccounts
function resetAccounts() {
  localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
  syncLockedStates();
}

export function getAccounts() {
  const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY));
  if (!accounts || accounts.length === 0) {
    syncLockedStates();
    return JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || initialAccounts;
  }
  return accounts;
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

export { syncLockedStates, resetAccounts }; // Đảm bảo export đúng
