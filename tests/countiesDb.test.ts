import supertest from "supertest";
import app from "../index";
import prisma from "../prisma";
const api = supertest(app);

test("Checking joins are made correctly", async () => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: "test",
      },
    });

    if (!user) throw new Error("Can't find test user");

    await prisma.post.create({
      data: {
        title: "Looking for a singer",
        content: "blah blah blah",
        genre: "Blues",
        countyId: "Berkshire",
        authorId: user.id,
      },
    });

    const county = await prisma.county.findUnique({
      where: {
        name: "Berkshire",
      },
      select: {
        post: true,
        country: true,
        abbreviation: true,
        name: true,
      },
    });

    console.log("county after post", county);

    const userAfterPost = await prisma.user.findUnique({
      where: {
        username: "test",
      },
      select: {
        username: true,
        passwordHash: false,
        id: true,
        posts: true,
      },
    });

    console.log("userAfterPost", userAfterPost);

    const [postAfterPost] = await prisma.post.findMany({
      where: {
        countyId: "Berkshire",
      },
    });

    console.log("postAfterPost", postAfterPost);

    await prisma.post.delete({
      where: { id: postAfterPost.id },
    });
  } catch (err) {
    console.error(err);
  }
});

test("Checking current state of posts", async () => {
  try {
    const post = await prisma.post.findMany();
    console.log(post);
  } catch (err) {
    console.error(err);
  }
});

test("Checking current state of counties", async () => {
  try {
    const counties = await prisma.county.findMany();
    console.log(counties);
  } catch (err) {
    console.error(err);
  }
});
