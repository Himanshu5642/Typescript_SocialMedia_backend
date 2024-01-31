import { IUser } from '../interfaces';

declare global {
    namespace Express {
        export interface Request {
            user: IUser;
            // number?: String;
            // token?: string;
            // id?: mongoose.Schema.Types.ObjectId;
            // io: Socket;
        }
    }
}
