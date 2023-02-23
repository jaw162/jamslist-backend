import bcrypt from "bcrypt";
import prisma from "../prisma";
import { Router } from "express";
import { randomUUID } from "crypto";
const usersRouter = Router();
import { ExpressRequestWithUser } from "../middlewares/getToken";

usersRouter.get(
  "/messages",
  async (request: ExpressRequestWithUser, response) => {
    try {
      if (!request?.user?.id) {
        return response
          .status(401)
          .json({ message: "Not logged in or hasn't made an account" });
      }
      const user = await prisma.user.findUnique({
        where: {
          id: request.user.id,
        },
        select: {
          passwordHash: false,
          conversation: {
            include: {
              messages: {
                orderBy: { id: "desc" },
                take: 1,
              },
              user: { select: { id: true, username: true } },
              hideConvo: { where: { userId: request.user.id } },
            },
          },
          id: true,
        },
      });

      if (user?.id !== request.user.id) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      if (user.conversation.length) {
        user.conversation.forEach(convo => {
          convo.user = convo.user.filter(user => user.id !== request?.user?.id);
        });
        user.conversation = user?.conversation.filter(
          conv => conv.hideConvo[0].hide === false
        );
      }

      return response.status(200).json({ user });
    } catch (err) {
      console.error(err);
      return response
        .status(400)
        .json({ err, message: "Something went wrong" });
    }
  }
);

usersRouter.get("/me", async (request: ExpressRequestWithUser, response) => {
  try {
    if (!request.user) {
      return response
        .status(401)
        .json({ message: "Not logged in or hasn't made an account" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: request.user?.id,
      },
      select: {
        passwordHash: false,
        username: true,
        id: true,
      },
    });

    return response
      .status(200)
      .json({ username: user?.username, id: user?.id });
  } catch (err) {
    console.error(err);
    return response.status(400).json({ err, message: "Something went wrong" });
  }
});

usersRouter.post("/", async (request, response) => {
  try {
    const { username, password, id } = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        id: id ? id : randomUUID(),
      },
      select: {
        passwordHash: false,
        username: true,
        id: true,
        posts: true,
      },
    });

    return response.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return response.status(400).json({ err, message: "Something went wrong" });
  }
});

export default usersRouter;
