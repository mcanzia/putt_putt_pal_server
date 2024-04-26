import { db } from '../configs/firebase';
import { JoinRoomDetails } from '../models/dao/JoinRoomDetails';
import { LeaveRoomDetails } from '../models/dto/LeaveRoomDetails';
import { Player } from '../models/dao/Player';
import { Room } from '../models/dao/Room';
import { DatabaseError } from '../util/error/CustomError';
import { PlayerDTO } from '../models/dto/PlayerDTO';
import { RoomDTO } from '../models/dto/RoomDTO';

export class RoomDao {

    async getRooms() {
        try {
            const roomsRef = db.ref('rooms');
            const snapshot = await roomsRef.once('value');
            const roomsData = snapshot.val();

            const rooms: Array<RoomDTO> = [];

            if (roomsData) {
                Object.keys(roomsData).forEach(key => {
                    const currentRoom = roomsData[key];
                    const room: RoomDTO = new RoomDTO(key, currentRoom.roomCode, 
                        currentRoom.players, currentRoom.holes, currentRoom.allPlayersJoined,
                        currentRoom.numberOfHoles);
                    rooms.push(room);
                });
            }
            return rooms;
        } catch (error) {
            throw new DatabaseError("Could not retrieve rooms from database: " + error);
        }
    }

    async getRoomByNumber(roomNumber: string) {
        try {
            const roomsRef = db.ref('rooms');
            const snapshot = await roomsRef.orderByChild('roomNumber').equalTo(roomNumber).once('value');
            const roomObject = snapshot.val();

            const roomId = Object.keys(roomObject)[0];
            const roomData = roomObject[roomId];
            return new RoomDTO(roomId, roomData.roomCode, roomData.players, roomData.holes, 
                roomData.allPlayersJoined, roomData.numberOfHoles);
        } catch (error) {
            throw new DatabaseError("Could not retrieve room from database: " + error);
        }
    }

    async addRoom(room: Room) {
        try {
            const roomsRef = db.ref('rooms');
            const newRoomRef = roomsRef.push();

            await newRoomRef.set(room);

            const newRoomSnapshot = await roomsRef.child(newRoomRef.key!).once('value');
            const newRoom = newRoomSnapshot.val();

            return newRoom;
        } catch (error) {
            throw new DatabaseError("Could not add room to database: " + error);
        }
    }

    async startGame(startGameDetails : RoomDTO) {
        try {
            const roomsRef = db.ref('rooms');
            const roomSnapshot = await roomsRef.child(startGameDetails.id).once('value');
            const room = roomSnapshot.val();

            if (!room) {
                throw new Error('Room not found');
            }

            const newHoles = Array.from({ length: startGameDetails.numberOfHoles }, (_, index) => {
                const holeNumber = index + 1;
                const playerScores = room.players.map((player: Player) => ({
                    score: 0,
                    player: { ...player }
                }));

                return {
                    holeNumber: holeNumber,
                    playerScores: playerScores
                };
            }); 

            await roomsRef.child(startGameDetails.id).update({
                holes: newHoles,
            });

            const updatedRoomSnapshot = await roomsRef.child(startGameDetails.id).once('value');
            const updatedRoomData = updatedRoomSnapshot.val();

            return updatedRoomData;

        } catch(error) {
            throw new DatabaseError("Could not start game: " + error);
        }
    }

    async updateRoom(roomId : string, updatedRoom : Room) {
        try {
            const roomsRef = db.ref('rooms');

            await roomsRef.child(roomId).update(updatedRoom);

            const updatedRoomSnapshot = await roomsRef.child(roomId).once('value');
            const updatedRoomData = updatedRoomSnapshot.val();

            return updatedRoomData;
        } catch(error) {
            throw new DatabaseError("Could not update room details: " + error);
        }
    }

    async joinRoom(joinDetails: JoinRoomDetails) {
        try {
            const roomsRef = db.ref('rooms');
            const querySnapshot = await roomsRef.orderByChild('roomCode').equalTo(joinDetails.roomCode).once('value');
            if (!querySnapshot.exists()) {
                throw new Error('Room with the specified code does not exist.');
            }

            const roomKey : string = Object.keys(querySnapshot.val())[0];
            const room : RoomDTO = {roomKey, ...querySnapshot.val()[roomKey]};

            const playersRef = roomsRef.child(`${roomKey}/players`);
            const playerData : Player = new Player(joinDetails.playerName, room.players.length);
            const playerSnapshot = await playersRef.push(playerData);

            const newPlayer = new PlayerDTO(playerSnapshot.key!, playerData.name, playerData.playerNumber);

            room.players.push(newPlayer);

            return room;
        } catch (error) {
            throw new DatabaseError("Could not join room: " + error);
        }
    }

    async leaveRoom(leaveDetails: LeaveRoomDetails) {
        try {
            const roomsRef = db.ref('rooms');
            const querySnapshot = await roomsRef.orderByChild('roomCode').equalTo(leaveDetails.roomCode).once('value');
            if (!querySnapshot.exists()) {
                throw new Error('Room with the specified code does not exist.');
            }

            const roomKey : string = Object.keys(querySnapshot.val())[0];
            const room : RoomDTO = {roomKey, ...querySnapshot.val()[roomKey]};

            const playersRef = roomsRef.child(`${roomKey}/players`);
            const playerSnapshot = await playersRef.orderByChild('id').equalTo(leaveDetails.player.id).once('value');

            if (!playerSnapshot.exists()) {
                throw new Error('Player not found in the room.');
            }

            const playerKey = Object.keys(playerSnapshot.val())[0];

            await playersRef.child(playerKey).remove();

            return room;
        } catch (error) {
            throw new DatabaseError("Could not join room: " + error);
        }
    }

    async deleteRoom(roomId: string) {
        try {
            const roomRef = db.ref(`rooms/${roomId}`);
            await roomRef.remove();
        } catch (error) {
            throw new DatabaseError("Could not delete room from database: " + error);
        }
    }

}