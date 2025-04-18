"use client";

import { Tribute } from "@/types/Tribute";
import { IconHeart, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const ManageTributesPage = () => {
  const [tributes, setTributes] = useState<Tribute[]>([]);

  useEffect(() => {
    const fetchTributes = async () => {
      const response = await axios.get("/api/tributes");
      setTributes(response.data.tributes);
    };
    fetchTributes();
  }, []);

  return (
    <>
      <h1 className="text-4xl uppercase font-bold text-center mb-8">
        Manage Tributes
      </h1>

      {tributes.length === 0 ? (
        <div className="text-center">
          <img
            src="/404.png"
            alt="No tributes found"
            className="mx-auto h-96"
          />
          <h2 className="text-2xl font-bold text-base-content mt-4">
            No Tributes Found
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tributes.map((tribute) => (
            <div
              key={tribute._id}
              className="card bg-base-100 shadow-xl border border-primary"
            >
              <figure className="h-52 overflow-hidden">
                <img
                  className="object-cover w-full h-full"
                  src={tribute.image || "/avatar.png"}
                  alt={tribute.name}
                />
              </figure>

              <div className="card-body space-y-3">
                <h2 className="card-title text-secondary justify-center">
                  {tribute.name}
                </h2>
                <p className="text-center text-sm text-base-content/70">
                  {tribute.description.slice(0, 100)}...
                </p>

                <div className="flex justify-between bg-base-200 p-3 rounded-lg text-sm">
                  <div className="text-center">
                    <span className="font-semibold text-primary">Born</span>
                    <br />
                    {new Date(tribute.dob).toDateString()}
                  </div>
                  <div className="text-lg text-error font-bold self-center">
                    ✝
                  </div>
                  <div className="text-center">
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

                {tribute.isAdminApproved ? (
                  <button className="btn btn-error btn-outline w-full flex items-center justify-center gap-2">
                    <IconTrash size={18} /> Delete Tribute
                  </button>
                ) : (
                  <p className="text-sm text-center text-warning font-medium mt-2">
                    ✨ Tribute is pending admin approval
                  </p>
                )}

                <div className="grid grid-cols-1 gap-2 mt-3">
                  <Link
                    href={`/user/learnmore?id=${tribute._id}`}
                    className="btn btn-primary btn-outline w-full"
                  >
                    View Tribute
                  </Link>
                  <Link
                    href={`/user/edit-tribute?id=${tribute._id}`}
                    className="btn btn-secondary btn-outline w-full flex items-center justify-center gap-2"
                  >
                    <IconHeart size={18} /> Edit Tribute
                  </Link>
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
      )}

      <div className="flex justify-center mt-10">
        <Link href="/user/add-tribute" className="btn btn-primary">
          Add New Tribute
        </Link>
      </div>
    </>
  );
};

export default ManageTributesPage;
