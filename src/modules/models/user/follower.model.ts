import mongoose, { Document, Schema, ObjectId } from 'mongoose';
import { IFollower } from "../../interfaces";

const FollowerSchema = new Schema(
    {
        followed_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
            required: true,
        },
        followed_to: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
            required: true,
        },
        accepted: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Follower = mongoose.model<IFollower>('follower', FollowerSchema);
