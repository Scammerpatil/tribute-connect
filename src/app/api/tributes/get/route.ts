import Tribute from "@/model/Tribute.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const serachParams = req.nextUrl.searchParams;
  const id = serachParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Id is required" }, { status: 400 });
  }
  try {
    const tribute = await Tribute.findById(id)
      .populate("user")
      .populate("comments.user");
    if (!tribute) {
      return NextResponse.json(
        { message: "Tribute not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ tribute });
  } catch (error) {
    console.error("Failed to fetch tribute:", error);
    44;
    return NextResponse.json(
      { message: "Failed to fetch tribute" },
      { status: 500 }
    );
  }
}
