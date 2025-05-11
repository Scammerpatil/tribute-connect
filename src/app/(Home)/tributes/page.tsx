"use client";

import { Tribute } from "@/types/Tribute";
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const Tributes = () => {
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

  return (
    <section className="bg-base-100 min-h-[calc(100vh-6rem)] py-10 px-10">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentTributes.map((tribute) => (
            <div
              key={tribute._id}
              className="card bg-base-300 shadow-xl border border-primary"
            >
              <Link href={`/tribute?id=${tribute._id}`}>
                <figure className="h-52 overflow-hidden">
                  <img
                    className="object-cover w-full h-full"
                    src={tribute.image || "/avatar.png"}
                    alt={tribute.name}
                  />
                </figure>
              </Link>
              <div className="card-body space-y-3">
                <h2 className="card-title text-secondary justify-center">
                  {tribute.name}
                </h2>
                <p className="text-center text-sm text-base-content/70">
                  {tribute.description.slice(0, 100)}...
                </p>

                <div className="flex justify-between bg-base-200 p-3 rounded-lg text-sm">
                  <div className="text-center text-base-content/80">
                    <span className="font-semibold text-primary">Born</span>
                    <br />
                    {new Date(tribute.dob).toDateString()}
                  </div>
                  <div className="text-lg text-error font-bold self-center">
                    ✝
                  </div>
                  <div className="text-center text-base-content/80">
                    <span className="font-semibold text-primary">Passed</span>
                    <br />
                    {new Date(tribute.dod).toDateString()}
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-center mt-2 text-base-content">
                  <p>
                    <span className="font-semibold">Likes:</span>{" "}
                    {tribute.likes?.length}
                  </p>
                  <p>
                    <span className="font-semibold">Total Fund Raised:</span> ₹
                    {tribute.funding?.reduce(
                      (acc, curr) => acc + curr.amount,
                      0
                    )}
                  </p>
                </div>
                <div className="flex gap-4 items-center justify-center mt-4">
                  <a
                    href={`https://twitter.com/intent/tweet?text=Remembering ${encodeURIComponent(
                      tribute.name
                    )}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-ghost text-primary"
                  >
                    <IconBrandTwitter size={20} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      window.location.href
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-ghost text-primary"
                  >
                    <IconBrandLinkedin size={20} />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      window.location.href
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-ghost text-primary"
                  >
                    <IconBrandFacebook size={20} />
                  </a>
                </div>
                {tribute.supportingDocument && (
                  <div className="text-sm text-center mt-4">
                    <span className="font-medium text-base-content">
                      Supporting Document:{" "}
                    </span>
                    <a
                      href={tribute.supportingDocument}
                      target="_blank"
                      className="text-primary underline break-words"
                    >
                      {tribute.supportingDocument.split("/").pop()}
                    </a>
                  </div>
                )}
              </div>
            </div>
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
    </section>
  );
};

export default Tributes;
