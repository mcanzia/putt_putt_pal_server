"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const room_1 = __importDefault(require("./room"));
const player_1 = __importDefault(require("./player"));
const hole_1 = __importDefault(require("./hole"));
const playerColor_1 = __importDefault(require("./playerColor"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.use('/room', room_1.default);
router.use('/player', player_1.default);
router.use('/hole', hole_1.default);
router.use('/playercolor', playerColor_1.default);
exports.default = router;
