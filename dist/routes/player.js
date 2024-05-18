"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PlayerController_1 = require("../controllers/PlayerController");
const router = express_1.default.Router();
const playerController = new PlayerController_1.PlayerController();
router.get('/', playerController.getPlayers);
router.get('/:playerId', playerController.getPlayerById);
router.post('/', playerController.addPlayer);
router.put('/:playerId', playerController.updatePlayer);
router.delete('/', playerController.deletePlayer);
exports.default = router;
