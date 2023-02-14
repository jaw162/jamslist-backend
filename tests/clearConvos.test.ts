import prisma from "../prisma";
import supertest from "supertest";
import app from "../index";
const api = supertest(app);

test("Remove Convos", async () => {
  await prisma.conversation.deleteMany({});
  await prisma.message.deleteMany({});
});
