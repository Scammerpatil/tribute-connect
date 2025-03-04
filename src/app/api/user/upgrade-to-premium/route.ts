import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/model/User.model";

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
    return NextResponse.json({ message: "User upgraded to premium!" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while processing the payment!" },
      { status: 500 }
    );
  }
}
