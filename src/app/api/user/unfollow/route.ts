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
    const userToUnfollow = await User.findById(id);
    const unfollowingUser = await User.findById(mainUser);

    if (!userToUnfollow || !unfollowingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove mainUser from id's followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (userId: string) => userId.toString() !== mainUser
    );

    // Remove id from mainUser's following list
    unfollowingUser.following = unfollowingUser.following.filter(
      (userId: string) => userId.toString() !== id
    );

    // Save updates
    await userToUnfollow.save();
    await unfollowingUser.save();

    return NextResponse.json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error("Failed to unfollow user:", error);
    return NextResponse.json(
      { message: "Failed to unfollow user" },
      { status: 500 }
    );
  }
}
