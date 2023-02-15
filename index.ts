import express from "express";
import countiesRouter from "./controllers/counties";
import loginRouter from "./controllers/login";
import postsRouter from "./controllers/post";
import usersRouter from "./controllers/user";
import { getUser } from "./middlewares/getToken";
import { requestLogger } from "./middlewares/requestLogger";
import testDataRouter from "./controllers/testData";
import cors from "cors";
import convoRouter from "./controllers/convo";
import logoutRouter from "./controllers/logout";
const app = express();
app.use(getUser);

app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://jamslist-frontend.vercel.app",
    credentials: true,
  })
);

app.use(requestLogger);
app.use("/api/user", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/counties", countiesRouter);
app.use("/api/posts", postsRouter);
app.use("/api/testData", testDataRouter);
app.use("/api/conversation", convoRouter);

app.listen(process.env.PORT || 3001, () => {
  console.log("app is running");
  console.log("NODE_ENV:", process.env.NODE_ENV);
});

export default app;
