"use client";

import { Tribute } from "@/types/Tribute";
import {
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
  IconTrash,
} from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageTributesPage = () => {
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

  const handleDelete = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this tribute?"))
        return;
      const res = axios.delete(`/api/tributes/delete?id=${id}`);
      toast.promise(res, {
        loading: "Deleting tribute...",
        success: "Tribute deleted successfully",
        error: "Failed to delete tribute",
      });
    } catch (error) {
      console.error("Failed to delete tribute:", error);
      toast.error("Failed to delete tribute");
    }
  };

  const totalPages = Math.ceil(tributes.length / tributesPerPage);
  return (
    <>
      <div className="container mx-auto">
        {tributes.length === 0 && (
          <p className="text-center text-error text-lg">
            No tributes available yet.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentTributes.map((tribute) => (
            <Link
              key={tribute._id}
              href={`/tribute/${tribute._id}`}
              className="bg-base-100 shadow-lg rounded-xl overflow-hidden border border-primary"
            >
              <div className="h-52 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={tribute.image || "/avatar.png"}
                  alt={tribute.name}
                />
              </div>

              <div className="p-5 flex flex-col justify-between">
                <h2 className="mb-2 text-xl font-semibold text-center text-secondary">
                  {tribute.name}
                </h2>
                <p className="mb-3 text-sm text-center text-base-content/70">
                  {tribute.description}
                </p>

                <div className="mt-4 flex justify-between items-center text-sm text-base-content/80 bg-base-200 p-3 rounded-lg">
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

                <div className="divider"></div>

                <button
                  className="btn btn-error btn-outline flex items-center gap-2"
                  onClick={() => handleDelete(tribute._id as string)}
                >
                  <IconTrash /> Delete
                </button>

                <div className="divider"></div>

                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img
                        src={
                          tribute.user.profileImage || "/user-placeholder.png"
                        }
                        alt={tribute.user.name}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">
                      {tribute.user.name}
                    </p>
                    <p className="text-xs text-base-content">
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
              className={`join-item btn btn-outline ${
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
              className={`join-item btn btn-outline ${
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

export default ManageTributesPage;
