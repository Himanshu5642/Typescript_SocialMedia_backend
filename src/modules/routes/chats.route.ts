import { Router } from "express";
const ChatRoute = Router();

import { User } from "../models";
import { Authentication } from "../middlewares";
import { wrapAsync } from "../helpers";
import {
  newConversation,
  newGroupConversation,
  getAllConversation,
  getAllMessages,
  updateMessage,
  deleteMessage,
  deleteMultipleMessage
} from "../controller";

/*--------------------- Conversation ---------------------*/

ChatRoute.post("/chats/new", Authentication(User), wrapAsync(newConversation));
ChatRoute.post("/chats/newGroup", Authentication(User), wrapAsync(newGroupConversation));
ChatRoute.get("/chats", Authentication(User), wrapAsync(getAllConversation));

/*--------------------- Message ---------------------*/

ChatRoute.get("/messages", Authentication(User), wrapAsync(getAllMessages));
ChatRoute.put("/message/:id", Authentication(User), wrapAsync(updateMessage));
ChatRoute.delete("/message/:id", Authentication(User), wrapAsync(deleteMessage));

ChatRoute.delete("/messages", Authentication(User), wrapAsync(deleteMultipleMessage));


export { ChatRoute };
