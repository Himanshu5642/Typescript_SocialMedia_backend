import { Router } from "express";
import * as Routes from "./modules/routes";

const router = Router();

// Import all routes
for (const route of Object.keys(Routes)) {
    // @ts-ignore
    router.use(Routes[route]);
    // Ex - router.use(UserRoute)
}

export { router };