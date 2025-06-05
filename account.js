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
    locked: true,
    expiry: Date.now() + 24 * 60 * 60 * 1000 // Hết hạn sau 24 giờ
  },
  {
    username: "user2",
    password: "password2",
    isAdmin: false,
    locked: true,
    expiry: Date.now() + 48 * 60 * 60 * 1000 // Hết hạn sau 48 giờ
  },
  {
    username: "user3",
    password: "password3",
    isAdmin: false,
    locked: true,
    expiry: Date.now() + 2 * 60 * 60 * 1000 // Hết hạn sau 2 giờ
  }
];

// Đồng bộ initialAccounts với localStorage
function syncAccountsWithInitial() {
  let storedAccounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || [];
  let updatedAccounts = [];

  // Thêm hoặc cập nhật tài khoản từ initialAccounts
  initialAccounts.forEach(initialAcc => {
    const storedAcc = storedAccounts.find(acc => acc.username === initialAcc.username);
    if (storedAcc) {
      // Nếu tài khoản đã tồn tại trong localStorage, cập nhật trạng thái locked từ initialAccounts
      // nhưng giữ nguyên expiry từ localStorage (để tránh reset thời gian hết hạn)
      updatedAccounts.push({
        ...initialAcc,
        expiry: storedAcc.expiry // Giữ expiry từ localStorage
      });
    } else {
      // Nếu tài khoản chưa tồn tại, thêm mới từ initialAccounts
      updatedAccounts.push({ ...initialAcc });
    }
  });

  // Thêm các tài khoản từ localStorage mà không có trong initialAccounts
  storedAccounts.forEach(storedAcc => {
    if (!updatedAccounts.find(acc => acc.username === storedAcc.username)) {
      updatedAccounts.push(storedAcc);
    }
  });

  // Lưu lại vào localStorage
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
