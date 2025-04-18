import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import jwt from "jsonwebtoken";
import User from "@/model/User.model";
import Payment from "@/model/Payment";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect("/login");
  const data = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  if (!data) return NextResponse.redirect("/login");
  try {
    const user = await User.findById(data.id);
    if (!user) return NextResponse.redirect("/login");
    user.isPremiumHolder = true;
    await user.save();

    var options = {
      amount: 999 * 100,
      currency: "INR",
      receipt: "rcp1",
    };
    const order = await razorpay.orders.create(options);
    if (!order)
      return NextResponse.json(
        { message: "Order creation failed!" },
        { status: 500 }
      );
    const payment = await Payment.create({
      userId: user._id,
      amount: 999,
      currency: "INR",
      reason: "premium",
      method: "razorpay",
      status: "success",
      transactionId: order.id,
    });
    payment.save();
    user.payments.push(payment._id);
    await user.save();
    return NextResponse.json(
      {
        message: "User upgraded to premium!",
        orderId: order.id,
        amount: order.amount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while processing the payment!" },
      { status: 500 }
    );
  }
}
