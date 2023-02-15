"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var counties_1 = __importDefault(require("./controllers/counties"));
var login_1 = __importDefault(require("./controllers/login"));
var post_1 = __importDefault(require("./controllers/post"));
var user_1 = __importDefault(require("./controllers/user"));
var getToken_1 = require("./middlewares/getToken");
var requestLogger_1 = require("./middlewares/requestLogger");
var testData_1 = __importDefault(require("./controllers/testData"));
var cors_1 = __importDefault(require("cors"));
var convo_1 = __importDefault(require("./controllers/convo"));
var logout_1 = __importDefault(require("./controllers/logout"));
var app = (0, express_1.default)();
app.use(getToken_1.getUser);
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://jamslist-frontend.vercel.app",
    credentials: true,
}));
app.use(requestLogger_1.requestLogger);
app.use("/api/user", user_1.default);
app.use("/api/login", login_1.default);
app.use("/api/logout", logout_1.default);
app.use("/api/counties", counties_1.default);
app.use("/api/posts", post_1.default);
app.use("/api/testData", testData_1.default);
app.use("/api/conversation", convo_1.default);
app.listen(process.env.PORT || 3001, function () {
    console.log("app is running");
    console.log("NODE_ENV:", process.env.NODE_ENV);
});
exports.default = app;
