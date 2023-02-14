import supertest from "supertest";
import app from "../index";
const api = supertest(app);

test("Checking counties return post field length instead of posts", async () => {
  let noOfPosts;

  await api
    .get("/api/counties")
    .expect(200)
    .then((res) => {
      noOfPosts = res.body[0]._count.post;
    })
    .catch((err) => console.error(err));

  expect(noOfPosts).toEqual(0);
});
