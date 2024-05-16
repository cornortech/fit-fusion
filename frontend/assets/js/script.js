const BACKEND_ROOT_URL = "http://localhost:8000";
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
  if (user) {
    document
      .querySelector("#diet-plan-select")
      .classList.remove("blur-diet-select");
    document.querySelector("#diet-plan-select").disabled = false;
    document.querySelector("#diet-login-button").style.display = "none";
  } else {
        document
          .querySelector("#diet-plan-select")
          .classList.add("blur-diet-select");
    document.querySelector("#diet-plan-select").disabled = true;
    document.querySelector("#diet-login-button").style.display = "block";
  }

  const loginButton = document.querySelector("#login_button");
  const logoutButton = document.querySelector("#logout_button");
  if (user) {
    if (loginButton) loginButton.style.display = "none";
    if (logoutButton) logoutButton.style.display = "block";
    if (user.isAdmin) {
      // location.href = "/frontend/admin/admin.html";
    }
  } else {
    if (loginButton) loginButton.style.display = "block";
    if (logoutButton) logoutButton.style.display = "none";
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
console.log("admin", document.querySelector("#logout_button"));
document.querySelector("#logout_button").addEventListener("click", logout);
