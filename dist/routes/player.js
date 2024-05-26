"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_redis_cache_1 = __importDefault(require("express-redis-cache"));
const inversify_config_1 = require("../configs/inversify.config");
const types_1 = require("../configs/types");
const router = express_1.default.Router();
const playerController = inversify_config_1.container.get(types_1.TYPES.PlayerController);
const redisCache = (0, express_redis_cache_1.default)();
router.get('/', redisCache.route({ expire: 60 }), (req, res, next) => playerController.getPlayers(req, res, next));
router.get('/:playerId', redisCache.route({ expire: 60 }), (req, res, next) => playerController.getPlayerById(req, res, next));
router.post('/', (req, res, next) => playerController.addPlayer(req, res, next));
router.put('/:playerId', (req, res, next) => playerController.updatePlayer(req, res, next));
router.delete('/', (req, res, next) => playerController.deletePlayer(req, res, next));
exports.default = router;
