import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getSecret } from "../getSecret";

type JwtPayloadUser = Omit<User, "passwordHash"> & { iat: number; exp: number };
type RequestWithUserAttached = Omit<JwtPayloadUser, "iat" | "exp">;
export type ExpressRequestWithUser = Request & {
  token?: string;
  user?: RequestWithUserAttached;
};

export const getUser = async (
  request: ExpressRequestWithUser,
  response: Response,
  next: NextFunction
) => {
  const auth = request.get("Cookie");

  if (!auth) return next();

  request.token = auth.substring(6);

  const { id, username } = (await jwt.verify(
    auth.substring(6),
    getSecret()
  )) as JwtPayloadUser;

  request.user = { id, username };

  next();
};
