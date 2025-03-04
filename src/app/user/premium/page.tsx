"use client";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const premiumPlan = {
  name: "TributeConnect Premium",
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

  const handleProceedToPayment = () => {
    setSelected(true);
    if (!window.confirm("Are you sure you want to proceed to payment?")) return;
    try {
      const res = axios.get("/api/user/upgrade-to-premium");
      toast.promise(res, {
        loading: "Processing Payment...",
        success: (data) => {
          return data.data.message;
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
      <h1 className="text-4xl font-bold text-center uppercase">Get Premium</h1>

      <div className="mt-6 p-6 border rounded-lg shadow-lg bg-base-300 max-w-md">
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
          className={`btn font-bold rounded-lg mt-5 ${
            selected ? "btn-success" : "btn-primary"
          }`}
          onClick={handleProceedToPayment}
        >
          {selected ? "Processing..." : "Get Premium"}
        </button>
      </div>
    </>
  );
};

export default Premium;
