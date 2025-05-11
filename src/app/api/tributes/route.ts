import dbConfig from "@/middlewares/db.config";
import Tribute from "@/model/Tribute.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
dbConfig();
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    const tributes = await Tribute.find({ isAdminApproved: true }).populate(
      "user"
    );
    return NextResponse.json({ tributes }, { status: 200 });
  }
  try {
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!);
    if (decoded.role === "admin") {
      const tributes = await Tribute.find({}).populate("user");
      return NextResponse.json({ tributes }, { status: 200 });
    }
    const tributes = await Tribute.find({ isAdminApproved: true }).populate(
      "user"
    );
    return NextResponse.json({ tributes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
