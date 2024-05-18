"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HoleController_1 = require("../controllers/HoleController");
const router = express_1.default.Router();
const holeController = new HoleController_1.HoleController();
router.get('/', holeController.getHoles);
router.get('/:holeId', holeController.getHoleById);
router.post('/', holeController.addHole);
router.put('/:holeId', holeController.updateHole);
router.delete('/', holeController.deleteHole);
exports.default = router;
