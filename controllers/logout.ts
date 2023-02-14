import cookie from "cookie";
import { Router } from "express";
const logoutRouter = Router();
import type { ExpressRequestWithUser } from "../middlewares/getToken";

logoutRouter.post("/", async (request: ExpressRequestWithUser, response) => {
  if (!request.token)
    return response.status(400).json({ message: "Bad Request" });

  response.setHeader(
    "Set-Cookie",
    cookie.serialize("token", request.token, {
      httpOnly: true,
      expires: new Date(0),
    })
  );

  response.status(200).send({ message: "Success" });
});

export default logoutRouter;
