"use client";
import { useAuth } from "@/context/AuthProvider";
import { Tribute } from "@/types/Tribute";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const fundingOptions = [100, 200, 500, 1000, 5000];

const RaiseFundPage = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const id = searchParams.get("id");
  const [tribute, setTribute] = useState<Tribute | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

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

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
  };

  const handleProceedToPayment = () => {
    if (!selectedAmount) return;
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
        success: "Payment successful!",
        error: "Failed to proceed to payment",
      });
    } catch (error) {
      console.error("Failed to proceed to payment:", error);
      toast.error("Failed to proceed to payment");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center uppercase">
        Raise Fund Page
      </h1>
      {tribute ? (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{tribute.name}</h2>
          <p className="text-base-content/60 mt-3">{tribute.description}</p>
          <img
            src={tribute.image}
            alt={tribute.name}
            className="w-64 h-64 rounded-lg mt-4 mx-auto"
          />
          <p className="text-base-content/50 mt-2">
            DOB: {new Date(tribute.dob).toLocaleDateString()} | DOD:{" "}
            {new Date(tribute.dod).toLocaleDateString()}
          </p>

          <h3 className="text-lg font-semibold mt-6">Select Funding Amount:</h3>
          <div className="flex gap-4 mt-2">
            {fundingOptions.map((amount) => (
              <button
                key={amount}
                className={`btn rounded-lg font-bold ${
                  selectedAmount === amount
                    ? "btn-success text-success-content"
                    : "btn-primary text-primary-content"
                }`}
                onClick={() => handleSelectAmount(amount)}
              >
                ₹{amount}
              </button>
            ))}
          </div>

          {selectedAmount && (
            <div className="mt-4">
              <p className="text-lg font-medium text-center">
                Selected Amount:{" "}
                <span className="text-success">₹{selectedAmount}</span>
              </p>
              <button
                className="btn btn-error font-bold rounded-lg mx-auto"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>No tribute found.</p>
      )}
    </>
  );
};

export default RaiseFundPage;
