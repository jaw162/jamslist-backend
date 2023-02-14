import supertest from "supertest";
import app from "../index";
// import prisma from "../prisma";
import cookie from "cookie";
const api = supertest(app);

describe("testing login api route", () => {
  test("can log in?", async () => {
    const user = {
      username: "test",
      password: "test",
    };

    let message;

    await api
      .post("/api/login")
      .send(user)
      .expect(200)
      .then((res) => {
        message = res.body.message;
      })
      .catch((err) => console.log(err));

    expect(message).toMatch(/test logged in./);
  });

  test("token is set in header", async () => {
    const user = {
      username: "test",
      password: "test",
    };

    let token;

    await api
      .post("/api/login")
      .send(user)
      .expect(200)
      .then((res) => {
        token = cookie.parse(res.header["set-cookie"][0]);
      })
      .catch((err) => console.log(err));

    expect(token).toBeDefined();
  });
});
