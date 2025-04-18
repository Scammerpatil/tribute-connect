"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { IconHeart, IconMessageCircle } from "@tabler/icons-react";
import { Tribute } from "@/types/Tribute";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";

const LearnMore = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [tribute, setTribute] = useState<Tribute>();
  const [comment, setComment] = useState("");

  const fetchTribute = async () => {
    try {
      const res = await axios.get(`/api/tributes/get?id=${id}`);
      setTribute(res.data.tribute);
    } catch (error) {
      console.error("Failed to fetch tribute:", error);
    }
  };

  useEffect(() => {
    if (id) fetchTribute();
  }, [id]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await axios.post(`/api/tributes/comment`, {
        tributeId: id,
        comment,
        user,
      });
      toast.success("Comment added successfully!");
      setComment("");
      fetchTribute();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  if (!tribute)
    return (
      <div className="text-center py-20">
        <img src="/404.png" alt="No tributes found" className="mx-auto h-96" />
        <h2 className="text-2xl font-bold text-base-content mt-4">
          No Tributes Found
        </h2>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Tribute Header */}
      <div className="bg-base-200 shadow-xl rounded-xl overflow-hidden">
        <Image
          src={tribute.image || "/avatar.png"}
          alt={tribute.name}
          width={800}
          height={400}
          className="w-full h-96 object-contain"
        />
        <div className="p-6 space-y-4">
          <h1 className="text-4xl font-bold text-primary">{tribute.name}</h1>
          <p className="text-base-content/80 text-lg">{tribute.description}</p>
          <div className="flex flex-col sm:flex-row justify-between gap-2 text-base-content/70">
            <p>
              <strong>Born:</strong>{" "}
              {new Date(tribute.dob).toLocaleDateString("en-IN")}
            </p>
            <p>
              <strong>Passed:</strong>{" "}
              {new Date(tribute.dod).toLocaleDateString("en-IN")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
            <span className="text-lg font-semibold text-secondary flex items-center gap-2">
              <IconHeart size={20} /> {tribute.likes?.length} Likes
            </span>
            <span className="text-lg font-semibold text-success flex items-center gap-2">
              💰 ₹{tribute.funding?.reduce((acc, curr) => acc + curr.amount, 0)}{" "}
              Raised
            </span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-primary mb-4">Comments</h2>
        <div className="space-y-4">
          {tribute?.comments!.length > 0 ? (
            tribute.comments!.map((c, index) => (
              <div
                key={index}
                className="bg-base-300 p-4 rounded-lg shadow flex justify-between items-start"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={c.user.profileImage || "/default-avatar.png"}
                    alt={c.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-base-content">
                      {c.user.name}
                    </p>
                    <p className="text-base-content/70">{c.comment}</p>
                  </div>
                </div>
                <p className="text-sm text-base-content/60 mt-1">
                  {new Date(c.timestamp).toLocaleDateString("en-IN")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-base-content/70">No comments yet.</p>
          )}
        </div>
        {/* Comment Input */}
        <div className="mt-6 flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="input input-bordered w-full"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAddComment}>
            <IconMessageCircle size={18} /> Post
          </button>
        </div>
      </div>

      {/* Funding History */}
      {tribute.funding!.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Funding History
          </h2>
          <div className="space-y-4">
            {tribute.funding!.map((f, index) => (
              <div
                key={index}
                className="bg-base-300 p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={f.user?.profileImage || "/default-avatar.png"}
                    alt={f.user?.name || "Anonymous"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-base-content">
                      {f.user?.name || "Anonymous"}
                    </p>
                    <p className="text-sm text-base-content/70">
                      Donated on {new Date(f.date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
                <p className="text-success font-semibold text-lg">
                  ₹{f.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnMore;
