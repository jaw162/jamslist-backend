import supertest from "supertest";
import app from "../index";
import prisma from "../prisma";
import { randomUUID } from "crypto";
const api = supertest(app);

describe("testing user api route", () => {
  test("testing user route", async () => {
    const id = randomUUID();

    const user = {
      username: "test",
      password: "test",
      id: id,
    };

    await api
      .post("/api/user")
      .send(user)
      .expect(200)
      .then(res => {
        expect(res.body.user.username).toBe("test");
      })
      .catch(err => console.log(err));

    //   await prisma.user.delete({
    //     where: {
    //       id: id,
    //     },
    //   });
    // });

    // test("all users were deleted after test", async () => {
    //   const user = await prisma.user.findUnique({
    //     where: {
    //       username: "test2",
    //     },
    //   });

    //   expect(user).toBeNull();
  });
});
