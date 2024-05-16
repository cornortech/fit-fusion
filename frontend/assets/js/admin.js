const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");
allSideMenu.forEach((item) => {
  const li = item.parentElement;

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});

const searchButton = document.querySelector(
  "#content nav form .form-input button"
);
const searchButtonIcon = document.querySelector(
  "#content nav form .form-input button .bx"
);
const searchForm = document.querySelector("#content nav form");

searchButton.addEventListener("click", function (e) {
  if (window.innerWidth < 576) {
    e.preventDefault();
    searchForm.classList.toggle("show");
    if (searchForm.classList.contains("show")) {
      searchButtonIcon.classList.replace("bx-search", "bx-x");
    } else {
      searchButtonIcon.classList.replace("bx-x", "bx-search");
    }
  }
});

if (window.innerWidth < 768) {
  sidebar.classList.add("hide");
} else if (window.innerWidth > 576) {
  searchButtonIcon.classList.replace("bx-x", "bx-search");
  searchForm.classList.remove("show");
}

window.addEventListener("resize", function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");
  }
});

const switchMode = document.getElementById("switch-mode");
switchMode.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});

const userContainer = document.querySelector("#app-users");

const fetchUsers = async () => {
  try {
    console.log("fetching users");
    const res = await fetch(`${BACKEND_ROOT_URL}/api/gym/users`);
    const data = await res.json();
    document.querySelector("#users-count").innerText = data.length;

    data.map((u) => {
      userContainer.innerHTML += `
          	<tr>
									<td>${moment(u.createdAt).add(10, "days").calendar()}</td>
									<td>
										<p>${u.username}</p>
									</td>
									<td>${u.email}</td>

									<td>${u.contact || "-"}</td>
								</tr>
      `;
    });
  } catch (error) {
    console.log(error);
  }
};
const fetchEnrollments = async () => {
  const userContainer = document.querySelector("#app-enrollments");
  try {
    console.log("fetching users");
    const res = await fetch(`${BACKEND_ROOT_URL}/api/gym/enrollments`);
    const data = await res.json();
    document.querySelector("#enrollments-count").innerText = data.length;
    data.map((u) => {
      userContainer.innerHTML += `
    <tr>
    <td>${moment(u.createdAt).add(10, "days").calendar()}</td>
    <td>
        <p>${u.userId?.username}</p>
    </td>
    <td>${u.userId?.contact || "-"}</td>
    <td>${u.package?.name}</td>
    <td>
    <select class="status ${
      u.status
    }" onChange="handleEnrollStatusChange(event)" data-id="${u._id}">
    <option  value="REQUESTED" ${u.status === "REQUESTED" ? "selected" : ""}>
        <span class="status">REQUESTED</span>
    </option>
    <option value="REJECTED" ${u.status === "REJECTED" ? "selected" : ""}>
        <span class="status">REJECTED</span>
    </option>
    <option value="APPROVED" ${u.status === "APPROVED" ? "selected" : ""}>
        <span class="status">APPROVED</span>
    </option>
    <option value="APPROVED" ${u.status === "CANCELLED" ? "selected" : ""}>
        <span class="status">CANCELLED</span>
    </option>
</select>
    </td>
</tr>
      `;
    });
  } catch (error) {
    console.log(error);
  }
};

const handleEnrollStatusChange = async (e) => {
  const status = e.target.value;
  const id = e.target.getAttribute("data-id");
  try {
    const res = await fetch(`${BACKEND_ROOT_URL}/api/gym/enrollments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    });
  } catch (err) {}
};
const fetchPackages = async () => {
  try {
    console.log("fetching users");
    const res = await fetch(`${BACKEND_ROOT_URL}/api/packages`);
    const data = await res.json();
    if (res.status === 200) {
      document.querySelector("#admin-package-container").innerHTML = "";
      data.forEach((p) => {
        document.querySelector("#admin-package-container").innerHTML += `
          <div class="admin-package-box w-[250px] shadow-md rounded-lg flex items-start flex-col gap-y-4 p-3  "> 
                        <div>
                            <h1 class="text-2xl font-bold">${p.name}</h1>
                            <p class="text-slate-500">Rs.${p.price}</p>
                        </div>
                        <div>
                            <ul>
                            ${p.services
                              .map((s) => {
                                return ` <li class="text-slate-600">
                                  ${s}
                                </li>`;
                                return;
                              })
                              .join("")}
                           
                                
                            </ul>
                        </div>
                        <button  class="bg-red-500 h-[40px] text-white  rounded-md px-4 delete-package" data-id=${
                          p._id
                        } >DELETE</button>
        </div>`;
        document.querySelectorAll(".delete-package").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            handleDeletePackage(e);
          });
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleDeletePackage = (e) => {
  const packages_id = e.target.getAttribute("data-id");
  try {
    fetch(`${BACKEND_ROOT_URL}/api/packages/${packages_id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        fetchPackages();
      }
    });
  } catch (error) {
    console.log(error);
  }
};
fetchUsers();
fetchEnrollments();
fetchPackages();
