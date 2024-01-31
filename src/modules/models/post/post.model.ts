import mongoose, {Schema} from "mongoose";
import { IPost } from "../../interfaces";
import { PostContentType, PostMediaType, PostVisibility } from "../../enums";
import { convertEnumToArray } from "../../helpers";

const PostSchema = new Schema<IPost>(
    {
        content_type: {
            type: String,
            required: true,
            enum: convertEnumToArray(PostContentType),
        },

        comments_count: { type: Number, default: 0 },

        like_count: { type: Number, default: 0 },

        visibility: {
            type: String,
            default: PostVisibility.PUBLIC,
            enums: convertEnumToArray(PostVisibility),
        },

        caption: { type: String, default: '' },
        media_type: {
            type: 'string',
            enum: convertEnumToArray(PostMediaType),
            required: true,
            // required: function () {
            //     // @ts-ignore
            //     return this.content_type === PostContentType.POST;
            // },
        },
        thumbnail: String,

        // Array Of String 
        images: {
            type: [String],
            required: function () {
                // @ts-ignore
                return this.content_type === PostContentType.SHORT || this.content_type === PostContentType.POST;
            },
        },
        message: {
            type: String,
            required: function () {
                // @ts-ignore
                return this.content_type === PostContentType.TEXT;
            },
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        hash_tags: [String],
        mentions: [Schema.Types.ObjectId],
        location: String,
        only_close_friends: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Post = mongoose.model<IPost>('Post', PostSchema);
