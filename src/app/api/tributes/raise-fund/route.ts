import Tribute from "@/model/Tribute.model";
import User from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

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
    tribute.funding.push({ user, amount });
    await tribute.save();
    return NextResponse.json({ message: "Payment successful" });
  } catch (error) {
    console.log("Failed to proceed to payment:", error);
    return NextResponse.json(
      { message: "Failed to proceed to payment" },
      { status: 500 }
    );
  }
}
