"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = __importDefault(require("./auth/routes/auth.route"));
const user_route_1 = __importDefault(require("./user/routes/user.route"));
const initialize_1 = __importDefault(require("./config/passport/initialize"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const BASE_URL = '/api';
(0, initialize_1.default)(passport_1.default);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.get('/', (_req, res) => {
    res.send('Hello TypeScript with Node.js!');
});
app.use(`${BASE_URL}/auth`, auth_route_1.default);
app.use(`${BASE_URL}/user`, user_route_1.default);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
