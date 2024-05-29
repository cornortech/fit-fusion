const packagesContainer = document.querySelector("#packages-container");
let package_id = null;
let current_plan = null;
let enroll_id = null;
let status = null;

const DietPlanData = [
  {
    title: "Diet Plan for Children (0-5 years)",
    age_group: {
      above: 0,
      under: 5,
    },
    diet: [
      {
        breakfast: "Mashed bananas with milk",
        morning_snack: "Apple slices",
        lunch: "Pureed vegetables with rice",
        afternoon_snack: "Yogurt",
        dinner: "Soft cooked vegetables with mashed potatoes",
      },
    ],
  },
  {
    title: "Diet Plan for Kids (6-12 years)",
    age_group: {
      above: 6,
      under: 12,
    },
    diet: [
      {
        breakfast: "Oatmeal with fruits",
        morning_snack: "Carrot sticks with hummus",
        lunch: "Grilled chicken with vegetables",
        afternoon_snack: "Cheese cubes",
        dinner: "Fish with quinoa and steamed broccoli",
      },
    ],
  },
  {
    title: "Teen Diet Plan (13-18 years)",
    age_group: {
      above: 13,
      under: 18,
    },
    diet: [
      {
        breakfast: "Whole grain toast with avocado and eggs",
        morning_snack: "Greek yogurt with berries",
        lunch: "Turkey sandwich with whole wheat bread and salad",
        afternoon_snack: "Mixed nuts",
        dinner: "Lean beef with sweet potatoes and green beans",
      },
    ],
  },
  {
    title: "Young Adult Diet Plan (19-30 years)",
    age_group: {
      above: 19,
      under: 30,
    },
    diet: [
      {
        breakfast: "Smoothie with spinach, banana, and protein powder",
        morning_snack: "Whole grain crackers with hummus",
        lunch: "Salmon with quinoa and roasted vegetables",
        afternoon_snack: "Cottage cheese with pineapple",
        dinner: "Grilled tofu with brown rice and stir-fried vegetables",
      },
    ],
  },
  {
    title: "Adult Diet Plan (31-50 years)",
    age_group: {
      above: 31,
      under: 50,
    },
    diet: [
      {
        breakfast: "Greek yogurt with granola and berries",
        morning_snack: "Celery sticks with almond butter",
        lunch: "Spinach salad with grilled chicken and avocado",
        afternoon_snack: "Trail mix",
        dinner: "Baked salmon with quinoa and roasted Brussels sprouts",
      },
    ],
  },
  {
    title: "Senior Diet Plan (51+ years)",
    age_group: {
      above: 51,
      under: 200,
    },
    diet: [
      {
        breakfast: "Whole grain cereal with skim milk and sliced banana",
        morning_snack: "Cottage cheese with peaches",
        lunch: "Grilled shrimp salad with mixed greens",
        afternoon_snack: "Yogurt with almonds",
        dinner: "Baked chicken with sweet potato and steamed asparagus",
      },
    ],
  },
];


const handleMountPurchaseButton = async () => {
  var modal = document.getElementById("myModal");
  var btns = document.querySelectorAll(".select-plan-btn");
  var span = document.getElementsByClassName("close")[0];
  var cancelBtn = document.getElementById("cancelBtn");

  btns.forEach((btn) => {
    btn.addEventListener("click", function () {
      package_id = btn.id;
      console.log("the package ", package_id);
      // console.log("clicking", btn.id);
      modal.style.display = "block";
      if (enroll_id) {
        document.querySelector(".confirm-text").innerText =
          "Are you sure you want to cancel your plan?";
      }
    });
  });

  // btn.onclick = function () {
  //   modal.style.display = "block";
  // };

  span.onclick = function () {
    modal.style.display = "none";
  };

  cancelBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
};
const handleCloseModal = () => {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
};
focus;
document.getElementById("confirmBtn").addEventListener("click", function () {
  if (current_plan) {
    handleCancelPlan(handleCloseModal);
  } else {
    handlePurchasePlan(handleCloseModal);
  }
});

