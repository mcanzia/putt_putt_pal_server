import { db } from '../configs/firebase';
import { JoinRoomDetails } from '../models/JoinRoomDetails';
import { LeaveRoomDetails } from '../models/LeaveRoomDetails';
import { Player } from '../models/Player';
import { Room } from '../models/Room';
import { DatabaseError } from '../util/error/CustomError';

export class RoomDao {

    async getRooms() {
        try {
            const roomsRef = db.ref('rooms');
            const snapshot = await roomsRef.once('value');
            const roomsData = snapshot.val();

            const rooms: Array<Room> = [];

            if (roomsData) {
                Object.keys(roomsData).forEach(key => {
                    const room: Room = new Room(key, roomsData[key].roomCode, roomsData[key].players, roomsData[key].holes);
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
            return new Room(roomId, roomData.roomCode, roomData.players, roomData.holes);
        } catch (error) {
            throw new DatabaseError("Could not retrieve room from database: " + error);
        }
    }

    async addRoom(room: Room) {
        try {
            const roomsRef = db.ref('rooms');
            const newRoomRef = roomsRef.push();

            await newRoomRef.set(room);

            return newRoomRef.key!;
        } catch (error) {
            throw new DatabaseError("Could not add room to database: " + error);
        }
    }

    async joinRoom(joinDetails: JoinRoomDetails) {
        try {
            const roomsRef = db.ref('rooms');
            const querySnapshot = await roomsRef.orderByChild('roomCode').equalTo(joinDetails.roomCode).once('value');
            if (!querySnapshot.exists()) {
                throw new Error('Room with the specified code does not exist.');
            }

            const roomKey = Object.keys(querySnapshot.val())[0];
            const room = querySnapshot.val()[roomKey];

            const playersRef = roomsRef.child(`${roomKey}/players`);
            const playerData = { playerName: joinDetails.playerName, playerNumber: room.players.length };
            const playerSnapshot = await playersRef.push(playerData);

            const newPlayer = new Player(playerSnapshot.key!, playerData.playerName, playerData.playerNumber);

            room.players.push(newPlayer);

            return { roomKey, ...room };
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

            const roomKey = Object.keys(querySnapshot.val())[0];
            const room = querySnapshot.val()[roomKey];

            const playersRef = roomsRef.child(`${roomKey}/players`);
            const playerSnapshot = await playersRef.orderByChild('id').equalTo(leaveDetails.player.id).once('value');

            if (!playerSnapshot.exists()) {
                throw new Error('Player not found in the room.');
            }

            const playerKey = Object.keys(playerSnapshot.val())[0];

            await playersRef.child(playerKey).remove();

            return { roomKey, ...room };
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