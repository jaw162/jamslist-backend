import prisma from "../prisma";
import { Router } from "express";
const countiesRouter = Router();

countiesRouter.get("/", async (request, response) => {
  try {
    const counties = await prisma.county.findMany({
      include: { _count: { select: { post: true } } },
    });

    return response.status(200).json(counties);
  } catch (err) {
    console.error(err);
    return response.status(400).json({ err, message: "Something went wrong" });
  }
});

const PER_PAGE = 10;

countiesRouter.get("/:slug", async (request, response) => {
  try {
    const { slug } = request.params;
    const { page } = request.query;

    if (isNaN(Number(page))) {
      return response.status(400).json({ message: "Invalid page query" });
    }

    const county = await prisma.county.findUnique({
      where: {
        slug: slug,
      },
      include: {
        post: {
          orderBy: { createdAt: "desc" },
          skip: PER_PAGE * Number(page) - PER_PAGE,
          take: PER_PAGE,
          include: { author: { select: { username: true } } },
        },
        _count: { select: { post: true } },
      },
    });

    return response.status(200).json({ county });
  } catch (err) {
    console.error(err);
    return response.status(400).json({ err, message: "Something went wrong" });
  }
});

export default countiesRouter;
