"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tribute } from "@/types/Tribute";
import { useAuth } from "@/context/AuthProvider";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

const EditTribute = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const id = searchParams.get("id");

  const [tribute, setTribute] = useState<Tribute>();
  const [generatedDescriptions, setGeneratedDescriptions] = useState<string[]>(
    []
  );

  useEffect(() => {
    const fetchTribute = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`/api/tributes/get?id=${id}`);
        setTribute(res.data.tribute);
      } catch (err) {
        toast.error("Failed to fetch tribute");
      }
    };
    fetchTribute();
  }, [id]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!tribute?.name) {
      toast.error("Name is required for images");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }
      const imageResponse = axios.postForm("/api/helper/upload-img", {
        file,
        name: tribute.name,
        folderName: "tributes",
      });
      console.log(imageResponse);
      toast.promise(imageResponse, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setTribute({
            ...tribute,
            image: data.data.path,
          });
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    }
  };

  const handleUpdate = async () => {
    if (
      !tribute?.name ||
      !tribute.description ||
      !tribute.dob ||
      !tribute.dod ||
      !tribute.image
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      const res = axios.put(`/api/tributes/edit?id=${tribute._id}`, {
        tribute,
      });
      toast.promise(res, {
        loading: "Updating tribute...",
        success: "Tribute updated successfully",
        error: "Failed to update tribute",
      });
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleGenerateDescription = async () => {
    if (!tribute?.name || !tribute.description)
      return toast.error("Fill in name and description first");
    try {
      const res = axios.post("/api/helper/generate-description", {
        name: tribute.name,
        desc: tribute.description,
      });
      toast.promise(res, {
        loading: "Generating descriptions...",
        success: (data) => {
          setGeneratedDescriptions(data.data.options);
          return "Generated descriptions";
        },
        error: "Failed to generate",
      });
      (
        document.getElementById("description-dialog") as HTMLDialogElement
      ).showModal();
    } catch (error) {
      toast.error("Failed to generate descriptions");
    }
  };

  if (!tribute) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6 uppercase">
        Edit Tribute
      </h1>
      <div className="bg-base-300 shadow-lg rounded-xl p-8 w-full max-w-lg text-center mx-auto">
        <div className="grid grid-cols-1 space-y-4">
          <img
            src={tribute.image || "/avatar.png"}
            alt={tribute.name}
            className="w-full h-48 object-contain rounded-lg mb-4"
          />
          <input
            type="file"
            accept="image/*"
            className="file file-input file-input-bordered file-input-primary w-full"
            onChange={handleProfileImageChange}
          />

          <input
            type="text"
            className="input input-bordered input-primary"
            value={tribute.name}
            onChange={(e) => setTribute({ ...tribute, name: e.target.value })}
          />
          <textarea
            className="textarea textarea-bordered textarea-primary"
            value={tribute.description}
            onChange={(e) =>
              setTribute({ ...tribute, description: e.target.value })
            }
            placeholder="Description"
            rows={4}
          />
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleGenerateDescription}
            disabled={!tribute.name || !tribute.description}
          >
            Generate with AI
          </button>
          <input
            type="date"
            className="input input-bordered input-primary"
            value={new Date(tribute.dob).toISOString().split("T")[0]}
            onChange={(e) => setTribute({ ...tribute, dob: e.target.value })}
          />
          <input
            type="date"
            className="input input-bordered input-primary"
            value={new Date(tribute.dod).toISOString().split("T")[0]}
            onChange={(e) => setTribute({ ...tribute, dod: e.target.value })}
          />
          <button className="btn btn-primary" onClick={handleUpdate}>
            Update Tribute
          </button>
        </div>
      </div>

      {/* Description Modal */}
      <dialog id="description-dialog" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg mb-4">Select a Description</h3>
          <div className="space-y-3">
            {generatedDescriptions.map((desc, idx) => (
              <div
                key={idx}
                className="p-3 border border-base-content/20 rounded hover:bg-base-300 cursor-pointer"
                onClick={() => {
                  setTribute({ ...tribute, description: desc });
                  (
                    document.getElementById(
                      "description-dialog"
                    ) as HTMLDialogElement
                  ).close();
                }}
              >
                <Markdown>{desc}</Markdown>
              </div>
            ))}
          </div>
          <form method="dialog" className="mt-4">
            <button className="btn">Close</button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default EditTribute;
