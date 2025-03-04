"use client";
import { User } from "@/types/user";
import { IconCrown } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const UserProilePage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [user, setUser] = useState<User | null>(null);
  const fetchUser = async () => {
    try {
      const res = await axios.post(`/api/user/getUser`, { userId });
      setUser(res.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center mx-h-[calc(100vw-6rem)]">
      <div className="bg-base-300 shadow-lg rounded-xl p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-primary mb-6 uppercase">
          User Profile
        </h1>

        {/* Profile Image */}
        <div className="relative mx-auto w-32 h-32">
          <img
            src={user?.profileImage || "/avatar.png"}
            alt="Profile Pic"
            className="rounded-full w-full h-full object-cover border-4 border-primary shadow-md"
          />
        </div>

        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold text-primary">{user?.name}</h2>
          <p className="text-base text-base-content/80">{user?.email}</p>
          <p className="text-base text-base-content/80">{user?.phone}</p>
        </div>

        <div className="mt-4 flex justify-center gap-6 text-base-content/80">
          <Link className="text-center" href="/user/followers">
            <p className="text-lg font-bold">{user?.followers.length || 0}</p>
            <p className="text-sm">Followers</p>
          </Link>
          <Link className="text-center" href="/user/following">
            <p className="text-lg font-bold">{user?.following.length || 0}</p>
            <p className="text-sm">Following</p>
          </Link>
        </div>
        {user?.isPremiumHolder && (
          <Link
            className="mt-4 w-full btn text-lg font-bold text-base-content rounded-lg bg-gradient-to-r from-secondary to-accent hover:scale-105 transition shadow-md"
            href="/user/premium"
          >
            <IconCrown size={20} />
            Premium User
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserProilePage;
