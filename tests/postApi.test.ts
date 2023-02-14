import supertest from "supertest";
import app from "../index";
const api = supertest(app);

test("Testing GET all", async () => {
  let message;

  await api
    .get("/api/posts")
    .expect(200)
    .then(res => (message = res.body))
    .catch(err => console.error(err));

  console.log(message);
});

test("Testing GET post request", async () => {
  const user = {
    username: "test",
    password: "test",
  };

  let message;
  let posts;

  await api
    .get("/api/posts/Berkshire?page=0")
    .expect(200)
    .then(res => {
      message = res.body.id;
      posts = res.body.posts;

      console.log(posts[0]);
    })
    .catch(err => console.error(err));

  expect(message).toMatch(/Berkshire/);
  expect(posts).toHaveLength(10);
});
