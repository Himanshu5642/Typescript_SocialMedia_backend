import mongoose, { Types, Document, Schema } from "mongoose";

interface IHidePost extends Document {
    post_id: Types.ObjectId;
    hide_by: Types.ObjectId;
}

const HidePostSchema = new Schema<IHidePost>(
    {
        post_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Post"
        },
        hide_by: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const HidePost = mongoose.model<IHidePost>(
    "HidePost",
    HidePostSchema
);
