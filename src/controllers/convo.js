"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = __importDefault(require("../prisma"));
var express_1 = require("express");
var convoRouter = (0, express_1.Router)();
convoRouter.get("/:id", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, convo, userConvo, otherUser, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                if (!((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    return [2 /*return*/, response.status(401).json({ message: "Unauthorized" })];
                }
                id = request.params.id;
                return [4 /*yield*/, prisma_1.default.conversation.findUnique({
                        where: { id: Number(id) },
                        include: {
                            user: { select: { username: true, id: true } },
                            messages: {
                                orderBy: { createdAt: "asc" },
                                select: {
                                    createdAt: true,
                                    content: true,
                                    authorId: true,
                                    read: true,
                                    id: true,
                                    user: { select: { username: true, id: true } },
                                },
                            },
                        },
                    })];
            case 1:
                convo = _b.sent();
                userConvo = convo === null || convo === void 0 ? void 0 : convo.user.some(function (el) { var _a; return el.id === ((_a = request.user) === null || _a === void 0 ? void 0 : _a.id); });
                if (!userConvo) {
                    return [2 /*return*/, response.status(401).json({ message: "Unauthorized" })];
                }
                otherUser = convo === null || convo === void 0 ? void 0 : convo.messages.find(function (el) {
                    var _a;
                    return el.authorId !== ((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id);
                });
                if (!otherUser) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma_1.default.message.updateMany({
                        where: {
                            authorId: otherUser.authorId,
                            conversation: {
                                id: convo === null || convo === void 0 ? void 0 : convo.id,
                            },
                        },
                        data: {
                            read: true,
                        },
                    })];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [2 /*return*/, response.status(200).json({ convo: convo })];
            case 4:
                err_1 = _b.sent();
                console.error(err_1);
                return [2 /*return*/, response.status(400).json({ err: err_1, message: "Something went wrong" })];
            case 5: return [2 /*return*/];
        }
    });
}); });
convoRouter.post("/", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userToId, title, content, convo, id, err_2;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 4, , 5]);
                if (!((_b = request === null || request === void 0 ? void 0 : request.user) === null || _b === void 0 ? void 0 : _b.id)) {
                    return [2 /*return*/, response.status(401).json({ message: "Unauthorized" })];
                }
                _a = request.body, userToId = _a.userToId, title = _a.title, content = _a.content;
                return [4 /*yield*/, prisma_1.default.conversation.create({
                        data: {
                            user: { connect: [{ id: userToId }, { id: (_c = request === null || request === void 0 ? void 0 : request.user) === null || _c === void 0 ? void 0 : _c.id }] },
                            title: title,
                        },
                    })];
            case 1:
                convo = _e.sent();
                id = convo.id;
                return [4 /*yield*/, prisma_1.default.message.create({
                        data: {
                            authorId: (_d = request === null || request === void 0 ? void 0 : request.user) === null || _d === void 0 ? void 0 : _d.id,
                            convoId: id,
                            content: content,
                        },
                    })];
            case 2:
                _e.sent();
                return [4 /*yield*/, prisma_1.default.userHideConvo.createMany({
                        data: [
                            {
                                userId: userToId,
                                convoId: id,
                            },
                            {
                                userId: request.user.id,
                                convoId: id,
                            },
                        ],
                    })];
            case 3:
                _e.sent();
                return [2 /*return*/, response.status(200).json({ message: "Success", convoId: convo.id })];
            case 4:
                err_2 = _e.sent();
                console.error(err_2);
                return [2 /*return*/, response.status(400).json({ err: err_2, message: "Something went wrong" })];
            case 5: return [2 /*return*/];
        }
    });
}); });
convoRouter.put("/:id", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, content, convo, isUserInConvo, message, err_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                id = request.params.id;
                if (!((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id) || !id) {
                    return [2 /*return*/, response.status(401).json({ message: "Unauthorized" })];
                }
                content = request.body.content;
                return [4 /*yield*/, prisma_1.default.conversation.findUnique({
                        where: {
                            id: Number(id),
                        },
                        include: {
                            user: true,
                        },
                    })];
            case 1:
                convo = _c.sent();
                isUserInConvo = convo === null || convo === void 0 ? void 0 : convo.user.some(function (el) { var _a; return el.id === ((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id); });
                if (!isUserInConvo) {
                    return [2 /*return*/, response.status(401).json({ message: "Unauthorized" })];
                }
                return [4 /*yield*/, prisma_1.default.message.create({
                        data: {
                            authorId: (_b = request === null || request === void 0 ? void 0 : request.user) === null || _b === void 0 ? void 0 : _b.id,
                            convoId: Number(id),
                            content: content,
                        },
                    })];
            case 2:
                message = _c.sent();
                return [2 /*return*/, response.status(200).json({ message: "Success" })];
            case 3:
                err_3 = _c.sent();
                console.error(err_3);
                return [2 /*return*/, response.status(400).json({ err: err_3, message: "Something went wrong" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
convoRouter.delete("/:id", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userHide, usersConvo, allDelete, userHideOption, err_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                id = request.params.id;
                if (!((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id) || !id) {
                    return [2 /*return*/, response
                            .status(401)
                            .json({ message: "You cannot make this request." })];
                }
                return [4 /*yield*/, prisma_1.default.userHideConvo.findMany({
                        where: { convoId: Number(id) },
                    })];
            case 1:
                userHide = _b.sent();
                usersConvo = userHide.some(function (el) { var _a; return el.userId === ((_a = request.user) === null || _a === void 0 ? void 0 : _a.id); });
                if (!usersConvo) {
                    return [2 /*return*/, response.status(401).json({ message: "Unauthorized" })];
                }
                allDelete = userHide.every(function (el) { return el.hide === true; });
                if (!allDelete) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma_1.default.conversation.delete({
                        where: { id: Number(id) },
                    })];
            case 2:
                _b.sent();
                return [2 /*return*/, response.status(200).json({ message: "Success" })];
            case 3:
                userHideOption = userHide.filter(function (el) { var _a; return el.userId === ((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id); })[0];
                return [4 /*yield*/, prisma_1.default.userHideConvo.update({
                        where: {
                            id: userHideOption.id,
                        },
                        data: {
                            hide: true,
                        },
                    })];
            case 4:
                _b.sent();
                return [2 /*return*/, response.status(200).json({ message: "Success" })];
            case 5:
                err_4 = _b.sent();
                console.error(err_4);
                return [2 /*return*/, response
                        .status(400)
                        .json({ err: err_4, message: "Something went wrong" })];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = convoRouter;
