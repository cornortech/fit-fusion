const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const registerPayload = {
    username: e.target.username.value,
    password: e.target.password.value,
    email: e.target.email.value,
    contact: +e.target.contact.value,
  };
  const res = await fetch(`${BACKEND_ROOT_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerPayload),
  });
  const data = await res.json();
  if (res.status === 201) {
    setLoggedInUser(data);
    showToast("Registration successfull.", "success");
    setTimeout(() => {
      if (data.isAdmin) {
        location.href = "/frontend/admin/admin.html";
      } else {
        location.href = "/frontend/index.html";
      }
    }, 2000);
  } else {
    showToast("Failed to register.", "error");
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const registerPayload = {
    password: e.target.password.value,
    email: e.target.email.value,
  };

  try {
    const res = await fetch(`${BACKEND_ROOT_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerPayload),
    });
    const data = await res.json();
    if (res.status === 200) {
      setLoggedInUser(data);
      showToast("Login successfull.");
      setTimeout(() => {
        setTimeout(() => {
          if (data.isAdmin) {
            location.href = "/frontend/admin/admin.html";
          } else {
            location.href = "/frontend/index.html";
          }
        }, 2000);
      }, 2000);
    } else {
      throw new Error(data?.message);
    }
  } catch (err) {
    console.log(err);
    showToast(err?.message || "Failed to login", "error");
  }
});
