import prisma from "../prisma";
import supertest from "supertest";
import app from "../index";
const api = supertest(app);

test("Testdata generation", async () => {
  await prisma.user.deleteMany({});
  await prisma.county.deleteMany({});
  await prisma.post.deleteMany({});

  let message;

  await api
    .get("/api/testData")
    .expect(200)
    .then(res => {
      message = res.body.message;
    })
    .catch(err => console.log(err));

  console.log(message);
});
