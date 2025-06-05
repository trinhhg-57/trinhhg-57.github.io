// account.js
const accounts = [
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
    locked: false,
    expiry: Date.now() + 24 * 60 * 60 * 1000 // Hết hạn sau 24 giờ
  },
  {
    username: "user2",
    password: "password2",
    isAdmin: false,
    locked: false,
    expiry: Date.now() + 48 * 60 * 60 * 1000 // Hết hạn sau 48 giờ
  }
];

export function getAccounts() {
  return accounts;
}

export function updateAccount(username, updates) {
  const account = accounts.find(acc => acc.username === username);
  if (account) {
    Object.assign(account, updates);
  }
}

export function addAccount(account) {
  accounts.push(account);
}