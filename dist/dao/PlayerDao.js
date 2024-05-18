"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDao = void 0;
const firebase_1 = require("../configs/firebase");
const PlayerDTO_1 = require("../models/dto/PlayerDTO");
const CustomError_1 = require("../util/error/CustomError");
class PlayerDao {
    async getPlayers(roomId) {
        try {
            let players = new Map();
            const playersRef = firebase_1.db.ref(`rooms/${roomId}/players`);
            const snapshot = await playersRef.once('value');
            if (!snapshot.exists()) {
                throw new Error('No such room found.');
            }
            players = snapshot.val();
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
            return new PlayerDTO_1.PlayerDTO(playerId, playerData.name, playerData.isHost, playerData.color);
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not retrieve player from database: " + error);
        }
    }
    async addPlayer(roomId, player) {
        try {
            const roomsRef = firebase_1.db.ref('rooms');
            const playersRef = await roomsRef.child(`${roomId}/players`).push();
            player.id = playersRef.key;
            console.log(`ADDPLAYER ${JSON.stringify(player)}`);
            await playersRef.set(player);
            const updatedPlayers = await this.getPlayers(roomId);
            return updatedPlayers;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not add player to database: " + error);
        }
    }
    async updatePlayer(roomId, playerId, updatedPlayer) {
        try {
            const playerRef = firebase_1.db.ref(`rooms/${roomId}/players/${playerId}`);
            await playerRef.update(updatedPlayer);
            const updatedPlayers = await this.getPlayers(roomId);
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
            const updatedPlayers = await this.getPlayers(roomId);
            return updatedPlayers;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not delete player from database: " + error);
        }
    }
}
exports.PlayerDao = PlayerDao;
