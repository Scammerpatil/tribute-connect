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
    return <p className="text-center text-error">Tribute not found.</p>;

  return (
    <>
      <div className="bg-base-200 shadow-lg rounded-lg overflow-hidden">
        <Image
          src={tribute.image || "/avatar.png"}
          alt={tribute.name}
          width={600}
          height={300}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {tribute.name}
          </h1>
          <p className="text-base-content/70 text-lg mb-4">
            {tribute.description}
          </p>
          <div className="flex justify-between text-base-content/80">
            <p>
              <strong>Born:</strong> {new Date(tribute.dob).toDateString()}
            </p>
            <p>
              <strong>Passed:</strong> {new Date(tribute.dod).toDateString()}
            </p>
          </div>
          <div className="flex justify-between mt-4">
            <span className="text-lg font-bold text-secondary flex items-center gap-2">
              <IconHeart /> {tribute.likes?.length} Likes
            </span>
            <span className="text-lg font-bold text-success flex items-center gap-2">
              💰 ₹{tribute.funding?.reduce((acc, curr) => acc + curr.amount, 0)}{" "}
              Raised
            </span>
          </div>
          <hr className="my-4" />

          {/* Comments Section */}
          <h2 className="text-2xl font-semibold text-primary">Comments</h2>
          <div className="mt-4 space-y-4">
            {tribute.comments?.map((c, index) => (
              <div
                key={index}
                className="bg-base-300 p-4 rounded-lg shadow flex items-end w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="avatar">
                    <Image
                      src={c.user.profileImage || "/default-avatar.png"}
                      alt={c.user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">
                      {c.user.name}
                    </p>
                    <p className="text-base-content/70">{c.comment}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-base-content/70">
                    {new Date(c.timestamp).toDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="input input-bordered w-full"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleAddComment}>
              <IconMessageCircle /> Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearnMore;
