import Tribute from "@/model/Tribute.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { tributeId, comment, user } = await req.json();
  if (!tributeId || !comment || !user) {
    return NextResponse.json(
      { message: "Tribute ID, comment, and user are required" },
      { status: 400 }
    );
  }
  try {
    const tribute = await Tribute.findById(tributeId);
    if (!tribute) {
      return NextResponse.json(
        { message: "Tribute not found" },
        { status: 404 }
      );
    }
    tribute.comments.push({ comment, user });
    await tribute.save();
    return NextResponse.json({ tribute });
  } catch (error) {
    console.error("Failed to add comment:", error);
    return NextResponse.json(
      { message: "Failed to add comment" },
      { status: 500 }
    );
  }
}
