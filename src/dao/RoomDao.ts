import { db } from '../configs/firebase';
import { JoinRoomDetails } from '../models/dao/JoinRoomDetails';
import { LeaveRoomDetails } from '../models/dto/LeaveRoomDetails';
import { CustomError, DatabaseError, DuplicateColorError, DuplicateNameError, NotFoundError, RoomNotFoundError, TooManyPlayersError } from '../util/error/CustomError';
import { PlayerDTO } from '../models/dto/PlayerDTO';
import { RoomDTO } from '../models/dto/RoomDTO';
import { deleteCachedValue, getCachedValue, setCachedValue } from '../util/cache/useCache';
import _ from 'lodash';
import { PlayerScoreDTO } from '../models/dto/PlayerScoreDTO';
import { injectable } from 'inversify';
import { io, socketRoomMap } from '../socket';

@injectable()
export class RoomDao {
    constructor() { }

    async getRooms() {
        try {
            const cacheKey = 'rooms';
            const cachedRooms = await getCachedValue(cacheKey);
            if (cachedRooms) {
                return JSON.parse(cachedRooms);
            }

            const roomsRef = db.ref('rooms');
            const snapshot = await roomsRef.once('value');
            const roomsData = snapshot.val();

            const rooms: Array<RoomDTO> = [];

            if (roomsData) {
                Object.keys(roomsData).forEach(key => {
                    const currentRoom = roomsData[key];
                    const room: RoomDTO = new RoomDTO(key, currentRoom.roomCode,
                        currentRoom.players, currentRoom.holes, currentRoom.allPlayersJoined,
                        currentRoom.numberOfHoles, currentRoom.isFinished);
                    rooms.push(room);
                });
            }

            await setCachedValue(cacheKey, JSON.stringify(rooms), {
                EX: 60
            });

            return rooms;
        } catch (error) {
            throw new DatabaseError("Could not retrieve rooms from database: " + error);
        }
    }

    async getRoomByNumber(roomNumber: string) {
        try {
            const cacheKey = `room:${roomNumber}`;
            const cachedRoom = await getCachedValue(cacheKey);
            if (cachedRoom) {
                return JSON.parse(cachedRoom);
            }

            const roomsRef = db.ref('rooms');
            const snapshot = await roomsRef.orderByChild('roomNumber').equalTo(roomNumber).once('value');
            const roomObject = snapshot.val();

            if (!roomObject) {
                throw new RoomNotFoundError('Room not found');
            }

            const roomId = Object.keys(roomObject)[0];
            const roomData = roomObject[roomId];

            const room = new RoomDTO(roomId, roomData.roomCode, roomData.players, roomData.holes,
                roomData.allPlayersJoined, roomData.numberOfHoles, roomData.isFinished);

            await setCachedValue(cacheKey, JSON.stringify(room), {
                EX: 60
            });

            return room;
        } catch (error) {
            if (error instanceof RoomNotFoundError) {
                throw error;
            }
            throw new DatabaseError("Could not retrieve room from database: " + error);
        }
    }

    async getRoomById(id: string) {
        try {
            // const cacheKey = `room:${id}`;
            // const cachedRoom = await getCachedValue(cacheKey);
            // if (cachedRoom) {
            //     return JSON.parse(cachedRoom);
            // }

            const roomsRef = db.ref('rooms');
            const snapshot = await roomsRef.orderByChild('id').equalTo(id).once('value');
            const roomObject = snapshot.val();

            if (!roomObject) {
                throw new RoomNotFoundError('Room not found');
            }

            const roomId = Object.keys(roomObject)[0];
            const roomData = roomObject[roomId];

            const room = new RoomDTO(roomId, roomData.roomCode, roomData.players, roomData.holes,
                roomData.allPlayersJoined, roomData.numberOfHoles, roomData.isFinished);

            // await setCachedValue(cacheKey, JSON.stringify(room), {
            //     EX: 60
            // });

            return room;
        } catch (error) {
            if (error instanceof RoomNotFoundError) {
                throw error;
            }
            throw new DatabaseError("Could not retrieve room from database: " + error);
        }
    }

