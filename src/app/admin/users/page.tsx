"use client";
import { User } from "@/types/User";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IconCheck, IconTrash } from "@tabler/icons-react";

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/user");
      console.log(response.data.user);
      setUsers(response.data.user);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (user: User) => {
    const updatedUser = { ...user, isApproved: true };
    try {
      const response = axios.patch(`/api/user/approve`, {
        updatedUser,
      });
      toast.promise(response, {
        loading: "Approving user...",
        success: () => {
          fetchUsers();
          return "User approved successfully";
        },
        error: "Error approving user",
      });
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = axios.delete(`/api/users/delete?id=${userId}`);
      toast.promise(res, {
        loading: "Deleting user...",
        success: () => {
          fetchUsers();
          return "User deleted successfully";
        },
        error: "Error deleting user",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <h1 className="text-4xl uppercase font-bold text-center mb-6">
        Manage Users
      </h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead className="text-base-content bg-base-200 text-base">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-base-content text-sm font-medium">
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-base-content hover:bg-base-300 transition"
                >
                  <td className="text-center">{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={user.profileImage} alt={user.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold capitalize">{user.name}</div>
                        <div className="text-sm opacity-50">
                          {user.isPremiumHolder
                            ? "Perimum User"
                            : "Normal User"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-primary hover:underline"
                    >
                      {user.email}
                    </a>
                  </td>
                  <td>
                    <a href={`callto:${user.phone}`} className="text-primary">
                      {user.phone}
                    </a>
                  </td>
                  <td className="text-center">
                    <span
                      className={`py-1 px-3 rounded ${
                        user.isApproved
                          ? "badge badge-success"
                          : "badge badge-warning"
                      }`}
                    >
                      {user.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center space-x-3">
                    {!user.isApproved && (
                      <button
                        onClick={() => handleApprove(user)}
                        className="btn btn-success"
                      >
                        <IconCheck size={16} /> Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user._id!)}
                      className="btn btn-error"
                    >
                      <IconTrash size={16} /> Delete
                    </button>
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

export default UserPage;
