import Tribute from "@/model/Tribute.model";
import User from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { tribute } = await req.json();
  try {
    const user = await User.findById(tribute.user);
    const tributes = await Tribute.find({ user: tribute.user });
    if (!user.isPremiumHolder && tributes.length >= 3) {
      return NextResponse.json(
        {
          message:
            "You can only add up to 3 tributes. Upgrade to Premium for unlimited tributes!",
        },
        { status: 400 }
      );
    }
    await Tribute.create(tribute);
    return NextResponse.json(
      { message: "Tribute added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Add Tribute error:", error);
    return NextResponse.json(
      { message: "Failed to add tribute" },
      { status: 500 }
    );
  }
}