    async addRoom(room: RoomDTO) {
        try {
            const roomsRef = db.ref('rooms');
            const newRoomRef = roomsRef.push();

            room.id = newRoomRef.key!;

            await newRoomRef.set({ ...room, lastActivity: Date.now() });

            await deleteCachedValue('rooms');

            const newRoomSnapshot = await roomsRef.child(newRoomRef.key!).once('value');
            const newRoom = newRoomSnapshot.val();

            return { ...newRoom, players: room.players };
        } catch (error) {
            throw new DatabaseError("Could not add room to database: " + error);
        }
    }

    async startGame(startGameDetails: RoomDTO) {
        try {
            const roomsRef = db.ref('rooms');
            const roomSnapshot = await roomsRef.child(startGameDetails.id).once('value');
            const room = roomSnapshot.val();

            if (!room) {
                throw new Error('Room not found');
            }

            const holesRef = roomsRef.child(`${startGameDetails.id}/holes`);

            const newHoles = Array.from({ length: startGameDetails.numberOfHoles }, (_, index) => {
                const holeNumber = index + 1;
                const playerScores: Array<PlayerScoreDTO> = [];
                Object.entries(room.players).forEach(([key]) => {
                    const playerScoreRef = holesRef.push();
                    playerScores.push(new PlayerScoreDTO(playerScoreRef.key!, 0, key))
                });

                const holeRef = holesRef.push();
                return {
                    id: holeRef.key,
                    holeNumber: holeNumber,
                    playerScores: playerScores
                };
            });

            for (const hole of newHoles) {
                await holesRef.child(hole.id!).set(hole);
            }

            await roomsRef.child(startGameDetails.id).update({
                numberOfHoles: startGameDetails.numberOfHoles
            });

            await deleteCachedValue(`room:${room.roomCode}`);
            await deleteCachedValue('rooms');

            const updatedRoomSnapshot = await roomsRef.child(startGameDetails.id).once('value');
            const updatedRoomData = updatedRoomSnapshot.val();

            return updatedRoomData;

        } catch (error) {
            throw new DatabaseError("Could not start game: " + error);
        }
    }

    async updateRoom(roomId: string, updatedRoom: RoomDTO) {
        try {
            const roomsRef = db.ref('rooms');
            const roomRef = roomsRef.child(roomId);

            const roomCopy = _.cloneDeep(updatedRoom);
            if (updatedRoom.players) {
                delete updatedRoom.players;
            }

            await roomRef.update({ ...updatedRoom, lastActivity: Date.now() });

            const updates: { [key: string]: any } = {};

            Object.entries(roomCopy.players!).forEach(([key, value]) => {
                updates[`/rooms/${roomId}/players/${key}`] = value;
            });

            await db.ref().update(updates);

            await deleteCachedValue(`room:${roomCopy.roomCode}`);
            await deleteCachedValue('rooms');

            const updatedRoomSnapshot = await roomRef.once('value');
            const updatedRoomData = updatedRoomSnapshot.val();

            return updatedRoomData;
        } catch (error) {
            throw new DatabaseError("Could not update room details: " + error);
        }
    }

    async joinRoom(joinDetails: JoinRoomDetails) {
        try {
            const roomsRef = db.ref('rooms');
            const querySnapshot = await roomsRef.orderByChild('roomCode').equalTo(joinDetails.roomCode).once('value');
            if (!querySnapshot.exists()) {
                throw new NotFoundError('Room with the specified code does not exist.');
            }

            const roomKey: string = Object.keys(querySnapshot.val())[0];
            const roomData: RoomDTO = querySnapshot.val()[roomKey];

            const room: RoomDTO = new RoomDTO(
                roomKey,
                roomData.roomCode,
                new Map(Object.entries(roomData.players! || {})),
                new Map(Object.entries(roomData.holes! || {})),
                roomData.allPlayersJoined,
                roomData.numberOfHoles,
                roomData.isFinished
            );


            if (room.players!.size >= 12) {
                throw new TooManyPlayersError();
            }

            for (const player of room.players!.values()) {
                if (player.name === joinDetails.playerName) {
                    throw new DuplicateNameError(`Player with the name ${joinDetails.playerName} already exists in the room.`);
                }
                if (joinDetails.color.id !== 0 && player.color.id === joinDetails.color.id) {
                    throw new DuplicateColorError(`A player in this room has already chosen this color.`);
                }
            }


            const playerRef = roomsRef.child(`${roomKey}/players`).push();
            const playerData: PlayerDTO = new PlayerDTO(playerRef.key!, joinDetails.playerName, joinDetails.isHost, joinDetails.color);

            await playerRef.set(playerData);

            room.players!.set(playerData.id, playerData);

            await deleteCachedValue(`players:${roomKey}`);
            await deleteCachedValue(`room:${room.roomCode}`);
            await deleteCachedValue('rooms');

            return room;
        } catch (error) {
            throw error;
        }
    }

