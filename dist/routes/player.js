"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_config_1 = require("../configs/inversify.config");
const types_1 = require("../configs/types");
const router = express_1.default.Router();
const playerController = inversify_config_1.container.get(types_1.TYPES.PlayerController);
router.get('/', (req, res, next) => playerController.getPlayers(req, res, next));
router.get('/:playerId', (req, res, next) => playerController.getPlayerById(req, res, next));
router.post('/', (req, res, next) => playerController.addPlayer(req, res, next));
router.put('/:playerId', (req, res, next) => playerController.updatePlayer(req, res, next));
router.delete('/', (req, res, next) => playerController.deletePlayer(req, res, next));
exports.default = router;
