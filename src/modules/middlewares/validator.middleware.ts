import { AnySchema as JoiAnySchema } from "joi";
import { Request, Response, NextFunction } from "express";
import { checkError } from "../helpers";

export function validate(validator: JoiAnySchema) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const validated = await validator.validateAsync({
        body: req.body,

        /* Its an Error Over Here */

        // query: req.query,
        // params: req.params,
        // headers: req.headers,
      });
      req.body = validated.body;
      console.log("Valid body");

      next();
    } catch (err: any) {
      checkError(err, res);
    }
  };
}
