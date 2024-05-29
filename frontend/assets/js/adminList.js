const adminList = document.querySelector("#admin-list");

const fetchAdminList = async () => {
  try {
    console.log("fetching users");
    const res = await fetch(`${BACKEND_ROOT_URL}/api/admin`);
    const data = await res.json();
    if (res.status === 200) {
      adminList.innerHTML = "";
      data.forEach((p) => {
        adminList.innerHTML += `   <tr class="admin-list-item">
                        <td>${p.createdAt}</td>
                        <td>${p._id}</td>
                        <td>${p.username}</td>
                        <td>${p.email}</td>
                        <td><button id=${p._id} class="delete-user">Delete</button></td>
                    </tr>`;
        document.querySelectorAll(".delete-user").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            handleDeleteAdminUser(e);
          });
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteAdminUser = async (e) => {
  const admin_id = e.target.id;

  e.target.closest(".admin-list-item").remove();

  try {
    const res = await fetch(`${BACKEND_ROOT_URL}/api/admin/${admin_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      showToast("Admin user created successfully.", "success");
    }
  } catch (error) {
    console.log("error", error);
  }
};

fetchAdminList();
