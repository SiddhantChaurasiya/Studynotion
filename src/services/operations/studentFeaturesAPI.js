import { toast } from "react-hot-toast"

import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { resetCart } from "../../slices/cartSlice"
import { setPaymentLoading } from "../../slices/courseSlice"
import { apiConnector } from "../apiConnector"
import { studentEndpoints } from "../apis"

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints

// 🔥 Load Razorpay SDK
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// 🔥 Buy Course
export async function BuyCourse(
  token,
  courses,
  user_details,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...")

  try {
    // ✅ DEBUG: Check key
    console.log("RAZORPAY KEY:", process.env.REACT_APP_RAZORPAY_KEY)

    // Load Razorpay SDK
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!res) {
      toast.error("Razorpay SDK failed to load.")
      return
    }

    // Create Order (Backend)
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }

    console.log("ORDER RESPONSE:", orderResponse.data)

    // 🔥 Razorpay Options
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY, // ✅ FIXED
      currency: orderResponse.data.data.currency,
      amount: orderResponse.data.data.amount, // ✅ FIXED (number)
      order_id: orderResponse.data.data.id,

      name: "StudyNotion",
      description: "Thank you for Purchasing the Course.",
      image: rzpLogo,

      // ✅ Force card payment (avoid UPI errors in test mode)
      method: {
        card: true,
        upi: false,
        netbanking: false,
        wallet: false,
      },

      prefill: {
        name: `${user_details.firstName} ${user_details.lastName}`,
        email: user_details.email,
      },

      handler: function (response) {
        console.log("PAYMENT SUCCESS:", response)

        sendPaymentSuccessEmail(
          response,
          orderResponse.data.data.amount,
          token
        )

        verifyPayment(
          { ...response, courses },
          token,
          navigate,
          dispatch
        )
      },

      theme: {
        color: "#FACC15",
      },
    }

    const paymentObject = new window.Razorpay(options)

    paymentObject.open()

    paymentObject.on("payment.failed", function (response) {
      console.log("PAYMENT FAILED:", response.error)
      toast.error("Payment Failed ❌")
    })
  } catch (error) {
    console.log("PAYMENT ERROR:", error)
    toast.error("Could not initiate payment.")
  }

  toast.dismiss(toastId)
}

// 🔥 Verify Payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...")
  dispatch(setPaymentLoading(true))

  try {
    const response = await apiConnector(
      "POST",
      COURSE_VERIFY_API,
      bodyData,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    console.log("VERIFY PAYMENT RESPONSE:", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Payment Successful 🎉")
    navigate("/dashboard/enrolled-courses")
    dispatch(resetCart())
  } catch (error) {
    console.log("VERIFY ERROR:", error)
    toast.error("Payment verification failed.")
  }

  toast.dismiss(toastId)
  dispatch(setPaymentLoading(false))
}

// 🔥 Send Success Email
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
  } catch (error) {
    console.log("EMAIL ERROR:", error)
  }

  console.log("KEY:", process.env.REACT_APP_RAZORPAY_KEY);
}