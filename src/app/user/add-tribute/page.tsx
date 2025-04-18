"use client";
import { useAuth } from "@/context/AuthProvider";
import { Tribute } from "@/types/Tribute";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";

const AddTribute = () => {
  const { user } = useAuth();
  const [generatedDescriptions, setGeneratedDescriptions] = useState<string[]>(
    []
  );
  const [tribute, setTribute] = useState<Tribute>({
    name: "",
    description: "",
    dob: new Date(),
    dod: new Date(),
    image: "",
    supportingDocument: "",
    user: user?._id,
  });
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!tribute.name) {
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
  const handleSupportingDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!tribute.name) {
      toast.error("Name is required for the document");
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
        folderName: "supporting-documents",
      });
      toast.promise(imageResponse, {
        loading: "Uploading Supporting Document...",
        success: (data: AxiosResponse) => {
          setTribute({
            ...tribute,
            supportingDocument: data.data.path,
          });
          return "Supporting Document Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    }
  };
  const handleSubmit = async () => {
    if (
      !tribute.name ||
      !tribute.description ||
      !tribute.dob ||
      !tribute.dod ||
      !tribute.image
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    const response = axios.post("/api/tributes/add", { tribute });
    toast.promise(response, {
      loading: "Adding Tribute",
      success: () => {
        setTribute({
          name: "",
          description: "",
          dob: new Date(),
          dod: new Date(),
          image: "",
          user: user?._id,
          supportingDocument: "",
        });
        return "Tribute Added Successfully";
      },
      error: (err: any) => {
        console.log(err);
        return err.response?.data?.message || "Error adding tribute";
      },
    });
  };
  const handleGenerateDescription = async () => {
    if (!tribute.name) return toast.error("Name is required");
    if (!tribute.description) return toast.error("Description is Required!!");
    try {
      const res = axios.post("/api/helper/generate-description", {
        name: tribute.name,
        desc: tribute.description,
      });
      toast.promise(res, {
        loading: "Generating Description...",
        success: (data) => {
          setGeneratedDescriptions(data.data.options);
          return "Descriptions Generated Successfully";
        },
        error: (err: any) => {
          console.log(err);
          return err.response?.data?.message || "Error generating description";
        },
      });
      (
        document.getElementById("description-dialog") as HTMLDialogElement
      ).showModal();
    } catch (error) {
      toast.error("Failed to generate descriptions");
    }
  };
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6 uppercase">
        Add Tribute
      </h1>
      <div className="bg-base-300 shadow-lg rounded-xl p-8 w-full max-w-lg text-center mx-auto">
        <div className="grid grid-cols-1 space-y-4">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Enter the Name</span>
            </div>
            <input
              type="text"
              className="input input-bordered input-primary w-full text-base-content"
              value={tribute.name}
              onChange={(e) => {
                setTribute({ ...tribute, name: e.target.value });
              }}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Enter Small Desc</span>
            </div>
            <textarea
              className="textarea textarea-primary textarea-bordered w-full text-base-content"
              value={tribute.description}
              onChange={(e) => {
                setTribute({ ...tribute, description: e.target.value });
              }}
            />
            <button
              className="btn btn-secondary btn-sm w-full mt-3"
              onClick={handleGenerateDescription}
              disabled={!tribute.name || !tribute.description}
            >
              Generate with AI
            </button>
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Enter the Date of Birth</span>
            </div>
            <input
              type="date"
              className="input input-bordered input-primary w-full text-base-content"
              value={tribute.dob}
              onChange={(e) => {
                setTribute({ ...tribute, dob: e.target.value });
              }}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Enter the Date of Perished</span>
            </div>
            <input
              type="date"
              className="input input-bordered input-primary w-full text-base-content"
              value={tribute.dod}
              onChange={(e) => {
                setTribute({ ...tribute, dod: e.target.value });
              }}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Give One Photo</span>
            </div>
            <input
              type="file"
              className="file-input file-input-primary file-input-bordered w-full text-base-content"
              accept="image/* .png .jpeg .jpg"
              onChange={handleProfileImageChange}
              disabled={!tribute.name}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Give Proof</span>
            </div>
            <input
              type="file"
              className="file-input file-input-primary file-input-bordered w-full text-base-content"
              accept="application/pdf .pdf"
              onChange={handleSupportingDocumentChange}
              disabled={!tribute.name}
            />
          </label>
          <button
            className="btn btn-primary btn-outline"
            onClick={handleSubmit}
          >
            Add Tribute
          </button>
        </div>
      </div>
      <dialog id="description-dialog" className="modal">
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg">Choose a Description !</h3>
            <div className="modal-action">
              <form method="dialog">
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
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default AddTribute;
