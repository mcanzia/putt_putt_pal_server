"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDao = void 0;
const firebase_1 = require("../configs/firebase");
const CustomError_1 = require("../util/error/CustomError");
class PlayerDao {
    async getPlayers(roomId) {
        try {
            let players = [];
            const playersRef = firebase_1.db.ref(`rooms/${roomId}/players`);
            const snapshot = await playersRef.once('value');
            if (!snapshot.exists()) {
                throw new Error('No such room found.');
            }
            const playersData = snapshot.val();
            players = Object.keys(playersData).map(key => ({
                id: key,
                ...playersData[key]
            }));
            return players;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not retrieve players from database: " + error);
        }
    }
    async getPlayerById(roomId, playerId) {
        try {
            const playerRef = firebase_1.db.ref(`rooms/${roomId}/players/${playerId}`);
            const snapshot = await playerRef.once('value');
            if (!snapshot.exists()) {
                throw new Error('No such player found in the specified room.');
            }
            const playerData = snapshot.val();
            return { id: playerId, ...playerData };
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not retrieve player from database: " + error);
        }
    }
    async addPlayer(roomId, player) {
        try {
            const playersRef = firebase_1.db.ref(`rooms/${roomId}/players`);
            const newPlayersRef = playersRef.push();
            await newPlayersRef.set(player);
            const updatedPlayers = this.getPlayers(roomId);
            return updatedPlayers;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not add player to database: " + error);
        }
    }
    async updatePlayer(roomId, playerId, updatedPlayer) {
        try {
            const playerRef = firebase_1.db.ref(`rooms/${roomId}/players`);
            await playerRef.child(playerId).update(updatedPlayer);
            const updatedPlayers = this.getPlayers(roomId);
            return updatedPlayers;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not update player details: " + error);
        }
    }
    async deletePlayer(roomId, playerId) {
        try {
            const playerRef = firebase_1.db.ref(`rooms/${roomId}/players/${playerId}`);
            await playerRef.remove();
            const updatedPlayers = this.getPlayers(roomId);
            return updatedPlayers;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not delete player from database: " + error);
        }
    }
}
exports.PlayerDao = PlayerDao;
