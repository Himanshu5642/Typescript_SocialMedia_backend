import multer, { memoryStorage } from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
      cb(null, '../Frontend/public/uploads');
    },
    filename: function (req: Request, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
})
  
export const upload = multer({ storage: memoryStorage() })