import Tribute from "@/model/Tribute.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { id, user } = await req.json();
  try {
    // Find tribute by id
    const tribute = await Tribute.findById(id);
    if (!tribute) {
      return NextResponse.json(
        { message: "Tribute not found" },
        { status: 404 }
      );
    }
    tribute.likes.push(user._id);
    await tribute.save();
    return NextResponse.json({ message: "Tribute liked successfully" });
  } catch (error) {
    console.error("Failed to like tribute:", error);
    return NextResponse.json(
      { message: "Failed to like tribute" },
      { status: 500 }
    );
  }
}
