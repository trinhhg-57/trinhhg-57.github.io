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
    locked: false, // Thay đổi từ true sang false
    expiry: Date.now() + 24 * 60 * 60 * 1000 // Hết hạn sau 24 giờ
  },
  {
    username: "user2",
    password: "password2",
    isAdmin: false,
    locked: true, // Thay đổi từ true sang false
    expiry: Date.now() + 48 * 60 * 60 * 1000 // Hết hạn sau 48 giờ
  },
  {
    username: "user3",
    password: "password3",
    isAdmin: false,
    locked: false, // Thay đổi từ true sang false
    expiry: Date.now() + 2 * 60 * 60 * 1000 // Hết hạn sau 2 giờ
  }
];

// Đồng bộ trạng thái locked từ initialAccounts
function syncLockedStates() {
  let storedAccounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || [];
  let updatedAccounts = storedAccounts.slice(); // Sao chép mảng hiện tại

  initialAccounts.forEach(initialAcc => {
    const storedAccIndex = updatedAccounts.findIndex(acc => acc.username === initialAcc.username);
    if (storedAccIndex !== -1) {
      // Cập nhật trạng thái locked từ initialAccounts, giữ expiry từ localStorage
      updatedAccounts[storedAccIndex] = {
        ...updatedAccounts[storedAccIndex],
        locked: initialAcc.locked,
        expiry: updatedAccounts[storedAccIndex].expiry // Giữ expiry hiện tại
      };
    } else {
      // Thêm tài khoản mới nếu chưa tồn tại
      updatedAccounts.push({ ...initialAcc });
    }
  });

  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
}

// Khởi tạo hoặc đồng bộ danh sách tài khoản
syncLockedStates(); // Chạy lần đầu khi tải file

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

export { syncLockedStates }; // Xuất hàm để sử dụng ở các file khác
