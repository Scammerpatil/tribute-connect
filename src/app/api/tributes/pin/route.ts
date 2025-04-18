import Tribute from "@/model/Tribute.model";
import User from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { id, user } = await req.json();
  try {
    const tribute = await Tribute.findOne({ _id: id });
    if (!tribute) {
      return NextResponse.json(
        { message: "Tribute not found" },
        { status: 404 }
      );
    }
    const exisitingUser = await User.findOne({ _id: user });
    if (!exisitingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    exisitingUser.pinnedTribute.push(tribute._id);
    await exisitingUser.save();
    return NextResponse.json(
      { message: "Tribute pinned successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Something went wrong!!", error);
    return NextResponse.json(
      { message: "Something went wrong!!!" },
      { status: 500 }
    );
  }
}
