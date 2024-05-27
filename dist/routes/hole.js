"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_config_1 = require("../configs/inversify.config");
const types_1 = require("../configs/types");
const router = express_1.default.Router();
const holeController = inversify_config_1.container.get(types_1.TYPES.HoleController);
router.get('/', (req, res, next) => holeController.getHoles(req, res, next));
router.get('/:holeId', (req, res, next) => holeController.getHoleById(req, res, next));
router.post('/', (req, res, next) => holeController.addHole(req, res, next));
router.put('/:holeId', (req, res, next) => holeController.updateHole(req, res, next));
router.delete('/', (req, res, next) => holeController.deleteHole(req, res, next));
exports.default = router;
