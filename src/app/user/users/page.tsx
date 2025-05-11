"use client";
import { useAuth } from "@/context/AuthProvider";
import { User } from "@/types/user";
import { IconEye, IconUser, IconUserOff } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/user");
      const users = res.data.user.filter(
        (u: User) => u._id !== user?._id || !u.isApproved
      );
      setUsers(users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const followUser = async (id: string) => {
    try {
      await axios.post("/api/user/follow", { id, mainUser: user });
      toast.success("User followed successfully");
      fetchUsers();
    } catch (error) {
      console.error("Failed to follow user:", error);
      toast.error("Failed to follow user");
    }
  };
  const unFollowUser = async (id: string) => {
    try {
      await axios.post("/api/user/unfollow", { id, mainUser: user });
      toast.success("User followed successfully");
      fetchUsers();
    } catch (error) {
      console.error("Failed to follow user:", error);
      toast.error("Failed to follow user");
    }
  };
  return (
    <>
      <h1 className="text-3xl font-bold text-base-content mb-4 uppercase text-center">
        Welcome to the Users Page!
      </h1>

      <div className="overflow-x-auto bg-base-300 rounded-lg shadow-lg">
        <table className="table table-zebra">
          {/* Table Head */}
          <thead className="text-base-content bg-base-200 text-base ">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Follow</th>
              <th>Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-base-content text-sm font-medium">
            {users.length > 0 ? (
              users.map((u, index) => (
                <tr
                  key={u._id}
                  className="border-b border-base-content hover:bg-base-300 transition"
                >
                  <td className="text-center">{index + 1}</td>
                  <td className="text-semibold">{u.name}</td>
                  <td>
                    <a
                      href={`mailto:${u.email}`}
                      className="text-primary hover:underline"
                    >
                      {u.email}
                    </a>
                  </td>
                  <td>
                    <a href={`callto:${u.phone}`} className="text-primary">
                      {u.phone}
                    </a>
                  </td>
                  <td>
                    {user?.following.includes(u._id) ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => unFollowUser(u._id)}
                      >
                        Unfollow <IconUserOff size={20} />
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => followUser(u._id)}
                      >
                        Follow <IconUser size={20} />
                      </button>
                    )}
                  </td>
                  <td className="">
                    {/* Actions */}
                    <Link
                      className="btn btn-sm btn-error"
                      href={`/user/user?id=${u._id}`}
                    >
                      View Details <IconEye size={20} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center py-6 text-base-content/50">
                <td colSpan={6} className="py-3">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Users;
