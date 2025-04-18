import Tribute from "@/model/Tribute.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const status = searchParams.get("status");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  try {
    await Tribute.updateOne({ _id: id }, { $set: { isAdminApproved: status } });
    return NextResponse.json(
      { message: "Tribute approved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving tribute:", error);
    return NextResponse.json(
      { error: "Failed to approve tribute" },
      { status: 500 }
    );
  }
}
