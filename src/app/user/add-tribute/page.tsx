"use client";
import { useAuth } from "@/context/AuthProvider";
import { Tribute } from "@/types/Tribute";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const AddTribute = () => {
  const { user } = useAuth();
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
    </>
  );
};
export default AddTribute;
