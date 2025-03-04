import Tribute from "@/model/Tribute.model";
import User from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await User.countDocuments();
    const tributes = await Tribute.countDocuments();
    const funds = await Tribute.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    return NextResponse.json({
      users: user,
      tributes,
      funds: funds[0]?.total || 0,
    });
  } catch (error) {
    console.log("Failed to fetch tributes:", error);
    return NextResponse.json(
      { message: "Failed to fetch tributes" },
      { status: 500 }
    );
  }
}
