import prisma from "../prisma";
import { Router } from "express";
import { ExpressRequestWithUser } from "../middlewares/getToken";
const convoRouter = Router();

convoRouter.get("/:id", async (request: ExpressRequestWithUser, response) => {
  try {
    if (!request?.user?.id) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const { id } = request.params;

    const convo = await prisma.conversation.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { username: true, id: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            createdAt: true,
            content: true,
            authorId: true,
            read: true,
            id: true,
            user: { select: { username: true, id: true } },
          },
        },
      },
    });

    const userConvo = convo?.user.some(el => el.id === request.user?.id);

    if (!userConvo) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const otherUser = convo?.messages.find(el => {
      return el.authorId !== request?.user?.id;
    });

    if (otherUser) {
      await prisma.message.updateMany({
        where: {
          authorId: otherUser.authorId,
          conversation: {
            id: convo?.id,
          },
        },
        data: {
          read: true,
        },
      });
    }

    return response.status(200).json({ convo });
  } catch (err) {
    console.error(err);

    return response.status(400).json({ err, message: "Something went wrong" });
  }
});

convoRouter.post("/", async (request: ExpressRequestWithUser, response) => {
  try {
    if (!request?.user?.id) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const { userToId, title, content } = request.body;

    const convo = await prisma.conversation.create({
      data: {
        user: { connect: [{ id: userToId }, { id: request?.user?.id }] },
        title,
      },
    });

    const { id } = convo;

    await prisma.message.create({
      data: {
        authorId: request?.user?.id as string,
        convoId: id,
        content,
      },
    });

    await prisma.userHideConvo.createMany({
      data: [
        {
          userId: userToId,
          convoId: id,
        },
        {
          userId: request.user.id,
          convoId: id,
        },
      ],
    });

    return response.status(200).json({ message: "Success", convoId: convo.id });
  } catch (err) {
    console.error(err);
    return response.status(400).json({ err, message: "Something went wrong" });
  }
});

convoRouter.put("/:id", async (request: ExpressRequestWithUser, response) => {
  try {
    const { id } = request.params;

    if (!request?.user?.id || !id) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const { content } = request.body;

    const convo = await prisma.conversation.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
      },
    });

    const isUserInConvo = convo?.user.some(el => el.id === request?.user?.id);

    if (!isUserInConvo) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const message = await prisma.message.create({
      data: {
        authorId: request?.user?.id,
        convoId: Number(id),
        content,
      },
    });

    return response.status(200).json({ message: "Success" });
  } catch (err) {
    console.error(err);
    return response.status(400).json({ err, message: "Something went wrong" });
  }
});

convoRouter.delete(
  "/:id",
  async (request: ExpressRequestWithUser, response) => {
    try {
      const { id } = request.params;

      if (!request?.user?.id || !id) {
        return response
          .status(401)
          .json({ message: "You cannot make this request." });
      }

      const userHide = await prisma.userHideConvo.findMany({
        where: { convoId: Number(id) },
      });

      const usersConvo = userHide.some(el => el.userId === request.user?.id);

      if (!usersConvo) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const allDelete = userHide.every(el => el.hide === true);

      if (allDelete) {
        await prisma.conversation.delete({
          where: { id: Number(id) },
        });

        return response.status(200).json({ message: "Success" });
      }

      const [userHideOption] = userHide.filter(
        el => el.userId === request?.user?.id
      );

      await prisma.userHideConvo.update({
        where: {
          id: userHideOption.id,
        },
        data: {
          hide: true,
        },
      });

      return response.status(200).json({ message: "Success" });
    } catch (err) {
      console.error(err);
      return response
        .status(400)
        .json({ err, message: "Something went wrong" });
    }
  }
);

export default convoRouter;
