"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RoomController_1 = require("../controllers/RoomController");
const router = express_1.default.Router();
const roomController = new RoomController_1.RoomController();
router.get('/', roomController.getRooms);
router.get('/:roomId', roomController.getRoomByNumber);
router.post('/create', roomController.createRoom);
router.post('/join', roomController.joinRoom);
router.post('/leave', roomController.leaveRoom);
router.delete('/', roomController.deleteRoom);
exports.default = router;
