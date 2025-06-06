// accounts.js
const ACCOUNTS_STORAGE_KEY = 'accounts';

const initialAccounts = [
  {
    username: "trinhhg",
    password: "trinhhg572007",
    isAdmin: true,
    locked: false,
    expiry: null
  },
  {
    username: "user1",
    password: "password1",
    isAdmin: false,
    locked: false, // Đã sửa thành true
    expiry: Date.now() + 24 * 60 * 60 * 1000
  },
  {
    username: "user2",
    password: "password2",
    isAdmin: false,
    locked: true,
    expiry: Date.now() + 48 * 60 * 60 * 1000
  },
  {
    username: "user3",
    password: "password3",
    isAdmin: false,
    locked: false,
    expiry: Date.now() + 3 * 60 * 60 * 1000
  }
];

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

function resetAccounts() {
  localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
  syncLockedStates();
}

function renewAccount(username, hoursToRenew = 24) {
  const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || initialAccounts;
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (currentUser.username !== 'trinhhg' || !currentUser.password || currentUser.password !== 'trinhhg572007') {
    console.error('Only admin "trinhhg" can renew accounts');
    return false;
  }

  const account = accounts.find(acc => acc.username === username);
  if (account && !account.isAdmin) {
    account.expiry = Date.now() + hoursToRenew * 60 * 60 * 1000;
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    console.log(`Account "${username}" renewed for ${hoursToRenew} hours`);
    return true;
  } else {
    console.error(`Account "${username}" not found or is admin`);
    return false;
  }
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

export { syncLockedStates, resetAccounts, renewAccount };
