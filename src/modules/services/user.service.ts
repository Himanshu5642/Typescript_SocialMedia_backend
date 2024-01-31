import { msg } from "../config";
import { User } from "../models";

export const showUserProfileService = async (userId: string) => {
    return await User.findById(userId, 'username profile_pic followers_count following_count is_activity_status');
}