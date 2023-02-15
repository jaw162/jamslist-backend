import prisma from "../prisma";
import supertest from "supertest";
import app from "../index";
const api = supertest(app);
import { conversation } from "@prisma/client";

test("Checking convo POST endpoint", async () => {
  let postMessage;
  let convoId;

  const users = await prisma.user.findMany();
  const userFromId = users[0].id;
  const userToId = users[1].id;

  await api
    .post("/api/conversation")
    .expect(200)
    .send({
      userToId,
      userFromId,
      title: "What's up",
      content: "Hey, looking for a singer bro",
    })
    .then(res => {
      postMessage = res.body.message;
      convoId = res.body.convoId;
    })
    .catch(err => console.error(err));

  expect(postMessage).toMatch(/Success/);

  let secondPostMessage;

  await api
    .put(`/api/conversation/${convoId}`)
    .expect(200)
    .send({
      userFromId: userToId,
      title: "Sound's good",
      content: "Yeah let's meet up",
    })
    .then(res => {
      console.log(res.body);
      secondPostMessage = res.body.message;
    })
    .catch(err => console.error(err));

  expect(secondPostMessage).toMatch(/Success/);

  let conversation: conversation | undefined;

  await api
    .get(`/api/conversation/${convoId}`)
    .expect(200)
    .then(res => {
      conversation = res.body.convo;
    })
    .catch(err => console.error(err));

  await prisma.conversation.delete({ where: { id: convoId } });
});
