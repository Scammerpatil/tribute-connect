import mongoose, { Schema } from "mongoose";
import { unique } from "next/dist/build/utils";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isPremiumHolder: {
    type: Boolean,
    default: false,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
  ],
  pinnedTribute: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tribute",
    },
  ],
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