const handlePurchasePlan = async (cb) => {
  const planId = package_id;
  const user = getLoggedInUser();
  if (!user) {
    // alert("you must be logged in");
    showToast("Please login to purchase plan", "error");
  }
  location.href="/frontend/admin/payment.html?package_id="+planId;
};
const handleCancelPlan = async (cb) => {
  const planId = package_id;
  const user = getLoggedInUser();
  if (!user) {
    showToast("Please login to purchase plan", "error");
  }
  try {
    const enrollPayload = {
      enrollId: enroll_id,
    };
    res = await fetch(`${BACKEND_ROOT_URL}/api/gym/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enrollPayload),
    });

    if (res.status === 200) {
      current_plan = "";
      showToast("Plan cancelled successfully");
      cb();
      getPackageStatus();
    }
  } catch (error) {
    console.log(error);
  }
};
const handleFetchPackage = () => {
  try {
    fetch(`${BACKEND_ROOT_URL}/api/packages`)
      .then((res) => res.json())
      .then((data) => {
        packagesContainer.innerHTML = "";
        data.forEach((p) => {
          console.log(p.name, current_plan);
          const selectedPlan = p.name === current_plan;
          const blurPlan = current_plan
            ? current_plan === p.name
              ? false
              : true
            : false;
          packagesContainer.innerHTML += `
      	<div class="pricing-card" style="${blurPlan ? "opacity:0.5" : ""}">
			    <div class="pricing-card-header">
				  <span class="pricing-card-title">${p.name}</span>
				  <div class="price-circle">
					<span class="price"><i>$</i>${p.price}</span>
					<span class="desc">/ Month</span>
				</div>
			</div>
			<div class="pricing-card-body">
				<ul>
				${p.services
          .map((s) => {
            return `	<li><i class="fa-solid fa-check"></i>${s}</li>`;
          })
          .join("")}
				</ul>
				<button  id=${p._id} class="btn price-plan-btn select-plan-btn ${
            selectedPlan && "selected-plan-button"
          }">${
            current_plan
              ? current_plan === p.name
                ? "selected | REQEUSTED"
                : ""
              : "Select Plan"
          }</button>
			</div>
		</div>
      `;
          handleMountPurchaseButton(current_plan);
        });
      });
  } catch (error) {
    console.log(error);
  }
};

const getPackageStatus = async () => {
  try {
    const user = getLoggedInUser();
    if (user) {
      const res = await fetch(
        `${BACKEND_ROOT_URL}/api/gym/user/status/${user._id}`
      );
      const data = await res.json();
      if (res.status === 200) {
        current_plan = data.package;
        enroll_id = data.enrollId;
        status = data.status;
        handleFetchPackage();
      } else {
        current_plan = null;
        throw new Error("User not enrolled");
      }
    } else {
      throw new Error("User not logged in");
    }
  } catch (error) {
    handleFetchPackage();
    console.log("eror while fetching package status", error);
  }
};

const dietLogoMap = {
  breakfast:
    "https://img.icons8.com/external-wanicon-flat-wanicon/64/external-breakfast-hotel-wanicon-flat-wanicon.png",
  morning_snack: "https://img.icons8.com/external-flat-icons-vectorslab/68/external-Snack-christmas-flat-icons-vectorslab.png",
  lunch: "https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/external-lunch-food-levitation-icongeek26-linear-colour-icongeek26.png",
  afternoon_snack:"https://img.icons8.com/arcade/64/tapas.png",
  dinner:"https://img.icons8.com/external-justicon-lineal-color-justicon/64/external-dinner-romantic-love-justicon-lineal-color-justicon.png"
};

const fillDietOptions = () => {
  DietPlanData.forEach((p) => {
    document.querySelector("#diet-plan-select").innerHTML += `
      <option value="${p.title}">${p.title}</option>
    `;
  
  });
    document
      .querySelector("#diet-plan-select")
      .addEventListener("change", (e) => {
        const dietPlanTitle = e.target.value;
        const plan = DietPlanData.find((p) => p.title === dietPlanTitle);
        document.querySelector("#diet-plan-title").innerText = plan.title;
        document.querySelector("#diet-plan-list").innerHTML = "";
        Object.keys(
            plan.diet[0]
          ).map((key) => {
            document.querySelector("#diet-plan-list").innerHTML += `
           <li class="text-[18px] text-black flex flex-col gap-y-4">
           
              <div class="flex gap-x-5 items-center border border-[##ded3d34a] h-[80px] rounded-md px-3 cursor-pointer" >
              <div class="flex flex gap-x-2 items-center">
            <img width="44" height="44" src=${dietLogoMap[key]} alt="external-breakfast-hotel-wanicon-flat-wanicon"/>
             <p class="text-[19px] capitalize font-bold tracking-wide ">${key}</p> 
              </div>  
                 <p class="text-slate-700 tracking-wider">${plan.diet[0][key]}</p>
              </div>
            </li>
        `;
          });
      });
};
fillDietOptions();
getPackageStatus();
