import mongoose, { Schema } from "mongoose";
import { IUserFolder } from "../../interfaces";

const UserFolderSchema = new Schema<IUserFolder>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      lowercase: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserFolderSchema.index({ name: 1, user_id: 1 }, { unique: true });
export const UserFolder = mongoose.model("userfolder", UserFolderSchema);
