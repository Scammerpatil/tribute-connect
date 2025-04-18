import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
      },
    ],
    following: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    pinnedTribute: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tribute",
      },
    ],
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
