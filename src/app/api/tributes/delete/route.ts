import Tribute from "@/model/Tribute.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "id query param is required" },
      { status: 400 }
    );
  }
  try {
    await Tribute.findByIdAndDelete(id);
    return NextResponse.json({ message: "Tribute deleted successfully" });
  } catch (error) {
    console.log("Failed to delete tribute:", error);
    return NextResponse.json(
      { message: "Failed to delete tribute" },
      { status: 500 }
    );
  }
}
