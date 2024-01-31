import { Request, Response } from "express";
import { errorHandler } from "./checkError.helper";

export const wrapAsync = (fn: any) => {
    return (req: Request, res: Response) => {
        return fn(req, res)
            .then((r: any) => {
                // if (r.render == "invoice") { res.render("invoice", r.data) }
                if (r && r.render == "invoice") { res.render("invoice", r.data) }
                else res.status(200).send(r);
            })
            .catch((err: any) => {
                console.log(err);
                const response = errorHandler(err);
                res.status(response.status).send(response);
            });
    };
};

