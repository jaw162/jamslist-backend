import cookie from "cookie";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../prisma";
import { Router } from "express";
import { getSecret } from "../getSecret";
const loginRouter = Router();

loginRouter.post("/", async (request, response) => {
  try {
    const { username, password }: { username: string; password: string } =
      request.body;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return response
        .status(401)
        .json({ message: "Incorrect Username or Password" });
    }

    const { passwordHash, ...userForToken } = user;

    const token = jwt.sign(userForToken, getSecret(), {
      expiresIn: 60 * 60,
    });

    response.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        maxAge: 60 * 60,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        secure: process.env.NODE_ENV === "production" ? true : false,
      })
    );

    response.status(200).send({ username: user.username, id: user.id });
  } catch (err) {
    console.error(err);
    response.status(400).send({ err });
  }
});

export default loginRouter;
