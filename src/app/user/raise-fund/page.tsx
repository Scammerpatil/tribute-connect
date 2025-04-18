"use client";
import { useAuth } from "@/context/AuthProvider";
import { Tribute } from "@/types/Tribute";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import Script from "next/script";

const fundingOptions = [100, 200, 500, 1000, 5000];

const RaiseFundPage = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const id = searchParams.get("id");
  const [tribute, setTribute] = useState<Tribute | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | "">("");

  const fetchTribute = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`/api/tributes/get?id=${id}`);
      setTribute(res.data.tribute);
    } catch (error) {
      console.error("Failed to fetch tribute:", error);
    }
  };

  useEffect(() => {
    fetchTribute();
  }, [id]);

  const handleProceedToPayment = () => {
    if (!selectedAmount || selectedAmount === "") return;
    if (
      !window.confirm(
        `Are you sure you want to donate ₹${selectedAmount} to this tribute?`
      )
    )
      return;

    try {
      const res = axios.post(`/api/tributes/raise-fund`, {
        id,
        amount: selectedAmount,
        user,
      });
      toast.promise(res, {
        loading: "Processing payment...",
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
        error: "Failed to proceed to payment",
      });
    } catch (error) {
      console.error("Failed to proceed to payment:", error);
      toast.error("Failed to proceed to payment");
    }
  };

  return (
    <div className="p-4 mx-auto bg-base-200 rounded-xl shadow-md">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <h1 className="text-3xl font-bold text-center text-primary mb-4 uppercase">
        Raise Fund
      </h1>

      {tribute ? (
        <>
          <div className="flex flex-col items-center text-center">
            <Image
              src={tribute.image || "/avatar.png"}
              alt={tribute.name}
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
            <h2 className="text-2xl font-semibold text-base-content mt-4">
              {tribute.name}
            </h2>
            <p className="text-base-content/70 mt-2">{tribute.description}</p>
            <p className="text-sm text-base-content/50 mt-1">
              DOB: {new Date(tribute.dob).toLocaleDateString()} | DOD:{" "}
              {new Date(tribute.dod).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="funding"
              className="block text-lg font-medium text-base-content mb-2"
            >
              Select Amount to Donate:
            </label>
            <select
              id="funding"
              className="select select-bordered w-full"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
            >
              <option value="">-- Choose an amount --</option>
              {fundingOptions.map((amount) => (
                <option key={amount} value={amount}>
                  ₹{amount}
                </option>
              ))}
            </select>
          </div>

          {selectedAmount && (
            <div className="mt-6 text-center">
              <p className="text-lg text-success font-semibold mb-3">
                Selected Amount: ₹{selectedAmount}
              </p>
              <button
                className="btn btn-primary rounded-full"
                onClick={handleProceedToPayment}
              >
                Proceed to Donate
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-error mt-6">No tribute found.</p>
      )}
    </div>
  );
};

export default RaiseFundPage;
