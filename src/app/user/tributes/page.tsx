"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Tribute } from "@/types/Tribute";
import axios from "axios";
import Link from "next/link";
import {
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
} from "@tabler/icons-react";
import Image from "next/image";
import toast from "react-hot-toast";

const TributesPage = () => {
  const { user } = useAuth();
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tributesPerPage = 8;

  const fetchTributes = async () => {
    try {
      const res = await axios.get("/api/tributes");
      setTributes(res.data.tributes);
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

  return (
    <>
      <h1 className="text-3xl font-bold text-base-content mb-4 uppercase text-center">
        Welcome to the Tributes Page!
      </h1>
      <p className="text-lg text-base-content/70 mt-2 text-center">
        View all the tributes you have posted.
      </p>
      <div className="container mx-auto">
        {tributes.length === 0 && (
          <p className="text-center text-error-content text-lg">
            No tributes available yet.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-4">
          {currentTributes.map((tribute) => (
            <Link
              key={tribute._id}
              href={`/user/learnmore?id=${tribute._id}`}
              className="bg-base-200 shadow-lg rounded-xl overflow-hidden border border-base-content/20 hover:shadow-xl transition"
            >
              <div className="h-52 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={tribute.image || "/avatar.png"}
                  alt={tribute.name}
                />
              </div>

              <div className="px-5 mt-2 flex flex-col justify-between">
                <h2 className="mb-2 text-xl font-semibold text-base-content text-center">
                  {tribute.name}
                </h2>
                <p className="text-sm text-center text-base-content/70">
                  {tribute.description}
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
                      !tribute.likes?.includes(user?._id)
                        ? "btn-outline"
                        : "btn-error "
                    } flex items-center gap-2`}
                    onClick={() => {
                      handleLike(tribute._id as string);
                    }}
                  >
                    <IconHeart /> Like
                  </button>
                  <Link
                    className="btn btn-success btn-outline"
                    href={`/user/raise-fund?id=${tribute._id}`}
                  >
                    Raise Fund
                  </Link>
                </div>
                <p className="text-center mt-2 font-semibold text-base-content">
                  Total Fund Raised: ₹
                  {tribute.funding?.reduce((acc, curr) => acc + curr.amount, 0)}
                </p>
                <hr className="mt-3" />
                <div className="flex items-center py-4 space-x-3">
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
            </Link>
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
