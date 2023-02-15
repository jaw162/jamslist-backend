import prisma from "../prisma";
import { Request, Router } from "express";
import { ExpressRequestWithUser } from "../middlewares/getToken";
const postsRouter = Router();

postsRouter.get("/", async (request: ExpressRequestWithUser, response) => {
  try {
    if (!request?.user?.id) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const posts = await prisma.user.findUnique({
      where: {
        id: request.user.id,
      },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            genre: true,
            countyId: true,
            createdAt: true,
          },
        },
      },
    });

    return response.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ err, message: "Something went wrong" });
  }
});

postsRouter.put(
  "/:postId",
  async (request: Request & { user?: { id: string } }, response) => {
    try {
      const { postId } = request.params;
      const { title, content, genre } = request.body;

      if (!request?.user?.id) {
        return response.status(404).json({ message: "missing authorId" });
      }
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          authorId: true,
        },
      });

      if (post?.authorId !== request?.user?.id) {
        return response.status(404).json({ message: "Unauthorized" });
      }

      const posts = await prisma.post.update({
        where: { id: postId },
        data: {
          title,
          content,
          genre,
        },
      });

      return response.status(200).json(posts);
    } catch (err) {
      console.error(err);
      return response.status(400).json({ message: err });
    }
  }
);

postsRouter.delete(
  "/:id",
  async (request: Request & { user?: { id: string } }, response) => {
    try {
      const { id } = request.params;

      if (!request?.user?.id) {
        return response.status(404).json({ message: "Please Log In" });
      }

      const post = await prisma.post.findUnique({
        where: {
          id,
        },
        select: {
          authorId: true,
        },
      });

      if (post?.authorId !== request?.user?.id) {
        return response.status(404).json({ message: "Unauthorized" });
      }

      const posts = await prisma.post.delete({
        where: {
          id,
        },
      });

      return response.status(200).json({ message: "Success" });
    } catch (err) {
      console.error(err);
      return response.status(400).json({ message: err });
    }
  }
);

postsRouter.post(
  "/",
  async (request: Request & { user?: { id: string } }, response) => {
    try {
      const { title, content, genre, countyId } = request.body;

      if (!request?.user?.id) {
        return response.status(404).json({ message: "Please Log In" });
      }

      await prisma.post.create({
        data: {
          title,
          content,
          genre,
          authorId: request.user.id,
          countyId,
        },
      });

      return response.status(200).json({ message: "Success" });
    } catch (err) {
      console.error(err);
      return response.status(400).json({ message: err });
    }
  }
);

export default postsRouter;
