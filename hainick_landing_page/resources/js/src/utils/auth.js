// src/utils/auth.js

const SESSION_KEY = "admin_session";
const LAST_ACTIVITY_KEY = "admin_last_activity";
const TIMEOUT_MS = 60 * 60 * 1000; // 1 jam

export const auth = {
  login() {
    localStorage.setItem(SESSION_KEY, "true");
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  },

  updateActivity() {
    if (this.isLoggedIn()) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  },

  isLoggedIn() {
    const session = localStorage.getItem(SESSION_KEY);
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);

    if (!session || !lastActivity) return false;

    const elapsed = Date.now() - parseInt(lastActivity, 10);
    if (elapsed > TIMEOUT_MS) {
      this.logout();
      return false;
    }

    return true;
  },
};
