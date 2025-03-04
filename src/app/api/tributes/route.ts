import Tribute from "@/model/Tribute.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tributes = await Tribute.find().populate("user");
    return NextResponse.json({ tributes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
