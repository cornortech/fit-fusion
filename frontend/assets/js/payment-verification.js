let clientSecret = new URLSearchParams(window.location.search).get(
  "payment_intent_client_secret"
);
let package_id = new URLSearchParams(window.location.search).get("package_id");
if (!package_id) {
  alert("Failed to intitate payment . Package id not found. Please try again!");
}
if (!clientSecret) {
  alert("Failed to intitate payment . client secret not found. Please try again!");
}
const stripe = Stripe(
  "pk_test_51OOfAiCBSYxR411iCdN4WIRTrOavlsgy9WRuPasn50Fw5eRNuyXoeP7xgxqYIuBVIxe02LI8yxUbd6DnhC3AOlLy007dWcMWF6"
);
checkStatus();


async function checkStatus() {
  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  console.log("payment intent status: " + paymentIntent.status);

  switch (paymentIntent.status) {
    case "succeeded":
      checkIfOrderIsDone();
      break;
  }
}

async function checkIfOrderIsDone() {
  try {
    const { data, status } = await axios.get(
      `${BACKEND_ROOT_URL}/api/gym/enroll/status/${clientSecret}`
    );
    if (status === 200) {
      if (data.message === false) {
        handleCreateOrder();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const handleCreateOrder = async () => {
  const user = getLoggedInUser();

  if (!user) {
    alert("you must be logged in to purchase");
    return;
  }

  const orderPayload = {
    order_intent_secret: clientSecret,
    userId: user._id,
    package: package_id,
  };

  try {
    const { status } = await axios.post(
      `${BACKEND_ROOT_URL}/api/gym/enroll`,
      orderPayload
    );

    if (status === 201) {
      alert("successfully enrolled");
    }
  } catch (error) {
    console.log(error);
  }
};
