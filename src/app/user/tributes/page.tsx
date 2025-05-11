"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Tribute } from "@/types/Tribute";
import axios from "axios";
import Link from "next/link";
import {
  IconBell,
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
  IconPin,
} from "@tabler/icons-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { User } from "@/types/user";

const TributesPage = () => {
  const { user } = useAuth();
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tributesPerPage = 8;

  const fetchTributes = async () => {
    try {
      const res = await axios.get("/api/tributes");
      const tributes = res.data.tributes.filter((t: Tribute) => {
        return t.user._id !== user?._id;
      });
      setTributes(tributes);
    } catch (error) {
      console.error("Failed to fetch tributes:", error);
    }
  };
  useEffect(() => {
    fetchTributes();
  }, []);

  const indexOfLastTribute = currentPage * tributesPerPage;
  const indexOfFirstTribute = indexOfLastTribute - tributesPerPage;
  const currentTributes = tributes.slice(
    indexOfFirstTribute,
    indexOfLastTribute
  );

  const totalPages = Math.ceil(tributes.length / tributesPerPage);

  const handleLike = async (id: string) => {
    try {
      await axios.post(`/api/tributes/like`, { id, user });
      toast.success("Tribute liked successfully");
      fetchTributes();
    } catch (error) {
      console.error("Failed to like tribute:", error);
      toast.error("Failed to like tribute");
    }
  };

  const handlePin = async (id: string) => {
    try {
      await axios.post(`/api/tributes/pin`, { id, user });
      toast.success("Tribute pinned successfully");
      fetchTributes();
    } catch (error) {
      console.error("Failed to pin tribute:", error);
      toast.error("Failed to pin tribute");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-base-content mb-4 uppercase text-center">
        Welcome to the Tributes Page!
      </h1>
      <div className="container mx-auto">
        {tributes.length === 0 && (
          <div>
            <img
              src="/404.png"
              alt="No tributes found"
              className="w-auto mx-auto h-96 "
            />
            <h2 className="text-2xl uppercase font-bold text-base-content text-center mt-4">
              No Tributes Found
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-4">
          {currentTributes.map((tribute) => (
            <div
              key={tribute._id}
              className="bg-base-200 shadow-lg rounded-xl overflow-hidden border border-base-content/20 hover:shadow-xl transition"
            >
              <Link href={`/user/learnmore?id=${tribute._id}`}>
                <div className="h-52 w-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={tribute.image || "/avatar.png"}
                    alt={tribute.name}
                  />
                </div>
              </Link>

              <div className="px-5 mt-2 flex flex-col justify-between">
                <h2 className="mb-2 text-xl font-semibold text-base-content text-center">
                  {tribute.name}
                </h2>
                <p className="text-sm text-center text-base-content/70">
                  {tribute.description.slice(0, 100)}...
                </p>
                <div className="mt-4 flex justify-between items-center text-sm text-base-content/80 bg-base-300 p-3 rounded-lg">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-primary">Born</span>
                    <span>{new Date(tribute.dob).toDateString()}</span>
                  </div>
                  <div className="text-lg font-bold text-error">✝</div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-primary">Passed</span>
                    <span>{new Date(tribute.dod).toDateString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    className={`btn btn-error ${
                      !tribute.likes?.includes(user?._id as unknown as User)
                        ? "btn-outline"
                        : "btn-error"
                    } flex items-center gap-2`}
                    onClick={() => {
                      if (tribute.likes?.includes(user?._id)) {
                        toast.error("Already liked");
                        return;
                      }
                      handleLike(tribute._id as string);
                    }}
                  >
                    <IconHeart />{" "}
                    {tribute.likes?.includes(user?._id)
                      ? "Liked"
                      : `${tribute.likes?.length} Likes`}
                  </button>
                  <Link
                    className="btn btn-success btn-outline"
                    href={`/user/raise-fund?id=${tribute._id}`}
                  >
                    Raise Fund
                  </Link>
                </div>
                {user?.isPremiumHolder && (
                  <button
                    className={`btn btn-warning mt-3 ${
                      !user?.pinnedTribute?.includes(tribute._id)
                        ? "btn-outline"
                        : "btn-warning"
                    } flex items-center gap-2`}
                    onClick={() => {
                      user?.pinnedTribute?.includes(
                        tribute._id! as unknown as Tribute
                      )
                        ? toast.error("Already pinned")
                        : handlePin(tribute._id as string);
                    }}
                  >
                    <IconPin />{" "}
                    {user?.pinnedTribute?.includes(
                      tribute._id! as unknown as Tribute
                    )
                      ? "Pinned"
                      : "Pin Tribute"}
                  </button>
                )}
                {user?.isPremiumHolder && (
                  <button
                    className={`btn btn-info mt-3 ${
                      !user?.pinnedTribute?.includes(
                        tribute._id as unknown as Tribute
                      )
                        ? "btn-outline"
                        : "btn-info"
                    } flex items-center gap-2`}
                    onClick={() => {
                      toast("Functionality coming soon...");
                    }}
                  >
                    <IconBell /> Set Reminder
                  </button>
                )}

                <div className="divider" />
                <p className="text-center font-semibold text-base-content">
                  Total Fund Raised: ₹
                  {tribute.funding?.reduce((acc, curr) => acc + curr.amount, 0)}
                </p>
                <div className="divider" />
                <div className="flex items-center pb-4 space-x-3">
                  <div className="avatar">
                    <Image
                      src={tribute.user.profileImage || "/default-avatar.png"}
                      alt={tribute.user.name}
                      className="rounded-full"
                      height={48}
                      width={48}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">
                      {tribute.user.name}
                    </p>
                    <p className="text-xs text-base-content/80">
                      {tribute.user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="join grid grid-cols-2 mt-8">
            <button
              className={`join-item btn btn-outline text-base-content ${
                currentPage === 1 ? "btn-disabled" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <IconChevronLeft /> Prev
            </button>
            <span className="mx-4 text-lg font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`join-item btn btn-outline text-base-content ${
                currentPage === totalPages ? "btn-disabled" : ""
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next <IconChevronRight />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default TributesPage;
