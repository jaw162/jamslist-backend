"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var slugify_1 = __importDefault(require("slugify"));
var ukCounties_1 = require("../ukCounties");
var testDataRouter = (0, express_1.Router)();
var faker_1 = require("@faker-js/faker");
var crypto_1 = require("crypto");
var genres = [
    "Rock",
    "Blues",
    "Jazz",
    "Indie",
    "Reggae",
    "Pop",
    "Electronic",
    "None",
    "Other",
];
function saveAndCreatePost(county, user) {
    return __awaiter(this, void 0, void 0, function () {
        var title;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    title = faker_1.faker.lorem.lines(1);
                    title = title.substring(0, title.length - 1);
                    return [4 /*yield*/, prisma_1.default.post.create({
                            data: {
                                title: title,
                                authorId: user.id,
                                genre: genres[returnRandomNumber(genres.length)],
                                content: faker_1.faker.lorem.paragraphs(6, "\n"),
                                countyId: county.name,
                            },
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function generateUsers() {
    return Array.from({ length: 20 }, function (e, i) {
        return {
            id: (0, crypto_1.randomUUID)(),
            username: faker_1.faker.internet.userName() + ("".concat(i + 1) + "".concat(i - 1)),
            passwordHash: faker_1.faker.internet.password(),
        };
    });
}
function returnRandomNumber(number) {
    return Math.floor(Math.random() * number);
}
testDataRouter.get("/", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var testUsers_1, countiesWithSlug, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                testUsers_1 = generateUsers();
                return [4 /*yield*/, prisma_1.default.user.createMany({
                        data: testUsers_1,
                    })];
            case 1:
                _a.sent();
                countiesWithSlug = ukCounties_1.ukCounties.map(function (el) { return (__assign(__assign({}, el), { slug: (0, slugify_1.default)(el.name) })); });
                return [4 /*yield*/, prisma_1.default.county.createMany({
                        data: countiesWithSlug,
                    })];
            case 2:
                _a.sent();
                countiesWithSlug.forEach(function (el) { return __awaiter(void 0, void 0, void 0, function () {
                    var i, max;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                max = returnRandomNumber(30);
                                _a.label = 1;
                            case 1:
                                if (!(i < max)) return [3 /*break*/, 3];
                                return [4 /*yield*/, saveAndCreatePost(el, testUsers_1[returnRandomNumber(testUsers_1.length)])];
                            case 2:
                                _a.sent();
                                i++;
                                return [3 /*break*/, 1];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/, response.status(200).json({ message: "Test data generated" })];
            case 3:
                err_1 = _a.sent();
                console.error(err_1);
                return [2 /*return*/, response.status(400).json({ err: err_1, message: "Something went wrong" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = testDataRouter;
