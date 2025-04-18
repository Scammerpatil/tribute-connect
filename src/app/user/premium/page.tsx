"use client";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import Script from "next/script";
import { useState } from "react";
import toast from "react-hot-toast";

const premiumPlan = {
  name: "Tribute Connect Premium",
  price: 999,
  benefits: [
    "Create Unlimited Tributes",
    "Priority Support",
    "Exclusive Badge",
    "Early Access to New Features",
  ],
};

const Premium = () => {
  const [selected, setSelected] = useState<boolean>(false);
  const { user } = useAuth();

  const handleProceedToPayment = () => {
    setSelected(true);
    if (!window.confirm("Are you sure you want to proceed to payment?")) return;
    try {
      const res = axios.get("/api/user/upgrade-to-premium");
      toast.promise(res, {
        loading: "Processing Payment...",
        success: (res) => {
          const options = {
            key: "rzp_test_cXJvckaWoN0JQx",
            amount: res.data.amount,
            currency: "INR",
            name: "Tribute Connect",
            description: "Test Transaction",
            image: "/bg.png",
            order_id: res.data.orderId,
            handler: () => {
              toast.success("Payment Successful!");
            },
            prefill: {
              name: user?.name,
              email: user?.email,
              contact: user?.phone,
            },
          };
          const razorpay = new window.Razorpay(options);
          razorpay.on("payment.failed", function (response: any) {
            alert(response.error.description);
          });
          razorpay.open();
          return res.data.message;
        },
        error: "An error occurred while processing the payment!",
      });
      setSelected(false);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while processing the payment!");
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <h1 className="text-4xl font-bold text-center uppercase">Get Premium</h1>

      {user?.isPremiumHolder && (
        <div className="alert alert-success shadow-lg mt-6 max-w-md mx-auto">
          <div>
            <span>You are already a Premium User!</span>
          </div>
        </div>
      )}

      <div className="mt-6 p-6 border rounded-lg shadow-lg bg-base-300 max-w-md mx-auto">
        <h2 className="text-xl font-semibold">{premiumPlan.name}</h2>
        <p className="text-base-content mt-2 font-bold text-4xl">
          ₹{premiumPlan.price} / Year{" "}
          <del className="text-xl">₹{premiumPlan.price + 200} / Year</del>
        </p>

        <ul className="mt-4 space-y-2 text-base-content/80">
          {premiumPlan.benefits.map((benefit, index) => (
            <li key={index} className="flex items-center">
              ✅ {benefit}
            </li>
          ))}
        </ul>

        <button
          className={`btn font-bold rounded-lg mt-5 w-full ${
            selected ? "btn-success" : "btn-primary"
          }`}
          onClick={handleProceedToPayment}
          disabled={user?.isPremiumHolder || selected}
        >
          {selected ? "Processing..." : "Get Premium"}
        </button>
      </div>
    </>
  );
};

export default Premium;
