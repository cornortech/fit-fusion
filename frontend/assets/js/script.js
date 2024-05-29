const BACKEND_ROOT_URL = "http://localhost:8000";
const FRONTEND_ROOT_URL="http://127.0.0.1:5500"

const getLoggedInUser = () => {
  const user = JSON.parse(localStorage.getItem("fit-fusion"));
  return user || null;
};

const setLoggedInUser = (user) => {
  localStorage.setItem("fit-fusion", JSON.stringify(user));
};

function showToast(text, type = "success") {
  Toastify({
    text,
    duration: 3000, // Duration in milliseconds
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    backgroundColor: type === "success" ? "#6055f1" : "red",
    stopOnFocus: true, // Prevents dismissing of toast on hover
  }).showToast();
}

const startApp = () => {
  const user = getLoggedInUser();
  const dietPlanSelect = document.querySelector("#diet-plan-select");
  const dietLoginButton = document.querySelector("#diet-login-button");

  if (user) {
    if (dietPlanSelect) {
      dietPlanSelect.classList.remove("blur-diet-select");
      dietPlanSelect.disabled = false;
    }
    if (dietLoginButton) dietLoginButton.style.display = "none";
  } else {
    if (dietPlanSelect) {
      dietPlanSelect.classList.add("blur-diet-select");
      dietPlanSelect.disabled = true;
    }
    if (dietLoginButton) dietLoginButton.style.display = "block";
  }

  const loginButton = document.querySelector("#login_button");
  const logoutButton = document.querySelector("#logout_button");

  if (user) {
    if (loginButton) loginButton.style.display = "none";
    if (logoutButton) logoutButton.style.display = "block";
  } else {
    if (loginButton) loginButton.style.display = "block";
    if (logoutButton) logoutButton.style.display = "none";
  }

  if (user) {
    if (user.isAdmin || user.isSuperAdmin) {
      const adminUserSidebarItem = document.querySelector(
        "#admin-user-sidebar-item"
      );
      const addUserSidebarItem = document.querySelector(
        "#add-user-sidebar-item"
      );
      if (adminUserSidebarItem) adminUserSidebarItem.style.display = "block";
      if (addUserSidebarItem) addUserSidebarItem.style.display = "block";
    } else {
      const adminUserSidebarItem = document.querySelector(
        "#admin-user-sidebar-item"
      );
      const addUserSidebarItem = document.querySelector(
        "#add-user-sidebar-item"
      );
      if (adminUserSidebarItem) adminUserSidebarItem.style.display = "none";
      if (addUserSidebarItem) addUserSidebarItem.style.display = "none";
    }
  } else {
    const adminUserSidebarItem = document.querySelector(
      "#admin-user-sidebar-item"
    );
    const addUserSidebarItem = document.querySelector("#add-user-sidebar-item");
    if (adminUserSidebarItem) adminUserSidebarItem.style.display = "none";
    if (addUserSidebarItem) addUserSidebarItem.style.display = "none";
  }
};

startApp();

const logout = () => {
  localStorage.removeItem("fit-fusion");
  startApp();
  showToast("Logged out successfully");
  setTimeout(() => {
    if (location.pathname === "/frontend/admin/admin.html") {
      location.href = "/frontend/index.html";
    }
  }, 2000);
};

const logoutButton = document.querySelector("#logout_button");
if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}
