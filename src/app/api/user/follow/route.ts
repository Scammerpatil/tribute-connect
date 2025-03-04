import User from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, mainUser } = await req.json();

    if (!id || !mainUser) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find both users
    const userToFollow = await User.findById(id);
    const followingUser = await User.findById(mainUser);

    if (!userToFollow || !followingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Prevent duplicate follow
    if (!userToFollow.following.includes(mainUser)) {
      userToFollow.followers.push(mainUser);
      await userToFollow.save();
    }

    if (!followingUser.following.includes(id)) {
      followingUser.following.push(id);
      await followingUser.save();
    }

    return NextResponse.json({ message: "User followed successfully" });
  } catch (error) {
    console.error("Failed to follow user:", error);
    return NextResponse.json(
      { message: "Failed to follow user" },
      { status: 500 }
    );
  }
}
