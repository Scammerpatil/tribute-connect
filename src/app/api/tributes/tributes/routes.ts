import dbConfig from "@/middlewares/db.config";
import Tribute from "@/model/Tribute.model";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    throw new Error("Token is missing");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
  const data = { id: decoded.id as string };
  try {
    const tributes = await Tribute.find({ user: data.id }).populate("user");
    return NextResponse.json({ tributes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