    async leaveRoom(leaveDetails: LeaveRoomDetails) {
        try {
            const roomsRef = db.ref('rooms');
            const querySnapshot = await roomsRef.orderByChild('roomCode').equalTo(leaveDetails.roomCode).once('value');
            if (!querySnapshot.exists()) {
                throw new Error('Room with the specified code does not exist.');
            }

            const roomKey: string = Object.keys(querySnapshot.val())[0];
            const roomData: RoomDTO = { roomKey, ...querySnapshot.val()[roomKey] };

            const room: RoomDTO = new RoomDTO(
                roomKey,
                roomData.roomCode,
                new Map(Object.entries(roomData.players || {})),
                new Map(Object.entries(roomData.holes || {})),
                roomData.allPlayersJoined,
                roomData.numberOfHoles,
                roomData.isFinished
            );

            const playersRef = roomsRef.child(`${roomKey}/players`);
            const playerSnapshot = await playersRef.orderByKey().equalTo(leaveDetails.player.id).once('value');

            if (!playerSnapshot.exists()) {
                throw new Error('Player not found in the room.');
            }

            await playersRef.child(leaveDetails.player.id).remove();

            room.players!.delete(leaveDetails.player.id);

            await deleteCachedValue(`players:${roomKey}`);
            await deleteCachedValue(`room:${room.roomCode}`);
            await deleteCachedValue('rooms');

            return room;
        } catch (error) {
            throw new DatabaseError("Could not leave room: " + error);
        }
    }

    async deleteRoom(roomId: string) {
        try {
            const roomRef = db.ref(`rooms/${roomId}`);
            const roomSnapshot = await roomRef.once('value');
            const roomData = roomSnapshot.val();
            
            const socketsToDisconnect: Array<any> = [];

            socketRoomMap.forEach((playerRoom, socketId) => {
                console.log('DELETE INFO', playerRoom, socketId);
                if (playerRoom.roomId === roomId) {
                    const socket = io.sockets.sockets.get(socketId);
                    if (socket) {
                        socket.emit('roomDeleted', { roomId });
                        socketsToDisconnect.push(socket);
                    }
                }
            });

            for (const socket of socketsToDisconnect) {
                socketRoomMap.delete(socket.id);
                socket.disconnect(true);
            }

            await roomRef.remove();

            await deleteCachedValue(`room:${roomData.roomCode}`);
            await deleteCachedValue('rooms');
        } catch (error) {
            throw new DatabaseError("Could not delete room from database: " + error);
        }
    }

    async checkAndDeleteInactiveRooms() {
        const roomsRef = db.ref('rooms');
        const now = Date.now();
        const oneHourAgo = now - 3600000;

        roomsRef.once('value').then(snapshot => {
            snapshot.forEach(childSnapshot => {
                const roomId = childSnapshot.key;
                const roomData = childSnapshot.val();

                if (roomData.lastActivity && roomData.lastActivity < oneHourAgo) {
                    console.log(`Deleting inactive room ${roomId}`);
                    this.deleteRoom(roomId!);
                }
            });
        }).catch((error) => {
            throw new DatabaseError("Error performing database cleanup: " + error);
        });
    }

}
