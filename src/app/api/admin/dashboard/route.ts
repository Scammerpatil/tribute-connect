import Tribute from "@/model/Tribute.model";
import User from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const users = await User.find({});
    const tributes = await Tribute.find({});

    const totalUsers = users.length;
    const totalTributes = tributes.length;
    const pendingApprovals = users.filter((t) => !t.isApproved).length;
    let totalFund = 0;
    const monthlyFunding = {};
    const monthlyUsers = {};

    tributes.forEach((t) => {
      t.funding.forEach((f) => {
        const m = new Date(f.date).toLocaleString("default", {
          month: "short",
        });
        monthlyFunding[m] = (monthlyFunding[m] || 0) + f.amount;
        totalFund += f.amount;
      });
    });

    users.forEach((u) => {
      const m = new Date(u.createdAt).toLocaleString("default", {
        month: "short",
      });
      monthlyUsers[m] = (monthlyUsers[m] || 0) + 1;
    });

    const fundMonthly = Object.entries(monthlyFunding).map(
      ([month, amount]) => ({
        month,
        amount,
      })
    );
    const userMonthly = Object.entries(monthlyUsers).map(([month, users]) => ({
      month,
      users,
    }));

    const userFunds = {};
    tributes.forEach((t) => {
      const uid = t.user?.toString();
      if (!userFunds[uid]) userFunds[uid] = 0;
      t.funding.forEach((f) => (userFunds[uid] += f.amount));
    });

    const topUsers = Object.entries(userFunds)
      .map(([id, totalFund]) => {
        const u = users.find((u) => u._id.toString() === id);
        return { name: u?.name || "Unknown", totalFund };
      })
      .sort((a, b) => b.totalFund - a.totalFund)
      .slice(0, 5);

    return NextResponse.json(
      {
        totalUsers,
        totalTributes,
        pendingApprovals,
        totalFund,
        fundMonthly,
        userMonthly,
        topUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
