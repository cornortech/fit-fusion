const adminForm = document.querySelector("#add-admin-form");


adminForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const createPayload = {
    username: e.target.username.value,
    password: e.target.password.value,
    email: e.target.email.value,
  };
  const res = await fetch(`${BACKEND_ROOT_URL}/api/admin/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createPayload),
  });
  const data = await res.json();
  if (res.status === 201) {
    setLoggedInUser(data);
    showToast("Admin user created successfully.", "success");
    setTimeout(() => {
      location.href = "/frontend/admin/adminUsersList.html";
    }, 2000);
  } else {
    showToast("Failed to add admin user.", "error");
  }
});
