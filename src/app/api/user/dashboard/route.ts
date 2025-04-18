import Tribute from "@/model/Tribute.model";
import User from "@/model/User.model";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  try {
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    if (!data)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tributes = await Tribute.find({ user: data.id });

    const user = await User.findById(data.id);
    const totalLikesGiven = await Tribute.countDocuments({ likes: data.id });

    const totalFundRaised = tributes.reduce(
      (sum, t) => sum + t.funding.reduce((a, b) => a + b.amount, 0),
      0
    );

    const fundingData = {};
    tributes.forEach((t) => {
      t.funding.forEach((f) => {
        const month = new Date(f.date).toLocaleString("default", {
          month: "short",
        });
        fundingData[month] = (fundingData[month] || 0) + f.amount;
      });
    });
    const fundingChart = Object.entries(fundingData).map(([month, amount]) => ({
      month,
      amount,
    }));

    const topLiked = tributes
      .map((t) => ({ name: t.name, likes: t.likes.length }))
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5);
    return NextResponse.json(
      {
        totalLikesGiven,
        totalFundRaised,
        totalTributes: tributes.length,
        fundingData: fundingChart,
        topLiked,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
