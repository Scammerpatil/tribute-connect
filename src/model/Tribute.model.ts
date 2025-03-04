import mongoose, { Schema } from "mongoose";

const TributeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  dod: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      comment: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      timestamp: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  funding: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

const Tribute =
  mongoose.models.Tribute || mongoose.model("Tribute", TributeSchema);
export default Tribute;
