import Payment from "@/model/Payment";
import Tribute from "@/model/Tribute.model";
import User from "@/model/User.model";
import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: NextRequest) {
  const { id, user, amount } = await req.json();
  if (!id || !user || !amount) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }
  try {
    const tribute = await Tribute.findById(id);
    if (!tribute) {
      return NextResponse.json(
        { message: "Tribute not found" },
        { status: 404 }
      );
    }
    var options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcp_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    if (!order) {
      return NextResponse.json(
        { message: "Order creation failed!" },
        { status: 500 }
      );
    }
    const existingUser = await User.findById(user._id);
    const payment = await Payment.create({
      userId: existingUser._id,
      amount,
      currency: "INR",
      reason: "donation",
      method: "razorpay",
      status: "success",
      transactionId: order.id,
    });
    payment.save();
    existingUser.payments.push(payment._id);
    await existingUser.save();
    tribute.funding.push({
      user: existingUser,
      amount,
      transactionId: order.id,
    });
    await tribute.save();

    return NextResponse.json(
      {
        message: "Payment successful",
        orderId: order.id,
        amount: order.amount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to proceed to payment:", error);
    return NextResponse.json(
      { message: "Failed to proceed to payment" },
      { status: 500 }
    );
  }
}
