"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_config_1 = require("../configs/inversify.config");
const types_1 = require("../configs/types");
const router = express_1.default.Router();
const playerColorController = inversify_config_1.container.get(types_1.TYPES.PlayerColorController);
router.get('/', (req, res, next) => playerColorController.getPlayerColors(req, res, next));
exports.default = router;
