"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const RoomDao_1 = require("../dao/RoomDao");
const PlayerDao_1 = require("../dao/PlayerDao");
const HoleDao_1 = require("../dao/HoleDao");
const RoomController_1 = require("../controllers/RoomController");
const PlayerController_1 = require("../controllers/PlayerController");
const HoleController_1 = require("../controllers/HoleController");
const PlayerColorController_1 = require("../controllers/PlayerColorController");
const types_1 = require("./types");
const socket_1 = require("../socket");
const container = new inversify_1.Container();
exports.container = container;
container.bind(types_1.TYPES.SocketIO).toConstantValue(socket_1.io);
container.bind(types_1.TYPES.RoomDao).to(RoomDao_1.RoomDao);
container.bind(types_1.TYPES.RoomController).to(RoomController_1.RoomController);
container.bind(types_1.TYPES.PlayerDao).to(PlayerDao_1.PlayerDao);
container.bind(types_1.TYPES.PlayerController).to(PlayerController_1.PlayerController);
container.bind(types_1.TYPES.HoleDao).to(HoleDao_1.HoleDao);
container.bind(types_1.TYPES.HoleController).to(HoleController_1.HoleController);
container.bind(types_1.TYPES.PlayerColorController).to(PlayerColorController_1.PlayerColorController);