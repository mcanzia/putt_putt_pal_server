import 'reflect-metadata';
import { Container } from 'inversify';
import { RoomDao } from '../dao/RoomDao';
import { PlayerDao } from '../dao/PlayerDao';
import { HoleDao } from '../dao/HoleDao';
import { RoomController } from '../controllers/RoomController';
import { PlayerController } from '../controllers/PlayerController';
import { HoleController } from '../controllers/HoleController';
import {PlayerColorController} from '../controllers/PlayerColorController';
import { TYPES } from './types';
import { Server } from 'socket.io';
import { io } from '../socket';
import { SocketController } from '../controllers/SocketController';

const container = new Container();

container.bind<Server>(TYPES.SocketIO).toConstantValue(io);
container.bind<RoomDao>(TYPES.RoomDao).to(RoomDao);
container.bind<RoomController>(TYPES.RoomController).to(RoomController);
container.bind<PlayerDao>(TYPES.PlayerDao).to(PlayerDao);
container.bind<PlayerController>(TYPES.PlayerController).to(PlayerController);
container.bind<HoleDao>(TYPES.HoleDao).to(HoleDao);
container.bind<HoleController>(TYPES.HoleController).to(HoleController);
container.bind<PlayerColorController>(TYPES.PlayerColorController).to(PlayerColorController);
container.bind<SocketController>(TYPES.SocketController).to(SocketController);

export { container };
