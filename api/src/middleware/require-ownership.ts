import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors";

const requireOwnership = (
  model: any,
  location: "params" | "body" | "query",
  paramKey: string,
  modelKeyName = paramKey
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const paramValue = req[location][paramKey];
    const resource = await model.findOne({ userId: req.currentUserId, [modelKeyName]: paramValue });
    console.log(paramKey, paramValue, resource);

    if (!resource) {
      throw new NotAuthorizedError();
    }

    next();
  };
};

export { requireOwnership };
